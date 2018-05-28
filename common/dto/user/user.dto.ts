import { ApiModelProperty } from '@nestjs/swagger';
import { find } from 'lodash';
import { Exclude, Transform, Type } from 'class-transformer';

import { dtoGetter, getFacebookById, getUserFbAvatarByFbId } from '../../lib';
import { AuthProviderType } from '../../enum';
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
  @Transform((userData, { authProviders }) => {
    const fbAuthProvider = find(authProviders, provider => provider.type === AuthProviderType.FACEBOOK);
    if (fbAuthProvider) {
      userData.avatar = userData.avatar || getUserFbAvatarByFbId(fbAuthProvider.externalId);
      userData.facebook = userData.facebook || getFacebookById(fbAuthProvider.externalId);
    }
    return userData;
  }, { groups: ['api'] })
  userData: UserDataDto;

  @Exclude()
  authProviders;

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
