import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AdminOnlyGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = this.authService.selfInfo(request.headers.authorization);
    return user.data.role === 'ADMIN';
  }
}
