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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags, ApiImplicitQuery } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

import { AdoptListQueryRequestDto, AdoptDto, AdoptListResponseDto, AdoptRequestDto } from '@petman/common';

import { SelectedUserParam } from '../shared/selected-user-param.decorator';
import { AuthGuard } from '../shared/auth.guard';

import { User } from '../user/user.entity';

import { AdoptService } from './adopt.service';
import { AdoptParam } from './adopt-param.decorator';
import { AdoptExistsGuard } from './adopt-exists.guard';
import { AdoptOwnerGuard } from './adopt-owner.guard';
import { Adopt } from './adopt.entity';
import { SharedService } from '../shared/shared.service';

const UPLOAD_SUB_PATH = '/adoption';

@ApiBearerAuth()
@ApiUseTags('Adoption')
@Controller('api/adoption')
export class AdoptController {
  private logger = new Logger(AdoptController.name);

  constructor(private adoptService: AdoptService) {}

  @ApiOperation({ title: 'Create' })
  @ApiResponse({ status: HttpStatus.OK, type: AdoptDto })
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 4, SharedService.getMulterConfig(join(config.get('uploadDir'), UPLOAD_SUB_PATH))),
  )
  @Post('/')
  async create(
    @Body() body: AdoptRequestDto,
    @UploadedFiles() images,
    @SelectedUserParam() selectedUser: User,
  ): Promise<AdoptDto> {
    if (!images || !images.length) {
      throw new BadRequestException();
    }
    body.images = map(images, image => join(UPLOAD_SUB_PATH, image.filename));

    const adopt = await this.adoptService.create(body, selectedUser);
    const adoptDto = plainToClass(AdoptDto, adopt, { groups: ['petman-api'] });
    adoptDto.isOwner = true;

    return adoptDto;
  }

  @ApiOperation({ title: 'Get' })
  @ApiResponse({ status: HttpStatus.OK, type: AdoptDto })
  @UseGuards(AdoptExistsGuard)
  @Get(':id')
  async get(
    @Param('id') id: string,
    @SelectedUserParam() selectedUser: User,
    @AdoptParam() adopt: Adopt,
  ): Promise<AdoptDto> {
    const groups = ['petman-api'];
    if (!selectedUser) {
      groups.push('petman-unauthorised');
    }
    const adoptDto = plainToClass(AdoptDto, adopt, { groups });
    adoptDto.isOwner = adoptDto.user.id === (selectedUser && selectedUser.id);

    return adoptDto;
  }

  @ApiOperation({ title: 'Update' })
  @ApiResponse({ status: HttpStatus.OK, type: AdoptDto })
  @UseGuards(AuthGuard, AdoptExistsGuard, AdoptOwnerGuard)
  @UseInterceptors(
    FilesInterceptor('images', 4, SharedService.getMulterConfig(join(config.get('uploadDir'), UPLOAD_SUB_PATH))),
  )
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: AdoptRequestDto,
    @UploadedFiles() images,
    @AdoptParam() adopt: Adopt,
  ): Promise<AdoptDto> {
    if (!images.length && !body.images.length) {
      throw new BadRequestException();
    }
    body.images = typeof body.images === 'string' ? [body.images] : body.images;
    body.images = [
      ...map(images, image => join(UPLOAD_SUB_PATH, image.filename)),
      ...map(body.images, image => join(UPLOAD_SUB_PATH, image.split(UPLOAD_SUB_PATH)[1])),
    ];

    await this.adoptService.update(adopt, body);
    const adoptDto = plainToClass(AdoptDto, adopt, { groups: ['petman-api'] });
    adoptDto.isOwner = true;

    return adoptDto;
  }

  @ApiOperation({ title: 'Delete' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @UseGuards(AuthGuard, AdoptExistsGuard, AdoptOwnerGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @AdoptParam() adopt: Adopt, @Res() res): Promise<void> {
    await this.adoptService.delete(adopt);
    res.status(HttpStatus.NO_CONTENT).end();
  }

  @ApiOperation({ title: 'List' })
  @ApiImplicitQuery({ name: 'offset', type: Number })
  @ApiImplicitQuery({ name: 'limit', type: Number })
  @ApiImplicitQuery({
    name: 'type',
    type: String,
    isArray: true,
    required: false,
    collectionFormat: 'multi',
  })
  @ApiImplicitQuery({
    name: 'gender',
    type: String,
    isArray: true,
    required: false,
    collectionFormat: 'multi',
  })
  @ApiImplicitQuery({
    name: 'age',
    type: String,
    isArray: true,
    required: false,
    collectionFormat: 'multi',
  })
  @ApiImplicitQuery({
    name: 'size',
    type: String,
    isArray: true,
    required: false,
    collectionFormat: 'multi',
  })
  @ApiResponse({ status: HttpStatus.OK, type: AdoptListResponseDto })
  @Get('/')
  async list(
    @Query() query: AdoptListQueryRequestDto,
    @SelectedUserParam() selectedUser: User,
  ): Promise<AdoptListResponseDto> {
    const groups = ['petman-api'];
    if (!selectedUser) {
      groups.push('petman-unauthorised');
    }

    const listQueryDto = plainToClass(AdoptListQueryRequestDto, query);
    const adoption = await this.adoptService.getList(listQueryDto);
    const adoptionDto = plainToClass(AdoptListResponseDto, adoption, {
      groups,
    });

    adoptionDto.list = map(adoptionDto.list, adopt => {
      adopt.isOwner = adopt.user.id === (selectedUser && selectedUser.id);
      return adopt;
    });

    return adoptionDto;
  }
}
