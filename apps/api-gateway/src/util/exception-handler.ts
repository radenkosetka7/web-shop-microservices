import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    let status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    if (exception.response && exception.response.statusCode) {
      status = exception.response.statusCode;
    }

    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}
