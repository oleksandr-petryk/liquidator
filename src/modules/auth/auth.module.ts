import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserDao } from '../../shared/dao/user.dto';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { AuthControllerService } from './services/auth-controller.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthControllerService, UserDao],
})
export class AuthModule {}
