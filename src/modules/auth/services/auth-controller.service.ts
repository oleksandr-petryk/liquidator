import { Injectable } from '@nestjs/common';

import { AuthService } from './auth.service';

@Injectable()
export class AuthControllerService {
  constructor(private readonly authService: AuthService) {}

  register(): void {
    return this.authService.register();
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
