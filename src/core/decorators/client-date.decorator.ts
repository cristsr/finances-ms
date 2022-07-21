import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DateTime } from 'luxon';

export const ClientDate = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const timezone = request.get('x-time-zone');
    const offset = request.get('x-time-zone-offset');

    return DateTime.utc()
      .plus({ minutes: +offset })
      .setZone(timezone);
  },
);
