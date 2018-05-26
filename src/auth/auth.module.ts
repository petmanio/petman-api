import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user.entity';
import { UserData } from './user-data.entity';
import { AuthProvider } from './auth-provider.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserData, AuthProvider])],
})
export class AuthModule {
}
