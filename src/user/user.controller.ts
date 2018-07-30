import {
  Body,
  Controller,
  Logger,
  Param,
  Put,
  UseGuards,
  Get,
  HttpStatus,
  Req,
  Res,
  Headers,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { lookup } from 'geoip-lite';

import { UserDto, UserUpdateRequestDto, UserGeoDto } from '@petman/common';

import { AuthGuard } from '../shared/auth.guard';
import { SelectedUserParam } from '../shared/selected-user-param.decorator';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserEntityParam } from './user-entity-param.decorator';
import { UserExistsGuard } from './user-exists.guard';
import { UserOwnerGuard } from './user-owner.guard';

@ApiBearerAuth()
@ApiUseTags('Users')
@Controller('api/users')
export class UserController {
  private logger = new Logger(UserController.name);

  constructor(private userService: UserService) {}

  @ApiOperation({ title: 'Get goe info' })
  @ApiResponse({ status: HttpStatus.OK, type: UserGeoDto })
  @Get('geo')
  async geo(@Req() req, @Res() res, @Headers('x-forwarded-for') remoteIP) {
    res
      .status(HttpStatus.OK)
      .send(
        plainToClass(
          UserGeoDto,
          lookup(remoteIP || req.connection.remoteAddress),
          { groups: ['petman-api'] },
        ),
      );
  }

  @ApiOperation({ title: 'Get' })
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  @UseGuards(UserExistsGuard)
  @Get(':id')
  async get(@Param('id') id: string, @SelectedUserParam() selectedUser: User, @UserEntityParam() userEntity: User): Promise<UserDto> {
    const groups = ['petman-api'];
    if (!selectedUser) {
      groups.push('petman-unauthorised');
    }
    const userDto = plainToClass(UserDto, userEntity, { groups });
    userDto.isOwner = userDto.id === (selectedUser && selectedUser.id);

    return userDto;
  }

  @ApiOperation({ title: 'Update' })
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  @UseGuards(AuthGuard, UserOwnerGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UserUpdateRequestDto,
    @SelectedUserParam() selectedUser: User,
  ): Promise<UserDto> {
    await this.userService.update(
      selectedUser,
      body.userData.firstName,
      body.userData.lastName,
      body.userData.facebookUrl,
      body.userData.phoneNumber,
    );
    return plainToClass(UserDto, selectedUser, { groups: ['petman-api'] });
  }
}
