import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { SessionDao } from '../../../shared/dao/session.dto';
import { UserDao } from '../../../shared/dao/user.dto';
import {
  PatchSessionRequestBodyDto,
  RegisterRequestBodyDto,
} from '../../../shared/dto/controllers/auth/request-body.dto';
import { SessionResponseBodyDto } from '../../../shared/dto/controllers/auth/response-body.dto';
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
      throw new BadRequestException('User with that email already exist');
    }

    const usernameCheck = await this.userDao.findByUsername({
      username: usernameLowerCase,
    });

    if (usernameCheck) {
      throw new BadRequestException('User with that username already exist');
    }

    if (data.phoneNumber) {
      const phoneNumberCheck = await this.userDao.findByPhoneNumber({
        phoneNumber: data.phoneNumber,
      });

      if (phoneNumberCheck) {
        throw new BadRequestException(
          'User with that phoneNumber already exist',
        );
      }
    }

    const saltRounds = 10; // TODO: use different salt each time

    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const newUser = this.userDao.create({
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

    return newUser;
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
      throw new BadRequestException('User not found');
    }

    const passwordCheck = await bcrypt.compare(data.password, user.password);

    if (!passwordCheck) {
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
   * 1. Uncode refresh token
   * 2. Get all sessions by user id
   *
   * @returns list of sessions
   */
  getSessions(
    dto: SessionResponseBodyDto,
  ): Promise<Omit<SessionSelectModel, 'user'>[] | undefined> {
    const payload = this.jwtInternalService.verifyRefreshToken(dto.token);

    const sessions = this.sessionDao.findByUserId({ id: payload.id });

    return sessions;
  }

  updateSessionName(
    dto: PatchSessionRequestBodyDto,
    id: string,
  ): Promise<Omit<SessionSelectModel, 'user'> | unknown> {
    const user = this.sessionDao.updateSessionName({
      id: id,
      data: dto.name,
    });

    if (!user) {
      throw new BadRequestException('Session not found');
    }

    return user;
  }
}
