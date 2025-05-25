import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserDao } from '../../../shared/dao/user.dto';
import { CreateUserDto } from '../../../shared/dto/auth/createUser.dto';
import { login } from '../../../shared/dto/auth/login.dto';
import { UserInsertModel } from '../../../shared/modules/drizzle/schemas';

@Injectable()
export class AuthService {
  constructor(
    private userDao: UserDao,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto): Promise<UserInsertModel> {
    const emailCheck = await this.userDao.findByEmail({
      email: dto.email,
    });

    if (emailCheck) {
      throw new BadRequestException('User with that email alredy exist');
    }

    const usernameCheck = await this.userDao.findByUsername({
      username: dto.username,
    });

    if (usernameCheck) {
      throw new BadRequestException('User with that username alredy exist');
    }

    if (dto.phoneNumber) {
      const phoneNumberCheck = await this.userDao.findByPhoneNumber({
        phoneNumber: dto.phoneNumber,
      });

      if (phoneNumberCheck) {
        throw new BadRequestException(
          'User with that phoneNumber alredy exist',
        );
      }
    }

    const saltRounds = 10; //

    const password = await bcrypt.hash(dto.password, saltRounds);

    const data: UserInsertModel = {
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      username: dto.username,
      firstName: dto.firstName,
      lastName: dto.lastName,
      dateOfBirth: dto.dateOfBirth,
      password: password,
      gender: dto.gender,
    };

    const newUser = this.userDao.create({ data: data });

    return newUser;
  }

  async login(dto: login): Promise<string> {
    const user = await this.userDao.findByEmail({ email: dto.email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordCheck = await bcrypt.compare(dto.password, user.password);

    if (!passwordCheck) {
      throw new BadRequestException('Incorrect password');
    }

    const token: string = this.jwtService.sign({
      email: user.email,
      id: user.id,
    });

    return token;
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
