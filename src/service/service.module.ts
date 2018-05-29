import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Service } from './service.entity';
import { ServiceRepository } from './service.repository';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Service, ServiceRepository])],
  providers: [ServiceService],
  controllers: [ServiceController],
})
export class ServiceModule {
}
