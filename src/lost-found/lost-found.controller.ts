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

import { ListQueryRequestDto, LostFoundCreateRequestDto, LostFoundDto, LostFoundListResponseDto } from '@petman/common';

import { SelectedUserParam } from '../shared/selected-user-param.decorator';
import { AuthGuard } from '../shared/auth.guard';

import { User } from '../user/user.entity';

import { LostFoundService } from './lost-found.service';
import { LostFoundParam } from './lost-found-param.decorator';
import { LostFoundExistsGuard } from './lost-found-exists.guard';
import { LostFoundOwnerGuard } from './lost-found-owner.guard';
import { LostFound } from './lost-found.entity';

const UPLOAD_SUB_PATH = '/lost-found';

@ApiBearerAuth()
@ApiUseTags('Lost Found')
@Controller('api/lost-found')
export class LostFoundController {

  private logger = new Logger(LostFoundController.name);

  constructor(private lostFoundService: LostFoundService) {
  }

  @ApiOperation({ title: 'Create' })
  @ApiResponse({ status: 200, type: LostFoundDto })
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('images', 4, { dest: join(config.get('uploadDir'), UPLOAD_SUB_PATH) }))
  @Post('/')
  async create(@Body() body: LostFoundCreateRequestDto, @UploadedFiles() images, @SelectedUserParam() selectedUser: User): Promise<LostFoundDto> {
    body.images = map(images, image => join(UPLOAD_SUB_PATH, image.filename));

    const lostFound = await this.lostFoundService.create(body.type, body.description, body.images, selectedUser);
    const lostFoundDto = plainToClass(LostFoundDto, lostFound, { groups: ['api'] });
    lostFoundDto.isOwner = true;

    return lostFoundDto;
  }

  @ApiOperation({ title: 'Get' })
  @ApiResponse({ status: 200, type: LostFoundDto })
  @UseGuards(LostFoundExistsGuard)
  @Get(':id')
  async findById(@Param('id') id: string, @SelectedUserParam() selectedUser: User, @LostFoundParam() lostFound: LostFound): Promise<LostFoundDto> {
    const lostFoundDto = plainToClass(LostFoundDto, lostFound, { groups: ['api'] });
    lostFoundDto.isOwner = lostFoundDto.user.id === (selectedUser && selectedUser.id);

    return lostFoundDto;
  }

  @ApiOperation({ title: 'Update' })
  @ApiResponse({ status: 200, type: LostFoundDto })
  @UseGuards(AuthGuard, LostFoundExistsGuard, LostFoundOwnerGuard)
  @UseInterceptors(FilesInterceptor('images', 4, { dest: join(config.get('uploadDir'), UPLOAD_SUB_PATH) }))
  @Put(':id')
  async updateById(
    @Param('id') id: string,
    @Body() body: LostFoundDto,
    @UploadedFiles() images,
    @LostFoundParam() lostFound: LostFound,
  ): Promise<LostFoundDto> {
    body.images = typeof body.images === 'string' ? [body.images] : body.images;
    body.images = [
      ...map(images, image => image.path.replace(config.get('uploadDir'), '')),
      ...map(body.images, image => image.replace(/^.*(?=(\/images))/, '')),
    ];

    await this.lostFoundService.update(lostFound, body.type, body.description, body.images);
    const lostFoundDto = plainToClass(LostFoundDto, lostFound, { groups: ['api'] });
    lostFoundDto.isOwner = true;

    return lostFoundDto;
  }

  @ApiOperation({ title: 'Delete' })
  @ApiResponse({ status: 204 })
  @UseGuards(AuthGuard, LostFoundExistsGuard, LostFoundOwnerGuard)
  @Delete(':id')
  async deleteById(@Param('id') id: string, @LostFoundParam() lostFound: LostFound, @Res() res): Promise<void> {

    await this.lostFoundService.delete(lostFound);
    res.status(HttpStatus.NO_CONTENT).end();
  }

  @ApiOperation({ title: 'List' })
  @ApiResponse({ status: 200, type: LostFoundListResponseDto })
  @Get('/')
  async list(@Query() query: ListQueryRequestDto, @SelectedUserParam() selectedUser: User): Promise<LostFoundListResponseDto> {
    const lostFound = await this.lostFoundService.getList(query.offset, query.limit);
    const lostFoundDto = plainToClass(LostFoundListResponseDto, lostFound, { groups: ['api'] });

    lostFoundDto.list = map(lostFoundDto.list, (item) => {
      item.isOwner = item.user.id === (selectedUser && selectedUser.id);
      return item;
    });

    return lostFoundDto;

  }
}
