import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeormFilter implements ExceptionFilter {
  #logger = new Logger(TypeormFilter.name);

  catch(exception: TypeORMError, host: ArgumentsHost) {
    this.#logger.error(exception.message);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // const message = exception.message;

    const errorMap = {
      EntityNotFoundError: new NotFoundException(),
      Default: new InternalServerErrorException(),
    };

    const error = errorMap[exception.name] || errorMap.Default;

    response.status(error.getStatus()).json(error.getResponse());
  }
}
