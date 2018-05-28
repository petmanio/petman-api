import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Shelter } from './shelter.entity';
import { ShelterRepository } from './shelter.repository';
import { ShelterService } from './shelter.service';
import { ShelterController } from './shelter.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Shelter, ShelterRepository])],
  providers: [ShelterService],
  controllers: [ShelterController],
})
export class ShelterModule {}
