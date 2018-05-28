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
import { plainToClass } from 'class-transformer';

import { ShelterDto } from '../../common/dto/shelter/shelter.dto';
import { ShelterCreateDto } from '../../common/dto/shelter/shelter-create.dto';

import { SelectedUser } from '../shared/selected-user-param.decorator';
import { AuthGuard } from '../shared/auth.guard';

import { User } from '../user/user.entity';

import { ShelterService } from './shelter.service';
import { Shelter } from './shelter-param.decorator';

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
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('images', 4, { dest: join(config.get('uploadDir'), UPLOAD_SUB_PATH) }))
  @Post('/')
  async create(@Body() body: ShelterCreateDto, @UploadedFiles() images, @SelectedUser() selectedUser: User): Promise<ShelterDto> {
    body.images = map(images, file => join(UPLOAD_SUB_PATH, file.filename));

    const shelter = await this.shelterService.create(body.description, body.price, body.images, selectedUser);
    const shelterDto = plainToClass(ShelterDto, shelter, { groups: ['api'] });
    shelterDto.isOwner = true;

    return shelterDto;
  }

  @ApiOperation({ title: 'Get by id' })
  @ApiResponse({ status: 200, type: ShelterDto })
  @Get(':id')
  async findById(@Param('id') id: string, @SelectedUser() selectedUser: User, @Shelter() shelter: Shelter): Promise<ShelterDto> {
    const shelterDto = plainToClass(ShelterDto, shelter, { groups: ['api'] });
    shelterDto.isOwner = shelterDto.user.id === (selectedUser && selectedUser.id);

    return shelterDto;
  }

}
