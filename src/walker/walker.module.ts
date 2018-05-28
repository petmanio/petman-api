import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';

import { Walker } from './walker.entity';
import { WalkerRepository } from './walker.repository';
import { WalkerService } from './walker.service';
import { WalkerController } from './walker.controller';
import { WalkerMiddleware } from './walker.middleware';
import { WalkerExistsGuard } from './walker-exists.guard';
import { WalkerOwnerGuard } from './walker-owner.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Walker, WalkerRepository]), SharedModule],
  providers: [WalkerService, WalkerExistsGuard, WalkerOwnerGuard],
  controllers: [WalkerController],
})
export class WalkerModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(WalkerMiddleware)
      .with('WalkerModule')
      .forRoutes(WalkerController);
  }
}
