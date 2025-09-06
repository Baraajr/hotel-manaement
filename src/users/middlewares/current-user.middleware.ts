import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from '../users.service';
import { NextFunction, Request, Response } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    session?: {
      userId?: string; // or string if your user IDs are strings
    };
    currentUser?: any; // you can replace 'any' with your User type
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};
    // if user is logged in it will attach the user to request object
    if (userId) {
      const user = await this.usersService.getUserById(userId);
      if (user && user.isActive) {
        req.currentUser = user;
      }
    }
    next();
  }
}
