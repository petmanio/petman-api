import * as config from 'config';
import { join } from 'path';
import { map } from 'lodash';
import {
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

import { ListQueryDto, ShelterCreateDto, ShelterDto, ShelterListDto } from '@petman/common';

import { SelectedUserParam } from '../shared/selected-user-param.decorator';
import { AuthGuard } from '../shared/auth.guard';

import { User } from '../user/user.entity';

import { ShelterService } from './shelter.service';
import { ShelterParam } from './shelter-param.decorator';
import { ShelterExistsGuard } from './shelter-exists.guard';
import { ShelterOwnerGuard } from './shelter-owner.guard';
import { Shelter } from './shelter.entity';

const UPLOAD_SUB_PATH = '/shelters';

@ApiBearerAuth()
@ApiUseTags('Shelters')
@Controller('api/shelters')
export class ShelterController {

  private logger = new Logger(ShelterController.name);

  constructor(private shelterService: ShelterService) {
  }

  @ApiOperation({ title: 'Create' })
  @ApiResponse({ status: 200, type: ShelterDto })
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('images', 4, { dest: join(config.get('uploadDir'), UPLOAD_SUB_PATH) }))
  @Post('/')
  async create(@Body() body: ShelterCreateDto, @UploadedFiles() images, @SelectedUserParam() selectedUser: User): Promise<ShelterDto> {
    body.images = map(images, image => join(UPLOAD_SUB_PATH, image.filename));

    const shelter = await this.shelterService.create(body.description, body.price, body.images, selectedUser);
    const shelterDto = plainToClass(ShelterDto, shelter, { groups: ['api'] });
    shelterDto.isOwner = true;

    return shelterDto;
  }

  @ApiOperation({ title: 'Get' })
  @ApiResponse({ status: 200, type: ShelterDto })
  @UseGuards(ShelterExistsGuard)
  @Get(':id')
  async findById(@Param('id') id: string, @SelectedUserParam() selectedUser: User, @ShelterParam() shelter: Shelter): Promise<ShelterDto> {
    const shelterDto = plainToClass(ShelterDto, shelter, { groups: ['api'] });
    shelterDto.isOwner = shelterDto.user.id === (selectedUser && selectedUser.id);

    return shelterDto;
  }

  @ApiOperation({ title: 'Update' })
  @ApiResponse({ status: 200, type: ShelterDto })
  @UseGuards(AuthGuard, ShelterExistsGuard, ShelterOwnerGuard)
  @UseInterceptors(FilesInterceptor('images', 4, { dest: join(config.get('uploadDir'), UPLOAD_SUB_PATH) }))
  @Put(':id')
  async updateById(
    @Param('id') id: string,
    @Body() body: ShelterDto,
    @UploadedFiles() images,
    @ShelterParam() shelter: Shelter,
  ): Promise<ShelterDto> {
    body.images = typeof body.images === 'string' ? [body.images] : body.images;
    body.images = [
      ...map(images, image => image.path.replace(config.get('uploadDir'), '')),
      ...map(body.images, image => image.replace(/^.*(?=(\/images))/, '')),
    ];

    await this.shelterService.update(shelter, body.description, body.price, body.images);
    const shelterDto = plainToClass(ShelterDto, shelter, { groups: ['api'] });
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
  @ApiResponse({ status: 200, type: ShelterListDto })
  @Get('/')
  async list(@Query() query: ListQueryDto, @SelectedUserParam() selectedUser: User): Promise<ShelterListDto> {
    const shelters = await this.shelterService.getList(query.offset, query.limit);
    const sheltersDto = plainToClass(ShelterListDto, shelters, { groups: ['api'] });

    sheltersDto.list = map(sheltersDto.list, (shelter) => {
      shelter.isOwner = shelter.user.id === (selectedUser && selectedUser.id);
      return shelter;
    });

    return sheltersDto;

  }
}
