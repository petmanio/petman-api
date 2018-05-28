import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';

import { Adopt } from './adopt.entity';
import { AdoptRepository } from './adopt.repository';
import { AdoptService } from './adopt.service';
import { AdoptController } from './adopt.controller';
import { AdoptMiddleware } from './adopt.middleware';
import { AdoptExistsGuard } from './adopt-exists.guard';
import { AdoptOwnerGuard } from './adopt-owner.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Adopt, AdoptRepository]), SharedModule],
  providers: [AdoptService, AdoptExistsGuard, AdoptOwnerGuard],
  controllers: [AdoptController],
})
export class AdoptModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AdoptMiddleware)
      .with('AdoptModule')
      .forRoutes(AdoptController);
  }
}
