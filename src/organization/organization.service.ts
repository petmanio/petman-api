import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { OrganizationListDto } from '@petmanio/common/dto/organization/organization-list.dto';

import { OrganizationRepository } from './organization.repository';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(OrganizationRepository)
    private organizationRepository: OrganizationRepository,
  ) {
  }

  async getList(offset: number, limit: number, services: number[]): Promise<OrganizationListDto> {
    const data = await this.organizationRepository.getList(offset, limit, services);

    return { total: data[1], list: data[0] } as OrganizationListDto;
  }
}
