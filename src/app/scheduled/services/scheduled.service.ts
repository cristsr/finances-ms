import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { CreateScheduled, ScheduledRes } from 'app/scheduled/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ScheduledEntity } from 'app/scheduled/entities';
import { Repository } from 'typeorm';
import { CategoryEntity, SubcategoryEntity } from 'app/category/entities';
import { DateTime } from 'luxon';

@Injectable()
export class ScheduledService {
  #logger = new Logger(ScheduledService.name);

  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,

    @InjectRepository(SubcategoryEntity)
    private subcategoryRepository: Repository<SubcategoryEntity>,

    @InjectRepository(ScheduledEntity)
    private scheduledRepository: Repository<ScheduledEntity>,
  ) {}

  async create(data: CreateScheduled) {
    this.#logger.log(`Creating scheduled ${data.description}`);

    const category = await this.categoryRepository
      .findOneOrFail(data.category)
      .catch(() => {
        const msg = `Category ${data.category} not found`;
        this.#logger.log(msg);
        throw new NotFoundException(msg);
      });

    const subcategory = await this.subcategoryRepository
      .findOneOrFail(data.subcategory)
      .catch(() => {
        const msg = `Subcategory ${data.subcategory} not found`;
        this.#logger.log(msg);
        throw new NotFoundException(msg);
      });

    const scheduled = await this.scheduledRepository.save({
      ...data,
      category,
      subcategory,
    });

    this.#logger.log(`Scheduled ${scheduled.description} created`);

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
