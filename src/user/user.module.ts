import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user.entity';
import { UserData } from './user-data.entity';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserData])],
  providers: [UserService],
})
export class UserModule {
}
