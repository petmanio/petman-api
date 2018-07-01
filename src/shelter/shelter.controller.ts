import * as config from 'config';
import { join } from 'path';
import { map } from 'lodash';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FilesInterceptor,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

import { ListQueryRequestDto, ShelterCreateRequestDto, ShelterDto, ShelterListResponseDto } from '@petman/common';

import { SelectedUserParam } from '../shared/selected-user-param.decorator';
import { AuthGuard } from '../shared/auth.guard';

import { User } from '../user/user.entity';

import { ShelterService } from './shelter.service';
import { ShelterParam } from './shelter-param.decorator';
import { ShelterExistsGuard } from './shelter-exists.guard';
import { ShelterOwnerGuard } from './shelter-owner.guard';
import { Shelter } from './shelter.entity';
import { SharedService } from '../shared/shared.service';

const UPLOAD_SUB_PATH = '/shelters';

@ApiBearerAuth()
@ApiUseTags('Shelters')
@Controller('api/shelters')
export class ShelterController {

  private logger = new Logger(ShelterController.name);

  constructor(private shelterService: ShelterService) {
  }

  @ApiOperation({ title: 'Create' })
  @ApiResponse({ status: HttpStatus.OK, type: ShelterDto })
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('images', 4, SharedService.getMulterConfig(join(config.get('uploadDir'), UPLOAD_SUB_PATH))))
  @Post('/')
  async create(@Body() body: ShelterCreateRequestDto, @UploadedFiles() images, @SelectedUserParam() selectedUser: User): Promise<ShelterDto> {
    if (!images.length) {
      throw new BadRequestException();
    }
    body.images = map(images, image => join(UPLOAD_SUB_PATH, image.filename));

    const shelter = await this.shelterService.create(body.description, body.price, body.images, selectedUser);
    const shelterDto = plainToClass(ShelterDto, shelter, { groups: ['petman-api'] });
    shelterDto.isOwner = true;

    return shelterDto;
  }

  @ApiOperation({ title: 'Get' })
  @ApiResponse({ status: 200, type: ShelterDto })
  @UseGuards(ShelterExistsGuard)
  @Get(':id')
  async findById(@Param('id') id: string, @SelectedUserParam() selectedUser: User, @ShelterParam() shelter: Shelter): Promise<ShelterDto> {
    const shelterDto = plainToClass(ShelterDto, shelter, { groups: ['petman-api'] });
    shelterDto.isOwner = shelterDto.user.id === (selectedUser && selectedUser.id);

    return shelterDto;
  }

  @ApiOperation({ title: 'Update' })
  @ApiResponse({ status: 200, type: ShelterDto })
  @UseGuards(AuthGuard, ShelterExistsGuard, ShelterOwnerGuard)
  @UseInterceptors(FilesInterceptor('images', 4, SharedService.getMulterConfig(join(config.get('uploadDir'), UPLOAD_SUB_PATH))))
  @Put(':id')
  async updateById(
    @Param('id') id: string,
    @Body() body: ShelterDto,
    @UploadedFiles() images,
    @ShelterParam() shelter: Shelter,
  ): Promise<ShelterDto> {
    if (!images.length && !body.images.length) {
      throw new BadRequestException();
    }
    body.images = typeof body.images === 'string' ? [body.images] : body.images;
    body.images = [
      ...map(images, image => join(UPLOAD_SUB_PATH, image.filename)),
      ...map(body.images, image => join(UPLOAD_SUB_PATH, image.split(UPLOAD_SUB_PATH)[1])),
    ];

    await this.shelterService.update(shelter, body.description, body.price, body.images);
    const shelterDto = plainToClass(ShelterDto, shelter, { groups: ['petman-api'] });
    shelterDto.isOwner = true;

    return shelterDto;
  }

  @ApiOperation({ title: 'Delete' })
  @ApiResponse({ status: 204 })
  @UseGuards(AuthGuard, ShelterExistsGuard, ShelterOwnerGuard)
  @Delete(':id')
  async deleteById(@Param('id') id: string, @ShelterParam() shelter: Shelter, @Res() res): Promise<void> {

    await this.shelterService.delete(shelter);
    res.status(HttpStatus.NO_CONTENT).end();
  }

  @ApiOperation({ title: 'List' })
  @ApiResponse({ status: 200, type: ShelterListResponseDto })
  @Get('/')
  async list(@Query() query: ListQueryRequestDto, @SelectedUserParam() selectedUser: User): Promise<ShelterListResponseDto> {
    const shelters = await this.shelterService.getList(query.offset, query.limit);
    const sheltersDto = plainToClass(ShelterListResponseDto, shelters, { groups: ['petman-api'] });

    sheltersDto.list = map(sheltersDto.list, (shelter) => {
      shelter.isOwner = shelter.user.id === (selectedUser && selectedUser.id);
      return shelter;
    });

    return sheltersDto;
  }
}
