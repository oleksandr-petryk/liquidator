import { Injectable } from '@nestjs/common';

import { CreateUserDto } from '../../../shared/dto/createUser.dto';
import { UserInsertModel } from '../../../shared/modules/drizzle/schemas';
import { AuthService } from './auth.service';

@Injectable()
export class AuthControllerService {
  constructor(private readonly authService: AuthService) {}

  register(dto: CreateUserDto): Promise<UserInsertModel> {
    return this.authService.register(dto);
  }

  login(): void {
    return this.authService.login();
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
