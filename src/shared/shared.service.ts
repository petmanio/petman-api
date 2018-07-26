import * as path from 'path';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MulterOptions } from '@nestjs/common/interfaces/external/multer-options.interface';

import { CategoryListResponseDto } from '@petman/common';

import { CategoryRepository } from './category.repository';

@Injectable()
export class SharedService {
  constructor(
    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository,
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
}
