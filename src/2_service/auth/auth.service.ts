import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { PinoLogger } from 'nestjs-pino';

import { ClientFingerprintDao } from '../../3_components/dao/client-fingerprint.dao';
import { PasswordResetRequestDao } from '../../3_components/dao/password-reset-request.dao';
import {
  SessionDao,
  SessionSelectModel,
} from '../../3_components/dao/session.dao';
import {
  UserDao,
  UserInsertModel,
  UserSelectModel,
} from '../../3_components/dao/user.dao';
import { HandlebarsService } from '../../3_components/handlebars/handlebars.service';
import { MailService } from '../../3_components/mail/mail.service';
import { RedisService } from '../../4_low/redis/redis.service';
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
import { PasswordResetResponseBodyDto } from '../../6_model/dto/io/auth/response-body.dto';
import { AccountVerificationService } from '../account-verification/account-verification.service';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { ClientFingerprintService } from '../client-fingerprint/client-fingerprint.service';
import { PasswordResetRequestService } from '../password-reset-request/password-reset-request.service';
import { SessionService } from '../session/session.service';
import { UserService } from '../user/user.service';
import { JwtInternalService } from './jwt-internal.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly userDao: UserDao,
    private readonly sessionDao: SessionDao,
    private readonly passwordResetRequestDao: PasswordResetRequestDao,
    private readonly clientFingerprintDao: ClientFingerprintDao,
    private readonly sessionService: SessionService,
    private readonly jwtInternalService: JwtInternalService,
    private readonly userService: UserService,
    private readonly accountVerificationService: AccountVerificationService,
    private readonly passwordResetRequestService: PasswordResetRequestService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService<EnvConfig>,
    private readonly mailService: MailService,
    private readonly handlebarsService: HandlebarsService,
    private readonly activityLogService: ActivityLogService,
    private readonly clientFingerprintService: ClientFingerprintService,
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
   * 6. Create account verification record in DB and send verification email
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

    // 6. Create account verification record in DB and send verification email
    await this.accountVerificationService.sendRequest({
      username: newUser.username,
      email: newUser.email,
      userId: newUser.id,
    });

    await this.activityLogService.createLog_Registration({
      userId: newUser.id,
    });

    return newUser;
  }

  /**
   * Login
   *
   * Logic:
   * 1. Check if a user exists
   * 2. Check if a password is correct
   * 3. Generate tokens
   * 4. Create a client-fingerprint
   * 5. Create a session
   */
  async login(
    data: Pick<UserSelectModel, 'email' | 'password'>,
    userAgentAndIp: UserAgentAndIp,
  ): Promise<JwtTokensPair> {
    const emailLowerCase = data.email.toLowerCase();

    // 1. Check if user exist
    const user = await this.userDao.findByEmail({ email: emailLowerCase });
    if (!user) {
      this.logger.debug(`User not found, email ${data.email}`);
      throw new BadRequestException('User not exists or password is wrong');
    }

    // 2. Check if password is correct
    const passwordCheck = await bcrypt.compare(data.password, user.password);
    if (!passwordCheck) {
      this.logger.debug(`Wrong password, email ${data.email}`);
      await this.activityLogService.createLog_LoginFailedWithInvalidPassword({
        userId: user.id,
      });
      throw new BadRequestException('User not exists or password is wrong');
    }

    const jti = randomUUID();

    // 3. Generate tokens
    const tokensPair = this.jwtInternalService.generatePairTokens({
      id: user.id,
      jti,
    });

    // 4. Create client-fingerprint
    const clientFingerprint = await this.clientFingerprintDao.create({
      data: {
        ip: userAgentAndIp.ipAddress,
        userAgent: userAgentAndIp.userAgent,
      },
    });

    // 5. Create session
    await this.sessionService.createNewSession({
      userAgentAndIp,
      userId: user.id,
      clientFingerprintId: clientFingerprint.id,
      refreshToken: tokensPair.refreshToken,
      jti,
    });

    await this.activityLogService.createLog_Login({
      userId: user.id,
      clientFingerprintId: clientFingerprint.id,
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
    const sessionRecord = await this.sessionService.getById({ id });

    await this.activityLogService.createLog_UpdateSessionName({
      userId: sessionRecord.userId,
      clientFingerprintId: sessionRecord.clientFingerprintId,
    });

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

    await this.activityLogService.createLog_DeleteSession({
      userId: session.userId,
      clientFingerprintId: session.clientFingerprintId,
    });
  }

  /**
   * Account verification
   *
   * Logic:
   * 1. Check is account can verify and set user verified field to true
   */
  async accountVerification({
    userId,
    code,
    jti,
  }: {
    userId: string;
    code: string;
    jti: string;
  }): Promise<void> {
    await this.accountVerificationService.verifyUserAccount({ userId, code });

    const clientFingerprint = await this.clientFingerprintService.getByJti(jti);

    await this.activityLogService.createLog_AccountVerification({
      userId,
      clientFingerprintId: clientFingerprint.id,
    });
  }

  /**
   * Send new verification email
   *
   * Logic:
   * 1. Check is account can verify
   * 2. Get user by id
   * 3. Create account verification record in DB and send verification email
   */
  async sendVerificationEmail(userId: string): Promise<void> {
    // 1. Check is account can verify
    await this.accountVerificationService.canVerifyAccount({ userId });

    // 2. Get user by id
    const user = await this.userService.getById({ id: userId });

    // 3. Create account verification record in DB and send verification email
    await this.accountVerificationService.sendRequest({
      username: user.username,
      email: user.email,
      userId: user.id,
    });
  }

  /**
   * Send new password reset email
   *
   * Logic:
   * 1. Get user by id
   * 2. Check if user exist
   * 3. Check if user can send request
   * 4. Create password reset request record in DB and send password reset email
   */
  async sendPasswordResetRequestEmail(email: string): Promise<void> {
    // 1. Get user by email
    const user = await this.userDao.findByEmail({ email });

    // 2. Check if user exist
    if (!user) {
      throw new BadRequestException();
    }

    // 3. Check if user can send request
    if (!(await this.passwordResetRequestService.canSendRequest(user.id))) {
      throw new BadRequestException();
    }

    // 4. Create account verification record in DB and send verification email
    await this.passwordResetRequestService.sendRequest({
      username: user.username,
      email: user.email,
      userId: user.id,
    });
  }

  /**
   * Password reset
   *
   * Logic:
   * 1. Check if user can reset password, hash password and change password in db
   */
  async passwordReset({
    email,
    code,
    newPassword,
  }: {
    email: string;
    code: string;
    newPassword: string;
  }): Promise<PasswordResetResponseBodyDto | undefined> {
    const user = await this.userDao.findByEmail({ email });

    if (!user) {
      throw new BadRequestException();
    }

    const passwordResetRequestRecord =
      await this.passwordResetRequestDao.findByUserId({ userId: user.id });

    if (
      (await this.passwordResetRequestService.canResetPassword({
        passwordResetRequestRecord,
        code,
      })) === false
    ) {
      throw new BadRequestException();
    }

    const saltRounds = 10; // TODO: use different salt each time

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await this.userService.changePassword({
      newPassword: hashedPassword,
      userId: user.id,
    });

    return { message: 'Password successfully changed' };
  }

  async passwordChange({
    userId,
    oldPassword,
    newPassword,
  }: {
    userId: string;
    oldPassword: string;
    newPassword: string;
  }): Promise<PasswordResetResponseBodyDto | undefined> {
    const user = await this.userDao.findById({ id: userId });

    const saltRounds = 10; // TODO: use different salt each time

    const passwordCheck = await bcrypt.compare(oldPassword, user.password);

    if (!passwordCheck) {
      throw new BadRequestException('Incorrect password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await this.userService.changePassword({
      newPassword: hashedPassword,
      userId: user.id,
    });

    await this.mailService.sendEmail({
      to: user.email,
      subject: 'Password changed',
      html: await this.handlebarsService.render(
        TemplatesEnum.passwordChangedNotification,
        {
          name: user.username,
          email: user.email,
          year: new Date().getFullYear(),
        },
      ),
    });

    return { message: 'Password successfully changed' };
  }
}
