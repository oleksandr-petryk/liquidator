import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { randomUUID } from 'crypto';
import { PinoLogger } from 'nestjs-pino';

import {
  SessionDao,
  SessionSelectModel,
} from '../../3_componentes/dao/session.dao';
import {
  UserDao,
  UserInsertModel,
  UserSelectModel,
} from '../../3_componentes/dao/user.dao';
import { RedisService } from '../../4_low/redis/redis.service';
import { UserRegistrationSignal } from '../../4_low/temporal/user-registration/user-registration.signal';
import { EnvConfig } from '../../5_shared/config/configuration';
import { UserAgentAndIp } from '../../5_shared/decorators/user-agent-and-ip.decorator';
import { Listable } from '../../5_shared/interfaces/abstract.interface';
import { DrizzlePagination } from '../../5_shared/interfaces/db.interface';
import {
  JwtTokenPayload,
  JwtTokensPair,
} from '../../5_shared/interfaces/jwt-token.interface';
import { TemplatesEnum } from '../../5_shared/misc/handlebars/email/template-names';
import { RegisterRequestBodyDto } from '../../6_model/dto/io/auth/request-body.dto';
import { GetUserResponseBodyDto } from '../../6_model/dto/io/auth/response-body.dto';
import { AccountVerificationService } from '../account-verification/account-verification.service';
import { SessionService } from '../session/session.service';
import { UserService } from '../user/user.service';
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
    private readonly redisService: RedisService,
    private readonly userRegistrationSignal: UserRegistrationSignal,
    private readonly configService: ConfigService<EnvConfig>,
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

    // 5. Create a new user in DB
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

    // Reworked with Temporal
    await this.userRegistrationSignal.trigger(newUser.id);

    return newUser;
  }

  /**
   * Login
   *
   * Logic:
   * 1. Check if a user exists
   * 2. Check if a password is correct
   * 3. Generate tokens
   * 4. Create a session
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

    const jti = randomUUID();

    // 3. Generate tokens
    const tokensPair = this.jwtInternalService.generatePairTokens({
      id: user.id,
      jti,
    });

    // 4. Create session
    await this.sessionDao.create({
      data: {
        name:
          userAgentAndIp.userAgent && userAgentAndIp.userAgent.length >= 9
            ? userAgentAndIp.userAgent.slice(0, 6) + '...'
            : userAgentAndIp.userAgent || '',
        userId: user.id,
        refreshTokenHash: crypto
          .createHash('sha256')
          .update(tokensPair.refreshToken)
          .digest('hex'),
        jti,
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
   * 1. Get session if exist
   * 2. Save token in redis
   * 3. Delete session
   */
  async deleteSession({ id }: { id: string }): Promise<void> {
    // 1. Get session if exist
    const session = await this.sessionService.getById({ id });

    // 2. Save token in redis
    await this.redisService.setValue({
      key: session.jti,
      value: 1,
      ttl: this.configService.getOrThrow<number>('JWT_ACCESS_TOKEN_EXPIRES_IN'),
    });

    // 3. Delete session
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

  async getUser(userId: string): Promise<GetUserResponseBodyDto> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, status, ...user } = await this.userDao.findById({
      id: userId,
    });

    return user;
  }
}
