import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../user/user.entity';

import { Shelter } from './shelter.entity';
import { ShelterRepository } from './shelter.repository';
import { CommonListDto } from '../../common/dto/shared/common-list.dto';
import { ShelterDto } from '../../common/dto/shelter/shelter.dto';

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
    await this.shelterRepository.save(shelter);
    return shelter;
  }

  async delete(shelter: Shelter) {
    shelter.deleted = new Date();
    await this.shelterRepository.save(shelter);
  }

  async getList(offset: number, limit: number): Promise<CommonListDto<ShelterDto>> {
    const data = await this.shelterRepository.getList(offset, limit);

    return { limit: data[1], list: data[0] }
  }
}