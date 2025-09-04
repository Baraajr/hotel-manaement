import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const user = request.currentUser;

    if (!user) {
      throw new UnauthorizedException('you are not logged in');
    } // not logged in

    if (!user.isActive) {
      throw new UnauthorizedException('Your account is deactivated');
    }

    return true;
  }
}
