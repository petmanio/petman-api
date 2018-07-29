import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class SitterExistsGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.sitter) {
      return true;
    }
    throw new NotFoundException();
  }
}
