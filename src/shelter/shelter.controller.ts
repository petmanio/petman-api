import * as config from 'config';
import { join } from 'path';
import { map } from 'lodash';
import {
  Body,
  Controller,
  FilesInterceptor,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';

import { ShelterDto } from '../../common/dto/shelter/shelter.dto';
import { ShelterCreateDto } from '../../common/dto/shelter/shelter-create.dto';

import { User } from '../shared/user-param.decorator';
import { ShelterService } from './shelter.service';

const UPLOAD_SUB_PATH = '/shelters';

@ApiBearerAuth()
@ApiUseTags('Shelters')
@Controller('shelters')
export class ShelterController {

  private logger = new Logger(ShelterController.name);

  constructor(private shelterService: ShelterService) {
  }

  @ApiOperation({ title: 'Create' })
  @ApiResponse({ status: 200, type: ShelterDto })
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('images', 4, { dest: join(config.get('uploadDir'), UPLOAD_SUB_PATH) }))
  @Post('/')
  async create(@Body() body: ShelterCreateDto, @UploadedFiles() images, @User() user): Promise<ShelterDto> {
    body.images = map(images, file => join(UPLOAD_SUB_PATH, file.filename));

    const shelter = await this.shelterService.create(body.description, body.price, body.images, user);
    const shelterDto = plainToClass(ShelterDto, shelter, { groups: ['api'] });
    shelterDto.isOwner = true;

    return shelterDto;
  }

  @ApiOperation({ title: 'Get by id' })
  @ApiResponse({ status: 200, type: ShelterDto })
  @Get(':id')
  async findOne(@Param('id') id: string, @User() user): Promise<ShelterDto> {
    const shelter = await this.shelterService.findById(parseInt(id, 0));
    if (!shelter) {
      throw new NotFoundException();
    }

    const shelterDto = plainToClass(ShelterDto, shelter, { groups: ['api'] });
    shelterDto.isOwner = shelterDto.user.id === user.id;

    return shelterDto;
  }

}
