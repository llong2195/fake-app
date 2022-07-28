import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { LoggerService } from '../logger/custom.logger'
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface'
import { Response } from 'express'
import { QueryFailedError } from 'typeorm'

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}

  private static handleResponse(
    response: Response,
    exception: HttpException | QueryFailedError | Error,
  ): void {
    let responseBody: any = { message: 'Internal server error' }
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR

    if (exception instanceof HttpException) {
      // responseBody = exception.getResponse()
      statusCode = exception.getStatus()
      statusCode = HttpStatus.BAD_REQUEST
      responseBody = {
        statusCode: statusCode,
        message:
          typeof exception.getResponse() == 'string'
            ? exception.getResponse()
            : JSON.parse(JSON.stringify(exception.getResponse())).message,
      }
    } else if (exception instanceof QueryFailedError) {
      statusCode = HttpStatus.BAD_REQUEST
      responseBody = {
        statusCode: statusCode,
        message: exception.message,
      }
    } else if (exception instanceof Error) {
      responseBody = {
        statusCode: statusCode,
        message: exception.stack,
      }
    }

    if (Array.isArray(responseBody.message)) {
      responseBody.message = responseBody.message[0]
    }
    response.status(statusCode).json(responseBody)
  }

  catch(exception: HttpException | Error, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp()
    const response: Response = ctx.getResponse()

    // Handling error message and logging
    this.handleMessage(exception)

    // Response to client
    AllExceptionFilter.handleResponse(response, exception)
  }

  private handleMessage(
    exception: HttpException | QueryFailedError | Error,
  ): void {
    let message = 'Internal Server Error'

    if (exception instanceof HttpException) {
      message = JSON.stringify(exception.getResponse())
    } else if (exception instanceof QueryFailedError) {
      message = exception.stack.toString()
      console.log('query')
    } else if (exception instanceof Error) {
      console.log('err')
      message = exception.stack.toString()
      if (message.includes('no such file or directory')) {
        message = 'Not Found'
      }
    }

    this.logger.error(message)
  }
}