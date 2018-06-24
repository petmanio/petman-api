import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { OrganizationListResponseDto, PinDto } from '@petman/common';

import { OrganizationRepository } from './organization.repository';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(OrganizationRepository)
    private organizationRepository: OrganizationRepository,
  ) {
  }

  async getList(offset: number, limit: number, services: number[]): Promise<OrganizationListResponseDto> {
    const data = await this.organizationRepository.getList(offset, limit, services);

    return { total: data[1], list: data[0] } as OrganizationListResponseDto;
  }

  async getPins(services: number[]): Promise<PinDto[]> {
    return await this.organizationRepository.getPins(services);
  }
}
