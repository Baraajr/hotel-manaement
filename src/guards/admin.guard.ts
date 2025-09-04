import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Roles, User } from '../users/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const user = request.currentUser as User;

    const admin = user.role === Roles.Admin || user.role === Roles.Staff;

    return admin;
  }
}
