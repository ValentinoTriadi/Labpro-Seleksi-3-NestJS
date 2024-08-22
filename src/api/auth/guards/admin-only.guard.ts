import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AdminOnlyGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = this.authService.selfInfo(request.headers.authorization);
    if (user.status !== 'success') {
      throw new HttpException(
        {
          status: 'error',
          message: user.message,
          data: null,
        },
        HttpStatus.FORBIDDEN,
      );
    }
    if (user.data.role !== 'ADMIN') {
      throw new HttpException(
        {
          status: 'error',
          message: 'Only admin can access this resource',
          data: null,
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return user.data.role === 'ADMIN';
  }
}
