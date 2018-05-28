import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumberString, IsString } from 'class-validator';

export class ShelterCreateDto {
  @ApiModelProperty({ type: String })
  @IsNumberString()
  price: number;

  @IsString()
  @ApiModelProperty({ type: String })
  description: string;

  // TODO: validate
  // @IsNotEmpty()
  @ApiModelProperty({ type: Object, isArray: true })
  images: any[];
}
