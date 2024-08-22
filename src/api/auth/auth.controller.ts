import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { FormDataRequest, MemoryStoredFile } from 'nestjs-form-data';
import { AdminOnlyGuard } from './guards/admin-only.guard';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('self')
  @UseGuards(AdminOnlyGuard)
  self(@Headers('Authorization') token: string) {
    return this.authService.self(token);
  }

  @Get('users')
  @UseGuards(AdminOnlyGuard)
  async users(@Headers('Authorization') token: string, @Query('q') q?: string) {
    return await this.authService.findAll(q);
  }

  @Get('users/:id')
  @UseGuards(AdminOnlyGuard)
  async user(@Headers('Authorization') token: string, @Param('id') id: string) {
    return await this.authService.findOne(id);
  }

  @Post('users/:id/balance')
  @UseGuards(AdminOnlyGuard)
  @FormDataRequest({ storage: MemoryStoredFile })
  async updateBalance(
    @Headers('Authorization') token: string,
    @Param('id') id: string,
    @Body() balanceDto: { increment: number },
  ) {
    return await this.authService.updateBalance(id, balanceDto.increment);
  }

  @Delete('users/:id')
  @UseGuards(AdminOnlyGuard)
  async deleteUser(
    @Headers('Authorization') token: string,
    @Param('id') id: string,
  ) {
    return await this.authService.delete(id);
  }
}
