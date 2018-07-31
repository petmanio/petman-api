import { map } from 'lodash';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
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
  WalkerDto,
  WalkerListResponseDto,
  WalkerRequestDto,
} from '@petman/common';

import { SelectedUserParam } from '../shared/selected-user-param.decorator';
import { AuthGuard } from '../shared/auth.guard';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { WalkerService } from './walker.service';
import { WalkerParam } from './walker-param.decorator';
import { WalkerCanCreateGuard } from './walker-can-create.guard';
import { WalkerExistsGuard } from './walker-exists.guard';
import { WalkerOwnerGuard } from './walker-owner.guard';
import { Walker } from './walker.entity';

@ApiBearerAuth()
@ApiUseTags('Walkers')
@Controller('api/walkers')
export class WalkerController {
  private logger = new Logger(WalkerController.name);

  constructor(
    private walkerService: WalkerService,
    private userService: UserService,
  ) {}

  @ApiOperation({ title: 'Create' })
  @ApiResponse({ status: HttpStatus.OK, type: WalkerDto })
  @UseGuards(AuthGuard, WalkerCanCreateGuard)
  @Post('/')
  async create(
    @Body() body: WalkerRequestDto,
    @SelectedUserParam() selectedUser: User,
  ): Promise<WalkerDto> {
    const walker = await this.walkerService.create(
      body.description,
      body.price,
      selectedUser,
    );
    const walkerDto = plainToClass(WalkerDto, walker, {
      groups: ['petman-api'],
    });
    walkerDto.isOwner = true;

    // TODO: handle with permission/role
    await this.userService.setWalker(selectedUser.id, true);

    return walkerDto;
  }

  @ApiOperation({ title: 'Get' })
  @ApiResponse({ status: HttpStatus.OK, type: WalkerDto })
  @UseGuards(WalkerExistsGuard)
  @Get(':id')
  async get(
    @Param('id') id: string,
    @SelectedUserParam() selectedUser: User,
    @WalkerParam() walker: Walker,
  ): Promise<WalkerDto> {
    const groups = ['petman-api'];
    if (!selectedUser) {
      groups.push('petman-unauthorised');
    }
    const walkerDto = plainToClass(WalkerDto, walker, { groups });
    walkerDto.isOwner = walkerDto.user.id === (selectedUser && selectedUser.id);

    return walkerDto;
  }

  @ApiOperation({ title: 'Update' })
  @ApiResponse({ status: HttpStatus.OK, type: WalkerDto })
  @UseGuards(AuthGuard, WalkerExistsGuard, WalkerOwnerGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: WalkerRequestDto,
    @WalkerParam() walker: Walker,
  ): Promise<WalkerDto> {
    await this.walkerService.update(walker, body.description, body.price);
    const walkerDto = plainToClass(WalkerDto, walker, {
      groups: ['petman-api'],
    });
    walkerDto.isOwner = true;

    return walkerDto;
  }

  @ApiOperation({ title: 'Delete' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @UseGuards(AuthGuard, WalkerExistsGuard, WalkerOwnerGuard)
  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @WalkerParam() walker: Walker,
    @SelectedUserParam() selectedUser: User,
    @Res() res,
  ): Promise<void> {
    await this.walkerService.delete(walker);

    // TODO: handle with permission/role
    await this.userService.setWalker(selectedUser.id, false);
    res.status(HttpStatus.NO_CONTENT).end();
  }

  @ApiOperation({ title: 'List' })
  @ApiResponse({ status: HttpStatus.OK, type: WalkerListResponseDto })
  @Get('/')
  async list(
    @Query() query: ListQueryRequestDto,
    @SelectedUserParam() selectedUser: User,
  ): Promise<WalkerListResponseDto> {
    const groups = ['petman-api'];
    if (!selectedUser) {
      groups.push('petman-unauthorised');
    }
    const walkers = await this.walkerService.getList(query.offset, query.limit);
    const walkersDto = plainToClass(WalkerListResponseDto, walkers, { groups });

    walkersDto.list = map(walkersDto.list, walker => {
      walker.isOwner = walker.user.id === (selectedUser && selectedUser.id);
      return walker;
    });

    return walkersDto;
  }
}
