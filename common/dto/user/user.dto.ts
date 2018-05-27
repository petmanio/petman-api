import { ApiModelProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';

import { dtoGetter } from '../../lib';
import { UserDataDto } from './user-data.dto';

export class UserDto {
  @ApiModelProperty({ type: Number })
  id: number;

  @ApiModelProperty({ type: String })
  email: string;

  @Exclude()
  password: string;

  @ApiModelProperty({ type: UserDataDto })
  @Type(dtoGetter(UserDataDto))
  userData: UserDataDto;

  // TODO: add type
  // @ApiModelProperty({ type: UserDto, isArray: true })
  @Type(dtoGetter(UserDto))
  businessUsers: UserDto[];

  @ApiModelProperty({ type: Date })
  created: Date;

  @ApiModelProperty({ type: Date })
  updated: Date;

  @Exclude()
  deleted: Date;
}
