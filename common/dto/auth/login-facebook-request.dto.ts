import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginFacebookRequestDto {
  @ApiModelProperty({ type: String })
  @IsString()
  readonly accessToken;
}
