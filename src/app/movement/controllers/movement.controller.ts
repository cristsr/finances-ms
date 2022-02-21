import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MovementService } from '../services/movement.service';
import {
  CreateMovementDto,
  MovementQueryDto,
  UpdateMovementDto,
} from 'app/movement/dto';
import { Pageable } from 'core/utils';
import { MovementEntity } from 'app/movement/entities/movement.entity';

@ApiTags('movement')
@Controller({
  path: 'movements',
  version: '1',
})
export class MovementController {
  constructor(private readonly movementService: MovementService) {}

  @ApiOperation({ summary: 'Create new movement' })
  @Post()
  create(@Body() createMovementDto: CreateMovementDto) {
    return this.movementService.create(createMovementDto);
  }

  @ApiOperation({ summary: 'Get all movements' })
  @Get()
  findAll(
    @Query() params: MovementQueryDto,
  ): Promise<Pageable<MovementEntity>> {
    return this.movementService.findAll(params);
  }

  @ApiOperation({ summary: 'Get movement by id' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.movementService.findOne(id);
  }

  @ApiOperation({ summary: 'Update movement by id' })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovementDto: UpdateMovementDto,
  ) {
    return this.movementService.update(id, updateMovementDto);
  }

  @ApiOperation({ summary: 'Delete movement by id' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.movementService.remove(id);
  }

  @Get('/category/:id')
  findByCategory(@Param('id', ParseIntPipe) category: number) {
    return this.movementService.findByCategory(category);
  }

  @Get('/subcategory/:id')
  findBySubcategory(@Param('id', ParseIntPipe) subcategory: number) {
    return this.movementService.findBySubcategory(subcategory);
  }
}
