import { Body, Controller, Logger, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';

import { UserDto, UserUpdateRequestDto } from '@petman/common';

import { AuthGuard } from '../shared/auth.guard';
import { SelectedUserParam } from '../shared/selected-user-param.decorator';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserOwnerGuard } from './user-owner.guard';
import { plainToClass } from 'class-transformer';

@ApiBearerAuth()
@ApiUseTags('Users')
@Controller('api/users')
export class UserController {
  private logger = new Logger(UserController.name);

  constructor(private userService: UserService) {
  }

  @ApiOperation({ title: 'Update' })
  @ApiResponse({ status: 200, type: UserDto })
  @UseGuards(AuthGuard, UserOwnerGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UserUpdateRequestDto,
    @SelectedUserParam() selectedUser: User,
  ): Promise<UserDto> {
    await this.userService.update(selectedUser, body.userData.facebookUrl, body.userData.phoneNumber);
    return plainToClass(UserDto, selectedUser, { groups: ['petman-api'] });
  }
}
