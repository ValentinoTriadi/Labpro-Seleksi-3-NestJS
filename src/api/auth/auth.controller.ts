import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('self')
  self(@Headers('Authorization') token: string) {
    return this.authService.self(token);
  }
}
