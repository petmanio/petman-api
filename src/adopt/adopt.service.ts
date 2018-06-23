import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../user/user.entity';

import { Adopt } from './adopt.entity';
import { AdoptRepository } from './adopt.repository';
import { AdoptListDto } from '@petman/common';

@Injectable()
export class AdoptService {
  constructor(
    @InjectRepository(AdoptRepository)
    private adoptRepository: AdoptRepository,
  ) {
  }

  async create(description: string, price: number, images: string[], user: User): Promise<Adopt> {
    return await this.adoptRepository.createAndSave(description, price, images, user);
  }

  async findById(id: number): Promise<Adopt> {
    return await this.adoptRepository.findById(id);
  }

  async update(adopt: Adopt, description: string, price: number, images: string[]): Promise<Adopt> {
    adopt.price = price;
    adopt.description = description;
    adopt.images = images;
    await this.adoptRepository.save(adopt);
    return adopt;
  }

  async delete(adopt: Adopt) {
    adopt.deleted = new Date();
    await this.adoptRepository.save(adopt);
  }

  async getList(offset: number, limit: number): Promise<AdoptListDto> {
    const data = await this.adoptRepository.getList(offset, limit);

    return <AdoptListDto>{ total: data[1], list: data[0] };
  }
}
