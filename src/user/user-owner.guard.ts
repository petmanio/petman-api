import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserOwnerGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (parseInt(request.params.id, 0) === request.selectedUser.id) {
      return true;
    }
    throw new ForbiddenException();
  }
}
