import { Body, Controller, Get, HttpStatus, Logger, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { LoginFacebookRequestDto } from '../../common/dto/auth/login-facebook-request.dto';
import { LoginFacebookResponseDto } from '../../common/dto/auth/login-facebook-response.dto';

import { AuthService } from './auth.service';

@ApiBearerAuth()
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
  async login(@Res() res): Promise<any> {
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
  @Get('user')
  @UseGuards(AuthGuard('jwt'))
  user() {
    // this route is restricted
  }
}
