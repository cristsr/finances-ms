import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { DefaultSchemaConfig } from 'database/utils';
import { Category } from 'app/category/schemas/category.schema';
import { Subcategory } from 'app/category/schemas/subcategory.schema';

export type MovementDocument = Movement & Document;

@Schema(DefaultSchemaConfig)
export class Movement {
  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  amount: number;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: Category.name,
  })
  category: Category;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: Subcategory.name,
  })
  subcategory: Subcategory;
}

export const MovementSchema = SchemaFactory.createForClass(Movement);
