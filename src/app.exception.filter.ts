import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  private logger = new Logger(AppExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let status;

    try {
      status = exception.getStatus();
    } catch (err) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    this.logger.warn(JSON.stringify(exception.message, null, 2));

    if (status === HttpStatus.INTERNAL_SERVER_ERROR && exception.stack) {
      this.logger.error(exception.stack);
    }

    response.status(status).json(exception.message);
  }
}
