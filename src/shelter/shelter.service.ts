import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../user/user.entity';

import { Shelter } from './shelter.entity';
import { ShelterRepository } from './shelter.repository';

@Injectable()
export class ShelterService {
  constructor(
    @InjectRepository(ShelterRepository)
    private shelterRepository: ShelterRepository,
  ) {
  }

  async create(description: string, price: number, images: string[], user: User): Promise<Shelter> {
    return await this.shelterRepository.createAndSave(description, price, images, user);
  }

  async findById(id: number): Promise<Shelter> {
    return await this.shelterRepository.findById(id);
  }

  async update(shelter: Shelter, description: string, price: number, images: string[]): Promise<Shelter> {
    shelter.price = price;
    shelter.description = description;
    shelter.images = images;
    return await this.shelterRepository.save(shelter);
  }

  async delete(shelter: Shelter) {
    shelter.deleted = new Date();
    await this.shelterRepository.save(shelter);
  }

  async getList(offset: number, limit: number) {
    const data = await this.shelterRepository.getList(offset, limit);

    return { total: data[1], list: data[0] };
  }
}
