import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DateTime } from 'luxon';

export const ClientDate = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const timezone = request.get('x-time-zone');

    return DateTime.utc().setZone(timezone);
  },
);
