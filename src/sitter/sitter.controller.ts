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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

import {
  ListQueryRequestDto,
  SitterDto,
  SitterListResponseDto,
  SitterRequestDto,
} from '@petman/common';

import { SelectedUserParam } from '../shared/selected-user-param.decorator';
import { AuthGuard } from '../shared/auth.guard';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { SitterService } from './sitter.service';
import { SitterParam } from './sitter-param.decorator';
import { SitterCanCreateGuard } from './sitter-can-create.guard';
import { SitterExistsGuard } from './sitter-exists.guard';
import { SitterOwnerGuard } from './sitter-owner.guard';
import { Sitter } from './sitter.entity';
import { SharedService } from '../shared/shared.service';

const UPLOAD_SUB_PATH = '/sitters';

@ApiBearerAuth()
@ApiUseTags('Sitters')
@Controller('api/sitters')
export class SitterController {
  private logger = new Logger(SitterController.name);

  constructor(
    private sitterService: SitterService,
    private userService: UserService,
  ) {}

  @ApiOperation({ title: 'Create' })
  @ApiResponse({ status: HttpStatus.OK, type: SitterDto })
  @UseGuards(AuthGuard, SitterCanCreateGuard)
  @UseInterceptors(
    FilesInterceptor(
      'images',
      4,
      SharedService.getMulterConfig(
        join(config.get('uploadDir'), UPLOAD_SUB_PATH),
      ),
    ),
  )
  @Post('/')
  async create(
    @Body() body: SitterRequestDto,
    @UploadedFiles() images,
    @SelectedUserParam() selectedUser: User,
  ): Promise<SitterDto> {
    if (!images || !images.length) {
      throw new BadRequestException();
    }
    body.images = map(images, image => join(UPLOAD_SUB_PATH, image.filename));

    const sitter = await this.sitterService.create(
      body.description,
      body.price,
      body.images,
      selectedUser,
    );
    const sitterDto = plainToClass(SitterDto, sitter, {
      groups: ['petman-api'],
    });
    sitterDto.isOwner = true;

    // TODO: handle with permission/role
    await this.userService.setSitter(selectedUser.id, true);

    return sitterDto;
  }

  @ApiOperation({ title: 'Get' })
  @ApiResponse({ status: HttpStatus.OK, type: SitterDto })
  @UseGuards(SitterExistsGuard)
  @Get(':id')
  async get(
    @Param('id') id: string,
    @SelectedUserParam() selectedUser: User,
    @SitterParam() sitter: Sitter,
  ): Promise<SitterDto> {
    const groups = ['petman-api'];
    if (!selectedUser) {
      groups.push('petman-unauthorised');
    }
    const sitterDto = plainToClass(SitterDto, sitter, { groups });
    sitterDto.isOwner = sitterDto.user.id === (selectedUser && selectedUser.id);

    return sitterDto;
  }

  @ApiOperation({ title: 'Update' })
  @ApiResponse({ status: HttpStatus.OK, type: SitterDto })
  @UseGuards(AuthGuard, SitterExistsGuard, SitterOwnerGuard)
  @UseInterceptors(
    FilesInterceptor(
      'images',
      4,
      SharedService.getMulterConfig(
        join(config.get('uploadDir'), UPLOAD_SUB_PATH),
      ),
    ),
  )
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: SitterRequestDto,
    @UploadedFiles() images,
    @SitterParam() sitter: Sitter,
  ): Promise<SitterDto> {
    if (!images.length && !body.images.length) {
      throw new BadRequestException();
    }
    body.images = typeof body.images === 'string' ? [body.images] : body.images;
    body.images = [
      ...map(images, image => join(UPLOAD_SUB_PATH, image.filename)),
      ...map(body.images, image =>
        join(UPLOAD_SUB_PATH, image.split(UPLOAD_SUB_PATH)[1]),
      ),
    ];

    await this.sitterService.update(
      sitter,
      body.description,
      body.price,
      body.images,
    );
    const sitterDto = plainToClass(SitterDto, sitter, {
      groups: ['petman-api'],
    });
    sitterDto.isOwner = true;

    return sitterDto;
  }

  @ApiOperation({ title: 'Delete' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @UseGuards(AuthGuard, SitterExistsGuard, SitterOwnerGuard)
  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @SitterParam() sitter: Sitter,
    @SelectedUserParam() selectedUser: User,
    @Res() res,
  ): Promise<void> {
    await this.sitterService.delete(sitter);

    // TODO: handle with permission/role
    await this.userService.setSitter(selectedUser.id, false);
    res.status(HttpStatus.NO_CONTENT).end();
  }

  @ApiOperation({ title: 'List' })
  @ApiResponse({ status: HttpStatus.OK, type: SitterListResponseDto })
  @Get('/')
  async list(
    @Query() query: ListQueryRequestDto,
    @SelectedUserParam() selectedUser: User,
  ): Promise<SitterListResponseDto> {
    const groups = ['petman-api'];
    if (!selectedUser) {
      groups.push('petman-unauthorised');
    }
    const sitters = await this.sitterService.getList(query.offset, query.limit);
    const sittersDto = plainToClass(SitterListResponseDto, sitters, { groups });

    sittersDto.list = map(sittersDto.list, sitter => {
      sitter.isOwner = sitter.user.id === (selectedUser && selectedUser.id);
      return sitter;
    });

    return sittersDto;
  }
}
