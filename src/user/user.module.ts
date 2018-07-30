import {
  MiddlewareConsumer,
  Module,
  NestModule,
  forwardRef,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SitterModule } from '../sitter/sitter.module';
import { WalkerModule } from '../walker/walker.module';
import { AdoptModule } from '../adopt/adopt.module';
import { LostFoundModule } from '../lost-found/lost-found.module';
import { User } from './user.entity';
import { UserData } from './user-data.entity';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserDataRepository } from './user-data.repository';
import { UserController } from './user.controller';
import { UserMiddleware } from './user.middleware';
import { UserExistsGuard } from './user-exists.guard';
import { UserOwnerGuard } from './user-owner.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserData,
      UserRepository,
      UserDataRepository,
    ]),
    forwardRef(() => SitterModule),
    forwardRef(() => WalkerModule),
    forwardRef(() => AdoptModule),
    forwardRef(() => LostFoundModule),
  ],
  providers: [UserService, UserExistsGuard, UserOwnerGuard],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(UserMiddleware)
      .with('UserModule')
      .forRoutes(UserController);
  }
}
