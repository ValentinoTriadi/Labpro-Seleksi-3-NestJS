import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AppService } from 'src/app.service';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private readonly appService: AppService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const result = this.appService.self(req.cookies['jwt']);
    if (result.status === 'success') {
      req['user'] = result.data;
    }
    next();
  }
}
