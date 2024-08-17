import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('self')
  @UseGuards(JwtAuthGuard)
  self(@Headers('Authorization') token: string) {
    return this.authService.self(token);
  }
}
