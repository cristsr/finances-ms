import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ScheduledService } from 'app/scheduled/services';
import { CreateScheduled } from 'app/scheduled/dto';

@Controller({
  path: 'scheduled',
  version: '1',
})
export class ScheduledController {
  constructor(private scheduledService: ScheduledService) {}

  @Post()
  create(@Body() data: CreateScheduled) {
    return this.scheduledService.create(data);
  }

  @Get()
  findAll() {
    return this.scheduledService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduledService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: CreateScheduled) {
    return this.scheduledService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduledService.remove(+id);
  }
}
