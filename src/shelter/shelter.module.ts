import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';

import { Shelter } from './shelter.entity';
import { ShelterRepository } from './shelter.repository';
import { ShelterService } from './shelter.service';
import { ShelterController } from './shelter.controller';
import { ShelterMiddleware } from './shelter.middleware';
import { ShelterExistsGuard } from './shelter-exists.guard';
import { ShelterOwnerGuard } from './shelter-owner.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Shelter, ShelterRepository]), SharedModule],
  providers: [ShelterService, ShelterExistsGuard, ShelterOwnerGuard],
  controllers: [ShelterController],
})
export class ShelterModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(ShelterMiddleware)
      .with('ShelterModule')
      .forRoutes(ShelterController);
  }
}
