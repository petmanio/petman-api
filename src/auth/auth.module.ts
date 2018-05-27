import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthProvider } from './auth-provider.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([AuthProvider])],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {
}
