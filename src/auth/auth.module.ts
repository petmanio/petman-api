import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';

import { AuthProvider } from './auth-provider.entity';
import { AuthProviderRepository } from './auth-provider.repository';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AuthProvider, AuthProviderRepository]), forwardRef(() => SharedModule), forwardRef(() => UserModule)],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {
}
