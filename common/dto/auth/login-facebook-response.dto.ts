import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginFacebookResponseDto {
  @ApiModelProperty({ type: String })
  @IsString()
  readonly token;
}
