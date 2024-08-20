import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AppService } from 'src/app.service';

@Injectable()
export class AuthRouteMiddleware implements NestMiddleware {
  constructor(private readonly appService: AppService) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (req.user) {
      return res.redirect('/dashboard');
    }
    next();
  }
}
