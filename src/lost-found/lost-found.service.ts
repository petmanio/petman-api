import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { LostFoundType } from '@petman/common';

import { User } from '../user/user.entity';

import { LostFound } from './lost-found.entity';
import { LostFoundRepository } from './lost-found.repository';

@Injectable()
export class LostFoundService {
  constructor(
    @InjectRepository(LostFoundRepository)
    private lostFoundRepository: LostFoundRepository,
  ) {}

  async create(
    type: LostFoundType,
    description: string,
    images: string[],
    user: User,
  ): Promise<LostFound> {
    return await this.lostFoundRepository.createAndSave(
      type,
      description,
      images,
      user,
    );
  }

  async findById(id: number): Promise<LostFound> {
    return await this.lostFoundRepository.findById(id);
  }

  async findByUserId(userId: number): Promise<LostFound[]> {
    return await this.lostFoundRepository.findByUserId(userId);
  }

  async update(
    lostFound: LostFound,
    type: LostFoundType,
    description: string,
    images: string[],
  ): Promise<LostFound> {
    lostFound.type = type;
    lostFound.description = description;
    lostFound.images = images;
    return await this.lostFoundRepository.save(lostFound);
  }

  async delete(lostFound: LostFound) {
    lostFound.deleted = new Date();
    await this.lostFoundRepository.save(lostFound);
  }

  async getList(offset: number, limit: number) {
    const data = await this.lostFoundRepository.getList(offset, limit);

    return { total: data[1], list: data[0] };
  }
}
