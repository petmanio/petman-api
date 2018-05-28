import { Body, Controller, Get, HttpStatus, Logger, Post, Res, Response, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

import { LoginFacebookRequestDto } from '@petmanio/common/dist/dto/auth/login-facebook-request.dto';
import { LoginFacebookResponseDto } from '@petmanio/common/dist/dto/auth/login-facebook-response.dto';
import { UserDto } from '@petmanio/common/dist/dto/user/user.dto';

import { UserParam } from '../shared/user-param.decorator';
import { AuthGuard } from '../shared/auth.guard';

import { AuthService } from './auth.service';

@ApiBearerAuth()
@ApiUseTags('Auth')
@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
  ) {
  }

  @ApiOperation({ title: 'Login' })
  @ApiResponse({ status: 501 })
  @Post('login')
  async login(@Res() res): Promise<Response> {
    res.status(HttpStatus.NOT_IMPLEMENTED).send();
  }

  @ApiOperation({ title: 'Login with facebook' })
  @ApiResponse({ status: 200, type: LoginFacebookResponseDto })
  @Post('login/fb')
  async loginWithFacebook(@Body() loginFacebookRequestDto: LoginFacebookRequestDto): Promise<LoginFacebookResponseDto> {
    const fbUser = await this.authService.getUserFbDataByAccessToken(loginFacebookRequestDto.accessToken);
    const user = await this.authService.findOrCreateFbUser(fbUser, loginFacebookRequestDto.accessToken);
    return await this.authService.createToken(user);
  }

  @ApiOperation({ title: 'Get current user' })
  @ApiResponse({ status: 200, type: UserDto })
  @Get('user')
  @UseGuards(AuthGuard)
  async user(@UserParam() user) {
    return plainToClass(UserDto, user, { groups: ['api'] });
  }
}
