import {
  MiddlewareConsumer,
  Module,
  NestModule,
  forwardRef,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';

import { LostFound } from './lost-found.entity';
import { LostFoundRepository } from './lost-found.repository';
import { LostFoundService } from './lost-found.service';
import { LostFoundController } from './lost-found.controller';
import { LostFoundMiddleware } from './lost-found.middleware';
import { LostFoundExistsGuard } from './lost-found-exists.guard';
import { LostFoundOwnerGuard } from './lost-found-owner.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([LostFound, LostFoundRepository]),
    forwardRef(() => SharedModule),
  ],
  providers: [LostFoundService, LostFoundExistsGuard, LostFoundOwnerGuard],
  controllers: [LostFoundController],
  exports: [LostFoundService],
})
export class LostFoundModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(LostFoundMiddleware)
      .with('LostFoundModule')
      .forRoutes(LostFoundController);
  }
}
