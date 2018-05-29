import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ServiceListDto } from '@petmanio/common/dto/service/service-list.dto';

import { ServiceRepository } from './service.repository';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(ServiceRepository)
    private serviceRepository: ServiceRepository,
  ) {
  }

  async getList(offset: number, limit: number): Promise<ServiceListDto> {
    const data = await this.serviceRepository.getList(offset, limit);

    return <ServiceListDto>{ total: data[1], list: data[0] };
  }
}
