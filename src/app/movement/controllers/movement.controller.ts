import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MovementService } from '../services/movement.service';
import { CreateMovementDto } from '../dto/create-movement.dto';
import { UpdateMovementDto } from '../dto/update-movement.dto';
import { MongoIdPipe } from 'app/shared/pipes/mongo-id.pipe';

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
  findAll() {
    return this.movementService.findAll();
  }

  @ApiOperation({ summary: 'Get movement by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movementService.findOne(id);
  }

  @ApiOperation({ summary: 'Update movement by id' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMovementDto: UpdateMovementDto,
  ) {
    return this.movementService.update(id, updateMovementDto);
  }

  @ApiOperation({ summary: 'Delete movement by id' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movementService.remove(id);
  }

  @Get('/category/:id')
  findByCategory(@Param('id', MongoIdPipe) category: string) {
    return this.movementService.findByCategory(category);
  }

  @Get('/subcategory/:id')
  findBySubcategory(@Param('id', MongoIdPipe) subcategory: string) {
    return this.movementService.findBySubcategory(subcategory);
  }
}
