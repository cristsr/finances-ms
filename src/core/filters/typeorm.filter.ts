import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Response } from 'express';
import { TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeormFilter implements ExceptionFilter {
  #logger = new Logger(TypeormFilter.name);

  catch(exception: TypeORMError, host: ArgumentsHost) {
    this.#logger.error(`${exception.name}: ${exception.message}`);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorMap = {
      EntityNotFoundError: new NotFoundException(),
      QueryFailedError: new UnprocessableEntityException(),
      Default: new InternalServerErrorException(),
    };

    const error = errorMap[exception.name] || errorMap.Default;

    response.status(error.getStatus()).json(error.getResponse());
  }
}
