import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { LoginDto } from './auth/dto/login.dto';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { Public } from './utils';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Body() loginDto: LoginDto, @Request() req) {
    return await this.authService.login(req.user);
  }
}
