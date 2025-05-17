import { Body, Injectable } from '@nestjs/common';
import { InferInsertModel } from 'drizzle-orm';

import { Gender, user } from '../../../shared/modules/drizzle/schemas';
import { AuthService } from './auth.service';

@Injectable()
export class AuthControllerService {
  constructor(private readonly authService: AuthService) {}

  register(
    @Body()
    userData: {
      email: string;
      phoneNumber: string;
      username: string;
      firstName: string;
      lastName: string;
      dateOfBirth: Date;
      gender: Gender | null | undefined;
      pictureId: number | null;
      password: string;
      recoveryEmailAddress: string;
    },
  ): Promise<InferInsertModel<typeof user>> {
    return this.authService.register(userData);
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
