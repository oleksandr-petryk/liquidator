import { Injectable } from '@nestjs/common';

import { CreateUserDto } from '../../../shared/dto/auth/createUser.dto';
import { login } from '../../../shared/dto/auth/login.dto';
import { UserInsertModel } from '../../../shared/modules/drizzle/schemas';
import { AuthService } from './auth.service';

@Injectable()
export class AuthControllerService {
  constructor(private readonly authService: AuthService) {}

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
  register(dto: CreateUserDto): Promise<UserInsertModel> {
    return this.authService.register(dto);
  }

  login(dto: login): Promise<string> {
    return this.authService.login(dto);
  }

  verify(): void {
    return this.authService.verify();
  }

  google(): void {
    return this.authService.google();
  }

  googleCallback(): void {
    return this.authService.googleCallback();
  }
}
