import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PinoLogger } from 'nestjs-pino';

import { UserDao } from '../../../shared/dao/user.dto';
import { RegisterRequestBodyDto } from '../../../shared/dto/controllers/auth/request-body.dto';
import type { JwtTokensPair } from '../../../shared/interfaces/jwt-token.interface';
import type {
  UserInsertModel,
  UserSelectModel,
} from '../../../shared/types/db.type';
import { JwtInternalService } from './jwt-internal.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly userDao: UserDao,
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
}
