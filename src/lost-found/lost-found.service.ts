import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { LostFoundListQueryRequestDto, LostFoundRequestDto, LostFoundType } from '@petman/common';

import { User } from '../user/user.entity';

import { LostFound } from './lost-found.entity';
import { LostFoundRepository } from './lost-found.repository';

@Injectable()
export class LostFoundService {
  constructor(@InjectRepository(LostFoundRepository) private lostFoundRepository: LostFoundRepository) {}

  async create(body: LostFoundRequestDto, user: User): Promise<LostFound> {
    return await this.lostFoundRepository.createAndSave(body, user);
  }

  async findById(id: number): Promise<LostFound> {
    return await this.lostFoundRepository.findById(id);
  }

  async findByUserId(userId: number): Promise<LostFound[]> {
    return await this.lostFoundRepository.findByUserId(userId);
  }

  async update(lostFound: LostFound, body: LostFoundRequestDto): Promise<LostFound> {
    lostFound.applicationType = body.applicationType;
    lostFound.description = body.description;
    lostFound.images = body.images;
    lostFound.gender = body.gender;
    lostFound.type = body.type;
    lostFound.age = body.age;
    lostFound.size = body.size;
    return await this.lostFoundRepository.save(lostFound);
  }

  async delete(lostFound: LostFound) {
    lostFound.deleted = new Date();
    await this.lostFoundRepository.save(lostFound);
  }

  async getList(query: LostFoundListQueryRequestDto) {
    const data = await this.lostFoundRepository.getList(query);

    return { total: data[1], list: data[0] };
  }
}
