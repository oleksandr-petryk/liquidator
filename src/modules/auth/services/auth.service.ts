import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PinoLogger } from 'nestjs-pino';

import {
  SessionDao,
  SessionSelectModel,
} from '../../../shared/dao/session.dao';
import {
  UserDao,
  UserInsertModel,
  UserSelectModel,
} from '../../../shared/dao/user.dao';
import { UserAgentAndIp } from '../../../shared/decorators/user-agent-and-ip.decorator';
import { RegisterRequestBodyDto } from '../../../shared/dto/controllers/auth/request-body.dto';
import { Listable } from '../../../shared/interfaces/abstract.interface';
import {
  JwtTokenPayload,
  JwtTokensPair,
} from '../../../shared/interfaces/jwt-token.interface';
import { JwtInternalService } from './jwt-internal.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly userDao: UserDao,
    private readonly sessionDao: SessionDao,
    private readonly jwtInternalService: JwtInternalService,
  ) {}

  /**
   * Register a new user
   *
   * Logic:
   * 1. Check if user with email already exists
   * 2. Check if user with phone number already exists
   * 3. Check if user with username already exists
   * 4. Hash password
   * 5. Create new user in DB
   *
   * @returns new user
   */
  async register(data: RegisterRequestBodyDto): Promise<UserInsertModel> {
    const emailLowerCase = data.email.toLowerCase();
    const usernameLowerCase = data.username.toLowerCase();

    const emailCheck = await this.userDao.findByEmail({
      email: emailLowerCase,
    });

    if (emailCheck) {
      this.logger.debug(`User with email: ${data.email} already exists`);
      throw new BadRequestException('User with that email already exist');
    }

    const usernameCheck = await this.userDao.findByUsername({
      username: usernameLowerCase,
    });

    if (usernameCheck) {
      this.logger.debug(`User with username: ${data.username} already exists`);
      throw new BadRequestException('User with that username already exist');
    }

    if (data.phoneNumber) {
      const phoneNumberCheck = await this.userDao.findByPhoneNumber({
        phoneNumber: data.phoneNumber,
      });

      if (phoneNumberCheck) {
        this.logger.debug(
          `User with phoneNumber: ${data.phoneNumber} already exists`,
        );
        throw new BadRequestException(
          'User with that phoneNumber already exist',
        );
      }
    }

    const saltRounds = 10; // TODO: use different salt each time

    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    return this.userDao.create({
      data: {
        email: emailLowerCase,
        username: usernameLowerCase,
        phoneNumber: data.phoneNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        password: hashedPassword,
        gender: data.gender,
      },
    });
  }

  /**
   * Login
   *
   * Logic:
   * 1. Check if user exist
   * 2. Check if password is correct
   * 3. Generate tokens
   * 4. Create session
   */
  async login(
    data: Pick<UserSelectModel, 'email' | 'password'>,
    userAgentAndIp: UserAgentAndIp,
  ): Promise<JwtTokensPair> {
    const emailLowerCase = data.email.toLowerCase();

    // 1. Check if user exist
    const user = await this.userDao.getByEmail({ email: emailLowerCase });

    // 2. Check if password is correct
    const passwordCheck = await bcrypt.compare(data.password, user.password);
    if (!passwordCheck) {
      this.logger.debug(`Wrong password, email ${data.email}`);
      throw new BadRequestException('Incorrect password');
    }

    // 3. Generate tokens
    const tokensPair = this.jwtInternalService.generatePairTokens({
      id: user.id,
    });

    // 4. Create session
    await this.sessionDao.create({
      data: {
        name:
          userAgentAndIp.userAgent && userAgentAndIp.userAgent.length >= 9
            ? userAgentAndIp.userAgent.slice(0, 6) + '...'
            : userAgentAndIp.userAgent || '',
        userId: user.id,
        token: tokensPair.refreshToken,
      },
    });

    return tokensPair;
  }

  verify(): void {
    console.log('verify');
  }

  google(): void {
    console.log('google');
  }

  googleCallback(): void {
    console.log('google callback');
  }

  async getListOfSessions(
    user: JwtTokenPayload,
  ): Promise<Listable<SessionSelectModel>> {
    const response = await this.sessionDao.listSessionsByUserId({
      userId: user.id,
    });

    return response;
  }

  async updateSession({
    id,
    name,
  }: {
    id: string;
    name: string;
  }): Promise<SessionSelectModel> {
    await this.sessionDao.getSessionById({ id: id });

    return await this.sessionDao.updateSession({
      id: id,
      data: {
        name: name,
      },
    });
  }

  async deleteSession(id: string): Promise<void> {
    await this.sessionDao.getSessionById({ id: id });

    await this.sessionDao.delete({ id: id });
  }
}
