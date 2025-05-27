import { Injectable } from '@nestjs/common';

import { RegisterRequestBodyDto } from '../../../shared/dto/controllers/auth/request-body.dto';
import type { JwtTokensPair } from '../../../shared/interfaces/jwt-token.interface';
import type {
  UserInsertModel,
  UserSelectModel,
} from '../../../shared/types/db.type';
import { AuthService } from './auth.service';

@Injectable()
export class AuthControllerService {
  constructor(private readonly authService: AuthService) {}

  async register(dto: RegisterRequestBodyDto): Promise<UserInsertModel> {
    return await this.authService.register(dto);
  }

  async login(
    data: Pick<UserSelectModel, 'email' | 'password'>,
  ): Promise<JwtTokensPair> {
    return await this.authService.login(data);
  }

  // verify(): void {
  //   return this.authService.verify();
  // }

  // google(): void {
  //   return this.authService.google();
  // }

  // googleCallback(): void {
  //   return this.authService.googleCallback();
  // }
}
