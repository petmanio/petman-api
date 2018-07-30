import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../user/user.entity';

import { Adopt } from './adopt.entity';
import { AdoptRepository } from './adopt.repository';

@Injectable()
export class AdoptService {
  constructor(
    @InjectRepository(AdoptRepository) private adoptRepository: AdoptRepository,
  ) {}

  async create(
    description: string,
    images: string[],
    user: User,
  ): Promise<Adopt> {
    return await this.adoptRepository.createAndSave(description, images, user);
  }

  async findById(id: number): Promise<Adopt> {
    return await this.adoptRepository.findById(id);
  }

  async findByUserId(userId: number): Promise<Adopt[]> {
    return await this.adoptRepository.findByUserId(userId);
  }

  async update(
    adopt: Adopt,
    description: string,
    images: string[],
  ): Promise<Adopt> {
    adopt.description = description;
    adopt.images = images;
    return await this.adoptRepository.save(adopt);
  }

  async delete(adopt: Adopt) {
    adopt.deleted = new Date();
    await this.adoptRepository.save(adopt);
  }

  async getList(offset: number, limit: number) {
    const data = await this.adoptRepository.getList(offset, limit);

    return { total: data[1], list: data[0] };
  }
}
