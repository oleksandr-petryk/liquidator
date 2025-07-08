import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PinoLogger } from 'nestjs-pino';

import { SessionDao } from '../../../shared/dao/session.dto';
import { UserDao } from '../../../shared/dao/user.dto';
import {
  PatchSessionRequestBodyDto,
  RegisterRequestBodyDto,
} from '../../../shared/dto/controllers/auth/request-body.dto';
import type { JwtTokensPair } from '../../../shared/interfaces/jwt-token.interface';
import type {
  SessionSelectModel,
  UserInsertModel,
  UserSelectModel,
} from '../../../shared/types/db.type';
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
   * 3. Generate token
   *
   * @returns token
   */
  async login(
    data: Pick<UserSelectModel, 'email' | 'password'>,
  ): Promise<JwtTokensPair> {
    const emailLowerCase = data.email.toLowerCase();

    const user = await this.userDao.findByEmail({ email: emailLowerCase });

    if (!user) {
      this.logger.debug(`User not found, email ${data.email}`);
      throw new BadRequestException('User not found');
    }

    const passwordCheck = await bcrypt.compare(data.password, user.password);

    if (!passwordCheck) {
      this.logger.debug(`Wrong password, email ${data.email}`);
      throw new BadRequestException('Incorrect password');
    }

    const tokensPair = this.jwtInternalService.generatePairTokens({
      id: user.id,
    });

    // TODO: create session in DB
    await this.sessionDao.create({
      data: {
        name: 'MacBook',
        userId: user.id,
        refreshToken: tokensPair.refreshToken,
      },
    }); // for tests

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
   * Get list of user sessions
   *
   * Logic:
   * 1. Uncode access token
   * 2. Get all sessions by user id
   *
   * @returns list of sessions
   */
  getSessions(token: string): Promise<Omit<SessionSelectModel, 'user'>[]> {
    try {
      const payload = this.jwtInternalService.verifyAccessToken(token);

      const sessions = this.sessionDao.findByUserId({ id: payload.id });

      return sessions;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(error);
    }
  }

  /**
   * Update session name
   *
   * Logic:
   * 1. Update session name
   * 2. Check if updated exist
   *
   * @returns updated session
   */
  async updateSessionName(
    dto: PatchSessionRequestBodyDto,
    id: string,
  ): Promise<Omit<SessionSelectModel, 'user'> | unknown> {
    try {
      await this.sessionDao.findByIdOrThrow({ id: id });

      const updatedSession = this.sessionDao.updateSessionName({
        id: id,
        data: dto.name,
      });

      return updatedSession;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(error);
    }
  }

  /**
   * Delete session
   *
   * Logic:
   * 1. Delete session name
   * 2. Check if deleted exist
   *
   * @returns deleted session
   */
  async deleteSession(id: string): Promise<Omit<SessionSelectModel, 'user'>> {
    try {
      await this.sessionDao.findByIdOrThrow({ id: id });

      return await this.sessionDao.delete({ id: id });
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(error);
    }
  }
}
