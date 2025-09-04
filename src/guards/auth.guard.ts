import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const user = request.currentUser;

    if (!user) return false; // not logged in

    if (!user.isActive) {
      throw new ForbiddenException('Your account is deactivated');
    }

    return true;
  }
}
