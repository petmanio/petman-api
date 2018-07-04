import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';

import { Poi } from './poi.entity';
import { PoiRepository } from './poi.repository';
import { PoiService } from './poi.service';
import { PoiController } from './poi.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Poi, PoiRepository]), SharedModule],
  providers: [PoiService],
  controllers: [PoiController],
})
export class PoiModule {
}
