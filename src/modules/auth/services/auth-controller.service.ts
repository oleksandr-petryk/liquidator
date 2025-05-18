import { Body, Injectable } from '@nestjs/common';
import { InferInsertModel } from 'drizzle-orm';

import { CreateUserDto } from '../../../shared/dto/createUser.dto';
import { user } from '../../../shared/modules/drizzle/schemas';
import { AuthService } from './auth.service';

@Injectable()
export class AuthControllerService {
  constructor(private readonly authService: AuthService) {}

  register(@Body() dto: CreateUserDto): Promise<InferInsertModel<typeof user>> {
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
