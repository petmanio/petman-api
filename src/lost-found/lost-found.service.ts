import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { LostFoundListDto } from '@petmanio/common/dto/lost-found/lost-found-list.dto';
import { LostFoundType } from '@petmanio/common/enum';

import { User } from '../user/user.entity';

import { LostFound } from './lost-found.entity';
import { LostFoundRepository } from './lost-found.repository';

@Injectable()
export class LostFoundService {
  constructor(
    @InjectRepository(LostFoundRepository)
    private lostFoundRepository: LostFoundRepository,
  ) {
  }

  async create(type: LostFoundType, description: string, images: string[], user: User): Promise<LostFound> {
    return await this.lostFoundRepository.createAndSave(type, description, images, user);
  }

  async findById(id: number): Promise<LostFound> {
    return await this.lostFoundRepository.findById(id);
  }

  async update(lostFound: LostFound, type: LostFoundType, description: string, images: string[]): Promise<LostFound> {
    lostFound.type = type;
    lostFound.description = description;
    lostFound.images = images;
    await this.lostFoundRepository.save(lostFound);
    return lostFound;
  }

  async delete(lostFound: LostFound) {
    lostFound.deleted = new Date();
    await this.lostFoundRepository.save(lostFound);
  }

  async getList(offset: number, limit: number): Promise<LostFoundListDto> {
    const data = await this.lostFoundRepository.getList(offset, limit);

    return <LostFoundListDto>{ total: data[1], list: data[0] };
  }
}
