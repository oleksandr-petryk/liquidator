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
import { DrizzlePagination } from '../../../shared/interfaces/db.interface';
import {
  JwtTokenPayload,
  JwtTokensPair,
} from '../../../shared/interfaces/jwt-token.interface';
import { TemplatesEnum } from '../../../templates/templateNames';
import { AccountVerificationService } from '../../account-verification/services/account-verification.service';
import { SessionService } from '../../session/services/session.service';
import { UserService } from '../../user/services/user.service';
import { JwtInternalService } from './jwt-internal.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly userDao: UserDao,
    private readonly sessionDao: SessionDao,
    private readonly sessionService: SessionService,
    private readonly jwtInternalService: JwtInternalService,
    private readonly userService: UserService,
    private readonly accountVerificationService: AccountVerificationService,
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
   * 6. Create account veryfication record in DB and send veryfication email
   *
   * @returns new user
   */
  async register(data: RegisterRequestBodyDto): Promise<UserInsertModel> {
    const emailLowerCase = data.email.toLowerCase();
    const usernameLowerCase = data.username.toLowerCase();

    // 1. Check if user with email already exists
    const emailCheck = await this.userDao.findByEmail({
      email: emailLowerCase,
    });

    if (emailCheck) {
      this.logger.debug(`User with email: ${data.email} already exists`);
      throw new BadRequestException('User with that email already exist');
    }

    // 2. Check if user with phone number already exists
    const usernameCheck = await this.userDao.findByUsername({
      username: usernameLowerCase,
    });

    if (usernameCheck) {
      this.logger.debug(`User with username: ${data.username} already exists`);
      throw new BadRequestException('User with that username already exist');
    }

    // 3. Check if user with username already exists
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

    // 4. Hash password
    const saltRounds = 10; // TODO: use different salt each time

    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    // 5. Create new user in DB
    const newUser = await this.userDao.create({
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

    // 6. Create account veryfication record in DB and send veryfication email
    await this.accountVerificationService.sendRequest({
      template: TemplatesEnum.verificationEmail,
      username: newUser.username,
      email: newUser.email,
      userId: newUser.id,
    });

    return newUser;
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
    const user = await this.userService.getByEmail({ email: emailLowerCase });

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

  /**
   * Get list of sessions
   *
   * Logic:
   * 1. Get list of sessions
   *
   * @returns list of sessions
   */
  async getListOfSessions(
    user: JwtTokenPayload,
    pagination: DrizzlePagination,
  ): Promise<Listable<SessionSelectModel>> {
    const response = await this.sessionDao.listSessionsByUserId({
      userId: user.id,
      pagination,
    });

    return response;
  }

  /**
   * Update session name by id
   *
   * Logic:
   * 1. Check if session exist
   * 2. Update session name
   *
   * @returns session
   */
  async updateSession({
    id,
    name,
  }: {
    id: string;
    name: string;
  }): Promise<SessionSelectModel> {
    // 1. Check if session exist
    await this.sessionService.getById({ id });

    // 2. Update session name
    return await this.sessionDao.updateSession({
      id: id,
      data: {
        name: name,
      },
    });
  }

  /**
   * Delete session by id
   *
   * Logic:
   * 1. Check if session exist
   * 2. Delete session
   */
  async deleteSession(id: string): Promise<void> {
    // 1. Check if session exist
    await this.sessionService.getById({ id });

    // 2. Delete session
    await this.sessionDao.delete({ id: id });
  }

  /**
   * Account verification
   *
   * Logic:
   * 1. Check is account can verify and set user verifyed field to true
   */
  async accountVerification({
    userId,
    code,
  }: {
    userId: string;
    code: string;
  }): Promise<void> {
    // 1. Check is account can verify and set user verifyed field to true
    await this.accountVerificationService.verifyUserAccount({ userId, code });
  }

  /**
   * Send new verification email
   *
   * 1. Check is account can verify
   * 2. Get user by id
   * 3. Create account veryfication record in DB and send veryfication email
   */
  async sendVerificatioEmail(userId: string): Promise<void> {
    // 1. Check is account can verify
    await this.accountVerificationService.canVerifyAccount({ userId });

    // 2. Get user by id
    const user = await this.userService.getById({ id: userId });

    // 3. Create account veryfication record in DB and send veryfication email
    await this.accountVerificationService.sendRequest({
      template: TemplatesEnum.verificationEmail,
      username: user.username,
      email: user.email,
      userId: user.id,
    });
  }
}
