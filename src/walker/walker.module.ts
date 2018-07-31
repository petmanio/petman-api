import {
  MiddlewareConsumer,
  Module,
  NestModule,
  forwardRef,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';

import { Walker } from './walker.entity';
import { WalkerRepository } from './walker.repository';
import { WalkerService } from './walker.service';
import { WalkerController } from './walker.controller';
import { WalkerMiddleware } from './walker.middleware';
import { WalkerExistsGuard } from './walker-exists.guard';
import { WalkerCanCreateGuard } from './walker-can-create.guard';
import { WalkerOwnerGuard } from './walker-owner.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Walker, WalkerRepository]),
    forwardRef(() => SharedModule),
    forwardRef(() => UserModule),
  ],
  providers: [
    WalkerService,
    WalkerCanCreateGuard,
    WalkerExistsGuard,
    WalkerOwnerGuard,
  ],
  controllers: [WalkerController],
  exports: [WalkerService],
})
export class WalkerModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(WalkerMiddleware)
      .with('WalkerModule')
      .forRoutes(WalkerController);
  }
}
