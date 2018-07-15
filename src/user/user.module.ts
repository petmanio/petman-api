import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user.entity';
import { UserData } from './user-data.entity';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserDataRepository } from './user-data.repository';
import { UserController } from './user.controller';
import { UserOwnerGuard } from './user-owner.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserData, UserRepository, UserDataRepository])],
  providers: [UserService, UserOwnerGuard],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {
}
