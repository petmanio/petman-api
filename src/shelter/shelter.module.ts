import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Shelter } from './shelter.entity';
import { ShelterController } from './shelter.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Shelter])],
  controllers: [ShelterController],
})
export class ShelterModule {}
