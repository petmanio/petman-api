import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  private logger = new Logger(AppExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    this.logger.warn(JSON.stringify(exception.message));

    response.status(status).json(exception.message);
  }
}
