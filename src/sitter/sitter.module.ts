import { MiddlewareConsumer, Module, NestModule, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';

import { Sitter } from './sitter.entity';
import { SitterRepository } from './sitter.repository';
import { SitterService } from './sitter.service';
import { SitterController } from './sitter.controller';
import { SitterMiddleware } from './sitter.middleware';
import { SitterExistsGuard } from './sitter-exists.guard';
import { SitterOwnerGuard } from './sitter-owner.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Sitter, SitterRepository]), forwardRef(() => SharedModule)],
  providers: [SitterService, SitterExistsGuard, SitterOwnerGuard],
  controllers: [SitterController],
  exports: [SitterService],
})
export class SitterModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(SitterMiddleware)
      .with('SitterModule')
      .forRoutes(SitterController);
  }
}
