import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { ERR_400, ERROR_MESSAGES } from '../constants/messages';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: (exception as Error).message || 'Internal server error' };

    let data: any = null;
    let message = ERROR_MESSAGES.PROCESS_REQUEST_ERROR;

    if (typeof exceptionResponse === 'string') {
      data = exceptionResponse;
      if (status !== HttpStatus.INTERNAL_SERVER_ERROR) {
        message = exceptionResponse;
      }
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null
    ) {
      const respObj = exceptionResponse as any;

      if (respObj.data && respObj.message) {
        data = respObj.data;
        message = respObj.message;
      } else if (respObj.message) {
        if (Array.isArray(respObj.message)) {
          data = respObj.message.join(', ');
          message = ERR_400;
        } else {
          data = respObj.message;
          if (status !== HttpStatus.INTERNAL_SERVER_ERROR) {
            message = respObj.message;
          }
        }
      }
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      message = ERROR_MESSAGES.PROCESS_REQUEST_ERROR;
      if (!data && exception instanceof Error) {
        data = exception.message;
      }
    }

    if (
      typeof exceptionResponse === 'object' &&
      (exceptionResponse as any).data &&
      (exceptionResponse as any).message
    ) {
      data = (exceptionResponse as any).data;
      message = (exceptionResponse as any).message;
    }

    const errorResponse = {
      data: data,
      message: message,
      statusCode: status,
      isError: true,
    };

    this.logger.error(
      `Method: ${request.method} Path: ${request.url} Status: ${status} Error: ${JSON.stringify(errorResponse)}`,
      exception instanceof Error ? exception.stack : '',
    );

    response.status(status).send(errorResponse);
  }
}
