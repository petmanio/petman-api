import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user.entity';
import { UserData } from './user-data.entity';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserDataRepository } from './user-data.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserData, UserRepository, UserDataRepository])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {
}
