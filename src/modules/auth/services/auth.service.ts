import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  register(): void {
    console.log('register');
  }

  login(): void {
    console.log('log-in');
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
