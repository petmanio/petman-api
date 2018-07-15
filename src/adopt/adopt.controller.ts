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

import { AdoptDto, AdoptListResponseDto, AdoptRequestDto, ListQueryRequestDto } from '@petman/common';

import { SelectedUserParam } from '../shared/selected-user-param.decorator';
import { AuthGuard } from '../shared/auth.guard';

import { User } from '../user/user.entity';

import { AdoptService } from './adopt.service';
import { AdoptParam } from './adopt-param.decorator';
import { AdoptExistsGuard } from './adopt-exists.guard';
import { AdoptOwnerGuard } from './adopt-owner.guard';
import { Adopt } from './adopt.entity';

const UPLOAD_SUB_PATH = '/adoption';

@ApiBearerAuth()
@ApiUseTags('Adoption')
@Controller('api/adoption')
export class AdoptController {

  private logger = new Logger(AdoptController.name);

  constructor(private adoptService: AdoptService) {
  }

  @ApiOperation({ title: 'Create' })
  @ApiResponse({ status: 200, type: AdoptDto })
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('images', 4, { dest: join(config.get('uploadDir'), UPLOAD_SUB_PATH) }))
  @Post('/')
  async create(@Body() body: AdoptRequestDto, @UploadedFiles() images, @SelectedUserParam() selectedUser: User): Promise<AdoptDto> {
    body.images = map(images, image => join(UPLOAD_SUB_PATH, image.filename));

    const adopt = await this.adoptService.create(body.description, body.price, body.images, selectedUser);
    const adoptDto = plainToClass(AdoptDto, adopt, { groups: ['petman-api'] });
    adoptDto.isOwner = true;

    return adoptDto;
  }

  @ApiOperation({ title: 'Get' })
  @ApiResponse({ status: 200, type: AdoptDto })
  @UseGuards(AdoptExistsGuard)
  @Get(':id')
  async get(@Param('id') id: string, @SelectedUserParam() selectedUser: User, @AdoptParam() adopt: Adopt): Promise<AdoptDto> {
    const adoptDto = plainToClass(AdoptDto, adopt, { groups: ['petman-api'] });
    adoptDto.isOwner = adoptDto.user.id === (selectedUser && selectedUser.id);

    return adoptDto;
  }

  @ApiOperation({ title: 'Update' })
  @ApiResponse({ status: 200, type: AdoptDto })
  @UseGuards(AuthGuard, AdoptExistsGuard, AdoptOwnerGuard)
  @UseInterceptors(FilesInterceptor('images', 4, { dest: join(config.get('uploadDir'), UPLOAD_SUB_PATH) }))
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: AdoptRequestDto,
    @UploadedFiles() images,
    @AdoptParam() adopt: Adopt,
  ): Promise<AdoptDto> {
    body.images = typeof body.images === 'string' ? [body.images] : body.images;
    body.images = [
      ...map(images, image => image.path.replace(config.get('uploadDir'), '')),
      ...map(body.images, image => image.replace(/^.*(?=(\/images))/, '')),
    ];

    await this.adoptService.update(adopt, body.description, body.price, body.images);
    const adoptDto = plainToClass(AdoptDto, adopt, { groups: ['petman-api'] });
    adoptDto.isOwner = true;

    return adoptDto;
  }

  @ApiOperation({ title: 'Delete' })
  @ApiResponse({ status: 204 })
  @UseGuards(AuthGuard, AdoptExistsGuard, AdoptOwnerGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @AdoptParam() adopt: Adopt, @Res() res): Promise<void> {

    await this.adoptService.delete(adopt);
    res.status(HttpStatus.NO_CONTENT).end();
  }

  @ApiOperation({ title: 'List' })
  @ApiResponse({ status: 200, type: AdoptListResponseDto })
  @Get('/')
  async list(@Query() query: ListQueryRequestDto, @SelectedUserParam() selectedUser: User): Promise<AdoptListResponseDto> {
    const adoption = await this.adoptService.getList(query.offset, query.limit);
    const adoptionDto = plainToClass(AdoptListResponseDto, adoption, { groups: ['petman-api'] });

    adoptionDto.list = map(adoptionDto.list, (adopt) => {
      adopt.isOwner = adopt.user.id === (selectedUser && selectedUser.id);
      return adopt;
    });

    return adoptionDto;

  }
}
