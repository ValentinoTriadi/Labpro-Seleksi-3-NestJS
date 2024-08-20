import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { FormDataRequest, MemoryStoredFile } from 'nestjs-form-data';

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

  @Get('users')
  async users(@Headers('Authorization') token: string, @Query('q') q?: string) {
    const user = await this.authService.selfInfo(token);
    if (user.status === 'error') {
      return user;
    }
    if (user.data.role !== 'ADMIN') {
      return {
        status: 'error',
        message: 'Unauthorized',
        data: null,
      };
    }
    return await this.authService.getUsers(q);
  }

  @Get('users/:id')
  async user(@Headers('Authorization') token: string, @Param('id') id: string) {
    const user = await this.authService.selfInfo(token);
    if (user.status === 'error') {
      return user;
    }
    if (user.data.role !== 'ADMIN') {
      return {
        status: 'error',
        message: 'Unauthorized',
        data: null,
      };
    }
    return await this.authService.getUser(id);
  }

  @Post('users/:id/balance')
  @FormDataRequest({ storage: MemoryStoredFile })
  async updateBalance(
    @Headers('Authorization') token: string,
    @Param('id') id: string,
    @Body() balanceDto: { increment: number },
  ) {
    const user = await this.authService.selfInfo(token);
    if (user.status === 'error') {
      return user;
    }
    if (user.data.role !== 'ADMIN') {
      return {
        status: 'error',
        message: 'Unauthorized',
        data: null,
      };
    }
    return await this.authService.updateBalance(id, balanceDto.increment);
  }

  @Delete('users/:id')
  async deleteUser(
    @Headers('Authorization') token: string,
    @Param('id') id: string,
  ) {
    const user = await this.authService.selfInfo(token);
    if (user.status === 'error') {
      return user;
    }
    if (user.data.role !== 'ADMIN') {
      return {
        status: 'error',
        message: 'Unauthorized',
        data: null,
      };
    }
    return await this.authService.deleteUser(id);
  }
}
