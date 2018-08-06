import * as path from 'path';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MulterOptions } from '@nestjs/common/interfaces/external/multer-options.interface';

import { CategoryListResponseDto, AddressRequestDto } from '@petman/common';

import { CategoryRepository } from './category.repository';
import { Address } from './address.entity';
import { AddressRepository } from './address.repository';

@Injectable()
export class SharedService {
  constructor(
    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository,
    @InjectRepository(AddressRepository)
    private addressRepository: AddressRepository,
  ) {}
  static getMulterConfig(dest): MulterOptions {
    return {
      dest,
      fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(
          path.extname(file.originalname).toLowerCase(),
        );

        if (mimetype && extname) {
          return cb(null, true);
        }

        cb(
          new BadRequestException(
            'File upload only supports the following filetypes - ' + filetypes,
          ),
          false,
        );
      },
    };
  }

  async getCategories(
    offset: number,
    limit: number,
  ): Promise<CategoryListResponseDto> {
    const data = await this.categoryRepository.getList(offset, limit);

    return { total: data[1], list: data[0] } as CategoryListResponseDto;
  }

  async createAddress(addressRequest: AddressRequestDto): Promise<Address> {
    return await this.addressRepository.createAndSave(addressRequest);
  }

  async deleteAddress(address: Address) {
    address.deleted = new Date();
    return await this.addressRepository.save(address);
  }
}
