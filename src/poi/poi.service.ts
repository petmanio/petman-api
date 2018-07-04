import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PinDto, PoiListResponseDto } from '@petman/common';

import { PoiRepository } from './poi.repository';

@Injectable()
export class PoiService {
  constructor(
    @InjectRepository(PoiRepository) private poiRepository: PoiRepository,
  ) {
  }

  async getList(offset: number, limit: number, services: number[]): Promise<PoiListResponseDto> {
    const data = await this.poiRepository.getList(offset, limit, services);

    return { total: data[1], list: data[0] } as PoiListResponseDto;
  }

  async getPins(services: number[]): Promise<PinDto[]> {
    return await this.poiRepository.getPins(services);
  }
}
