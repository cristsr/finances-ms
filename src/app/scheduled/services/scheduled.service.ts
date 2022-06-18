import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { CreateScheduled, ScheduledRes } from 'app/scheduled/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ScheduledEntity } from 'app/scheduled/entities';
import { Repository } from 'typeorm';
import { CategoryEntity } from 'app/category/entities';
import { DateTime } from 'luxon';

@Injectable()
export class ScheduledService {
  #logger = new Logger(ScheduledService.name);

  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,

    @InjectRepository(ScheduledEntity)
    private scheduledRepository: Repository<ScheduledEntity>,
  ) {}

  async create(data: CreateScheduled) {
    this.#logger.log(`Creating scheduled ${data.name}`);

    const category = await this.categoryRepository
      .findOneOrFail(data.category)
      .catch(() => {
        const msg = `Category ${data.category} not found`;
        this.#logger.log(msg);
        throw new NotFoundException(msg);
      });

    const scheduled = await this.scheduledRepository.save({
      ...data,
      category,
    });

    this.#logger.log(`Scheduled ${scheduled.name} created`);

    return scheduled;
  }

  findAll() {
    this.#logger.log('Find all scheduled');
    return this.scheduledRepository.find({
      relations: ['category'],
      where: {
        date: DateTime.local().toSQLDate(),
      },
    });
  }

  findOne(id: number) {
    this.#logger.log(`Find one scheduled ${id}`);
    return this.scheduledRepository.findOneOrFail(id).catch(() => {
      const msg = `Scheduled ${id} not found`;
      this.#logger.log(msg);
      throw new NotFoundException(msg);
    });
  }

  update(id: number, data: ScheduledRes) {
    this.#logger.log(`Updating scheduled ${id}`);
    return this.scheduledRepository.save({
      id,
      ...data,
    });
  }

  async remove(id: number) {
    this.#logger.log(`Removing scheduled ${id}`);
    await this.scheduledRepository.delete(id);
  }
}
