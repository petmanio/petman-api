import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../user/user.entity';

import { Sitter } from './sitter.entity';
import { SitterRepository } from './sitter.repository';

@Injectable()
export class SitterService {
  constructor(
    @InjectRepository(SitterRepository)
    private sitterRepository: SitterRepository,
  ) {
  }

  async create(description: string, price: number, images: string[], user: User): Promise<Sitter> {
    return await this.sitterRepository.createAndSave(description, price, images, user);
  }

  async findById(id: number): Promise<Sitter> {
    return await this.sitterRepository.findById(id);
  }

  async findByUserId(userId: number): Promise<Sitter[]> {
    return await this.sitterRepository.findByUserId(userId);
  }

  async update(sitter: Sitter, description: string, price: number, images: string[]): Promise<Sitter> {
    sitter.price = price;
    sitter.description = description;
    sitter.images = images;
    return await this.sitterRepository.save(sitter);
  }

  async delete(sitter: Sitter) {
    sitter.deleted = new Date();
    await this.sitterRepository.save(sitter);
  }

  async getList(offset: number, limit: number) {
    const data = await this.sitterRepository.getList(offset, limit);

    return { total: data[1], list: data[0] };
  }
}
