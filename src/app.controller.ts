import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  OnModuleInit,
} from '@nestjs/common';

@Controller('health')
export class AppController implements OnModuleInit {
  private readonly logger = new Logger(AppController.name);

  onModuleInit() {
    setInterval(() => {
      this.logger.log('Heartbeat');
    }, 10000);
  }

  @Get()
  @HttpCode(HttpStatus.ACCEPTED)
  health() {
    this.logger.log('Health check success');
  }
}
