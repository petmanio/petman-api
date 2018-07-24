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

import { ListQueryRequestDto, LostFoundDto, LostFoundListResponseDto, LostFoundRequestDto } from '@petman/common';

import { SelectedUserParam } from '../shared/selected-user-param.decorator';
import { AuthGuard } from '../shared/auth.guard';

import { User } from '../user/user.entity';

import { LostFoundService } from './lost-found.service';
import { LostFoundParam } from './lost-found-param.decorator';
import { LostFoundExistsGuard } from './lost-found-exists.guard';
import { LostFoundOwnerGuard } from './lost-found-owner.guard';
import { LostFound } from './lost-found.entity';
import { SharedService } from '../shared/shared.service';

const UPLOAD_SUB_PATH = '/images/lost-found';

@ApiBearerAuth()
@ApiUseTags('Lost Found')
@Controller('api/lost-found')
export class LostFoundController {

  private logger = new Logger(LostFoundController.name);

  constructor(private lostFoundService: LostFoundService) {
  }

  @ApiOperation({ title: 'Create' })
  @ApiResponse({ status: HttpStatus.OK, type: LostFoundDto })
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('images', 4, SharedService.getMulterConfig(join(config.get('uploadDir'), UPLOAD_SUB_PATH))))
  @Post('/')
  async create(@Body() body: LostFoundRequestDto, @UploadedFiles() images, @SelectedUserParam() selectedUser: User): Promise<LostFoundDto> {
    if (!images.length) {
      throw new BadRequestException();
    }
    body.images = map(images, image => join(UPLOAD_SUB_PATH, image.filename));

    const lostFound = await this.lostFoundService.create(body.type, body.description, body.images, selectedUser);
    const lostFoundDto = plainToClass(LostFoundDto, lostFound, { groups: ['petman-api'] });
    lostFoundDto.isOwner = true;

    return lostFoundDto;
  }

  @ApiOperation({ title: 'Get' })
  @ApiResponse({ status: HttpStatus.OK, type: LostFoundDto })
  @UseGuards(LostFoundExistsGuard)
  @Get(':id')
  async get(@Param('id') id: string, @SelectedUserParam() selectedUser: User, @LostFoundParam() lostFound: LostFound): Promise<LostFoundDto> {
    const lostFoundDto = plainToClass(LostFoundDto, lostFound, { groups: ['petman-api'] });
    lostFoundDto.isOwner = lostFoundDto.user.id === (selectedUser && selectedUser.id);

    return lostFoundDto;
  }

  @ApiOperation({ title: 'Update' })
  @ApiResponse({ status: HttpStatus.OK, type: LostFoundDto })
  @UseGuards(AuthGuard, LostFoundExistsGuard, LostFoundOwnerGuard)
  @UseInterceptors(FilesInterceptor('images', 4, SharedService.getMulterConfig(join(config.get('uploadDir'), UPLOAD_SUB_PATH))))
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: LostFoundRequestDto,
    @UploadedFiles() images,
    @LostFoundParam() lostFound: LostFound,
  ): Promise<LostFoundDto> {
    if (!images.length && !body.images.length) {
      throw new BadRequestException();
    }
    body.images = typeof body.images === 'string' ? [body.images] : body.images;
    body.images = [
      ...map(images, image => join(UPLOAD_SUB_PATH, image.filename)),
      ...map(body.images, image => join(UPLOAD_SUB_PATH, image.split(UPLOAD_SUB_PATH)[1])),
    ];

    await this.lostFoundService.update(lostFound, body.type, body.description, body.images);
    const lostFoundDto = plainToClass(LostFoundDto, lostFound, { groups: ['petman-api'] });
    lostFoundDto.isOwner = true;

    return lostFoundDto;
  }

  @ApiOperation({ title: 'Delete' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @UseGuards(AuthGuard, LostFoundExistsGuard, LostFoundOwnerGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @LostFoundParam() lostFound: LostFound, @Res() res): Promise<void> {

    await this.lostFoundService.delete(lostFound);
    res.status(HttpStatus.NO_CONTENT).end();
  }

  @ApiOperation({ title: 'List' })
  @ApiResponse({ status: HttpStatus.OK, type: LostFoundListResponseDto })
  @Get('/')
  async list(@Query() query: ListQueryRequestDto, @SelectedUserParam() selectedUser: User): Promise<LostFoundListResponseDto> {
    const lostFound = await this.lostFoundService.getList(query.offset, query.limit);
    const lostFoundDto = plainToClass(LostFoundListResponseDto, lostFound, { groups: ['petman-api'] });

    lostFoundDto.list = map(lostFoundDto.list, (item) => {
      item.isOwner = item.user.id === (selectedUser && selectedUser.id);
      return item;
    });

    return lostFoundDto;
  }
}
