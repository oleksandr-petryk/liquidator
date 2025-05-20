import { Injectable } from '@nestjs/common';

import { CreateUserDto } from '../../../shared/dto/auth/createUser.dto';
import { login } from '../../../shared/dto/auth/login.dto';
import { UserInsertModel } from '../../../shared/modules/drizzle/schemas';
import { AuthService } from './auth.service';

@Injectable()
export class AuthControllerService {
  constructor(private readonly authService: AuthService) {}

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
