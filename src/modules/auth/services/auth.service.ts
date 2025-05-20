import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import jwt from 'jsonwebtoken';

import { UserDao } from '../../../shared/dao/user.dto';
import { CreateUserDto } from '../../../shared/dto/auth/createUser.dto';
import { login } from '../../../shared/dto/auth/login.dto';
import { UserInsertModel } from '../../../shared/modules/drizzle/schemas';

@Injectable()
export class AuthService {
  constructor(private userDao: UserDao) {}

  async register(dto: CreateUserDto): Promise<UserInsertModel> {
    const emailCheck = await this.userDao.findByEmail({ email: dto.email });
    const usernameCheck = await this.userDao.findByUsername({
      username: dto.username,
    });
    const phoneNumberCheck = await this.userDao.findByPhoneNumber({
      phoneNumber: dto.phoneNumber,
    });

    if (emailCheck) {
      throw new BadRequestException('User with that email alredy exist');
    }
    if (usernameCheck) {
      throw new BadRequestException('User with that username alredy exist');
    }
    if (phoneNumberCheck) {
      throw new BadRequestException('User with that phoneNumber alredy exist');
    }

    const newUser = this.userDao.create({ data: dto });

    return newUser;
  }

  async login(dto: login): Promise<string> {
    const user = await this.userDao.findByEmail({ email: dto.email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password != dto.password) {
      throw new BadRequestException('Incorrect password');
    }

    const token = jwt.sign(user.id, process.env.SECRET!, {
      expiresIn: '1h', // process.env.JWT_ACCESS_TOKEN_EXPIRES_IN - give a type error
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
