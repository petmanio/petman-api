import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../user/user.entity';

import { Adopt } from './adopt.entity';
import { AdoptRepository } from './adopt.repository';
import { AdoptRequestDto, AdoptListQueryRequestDto } from '@petman/common';

@Injectable()
export class AdoptService {
  constructor(
    @InjectRepository(AdoptRepository) private adoptRepository: AdoptRepository,
  ) {}

  async create(body: AdoptRequestDto, user: User): Promise<Adopt> {
    return await this.adoptRepository.createAndSave(body, user);
  }

  async findById(id: number): Promise<Adopt> {
    return await this.adoptRepository.findById(id);
  }

  async findByUserId(userId: number): Promise<Adopt[]> {
    return await this.adoptRepository.findByUserId(userId);
  }

  async update(adopt: Adopt, body: AdoptRequestDto): Promise<Adopt> {
    adopt.description = body.description;
    adopt.images = body.images;
    adopt.gender = body.gender;
    adopt.type = body.type;
    adopt.age = body.age;
    adopt.size = body.size;

    return await this.adoptRepository.save(adopt);
  }

  async delete(adopt: Adopt) {
    adopt.deleted = new Date();
    await this.adoptRepository.save(adopt);
  }

  async getList(query: AdoptListQueryRequestDto) {
    const data = await this.adoptRepository.getList(query);

    return { total: data[1], list: data[0] };
  }
}
