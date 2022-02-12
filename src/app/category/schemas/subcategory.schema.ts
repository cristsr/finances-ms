import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DefaultSchemaConfig } from 'database/utils';
import { Schema as MongooseSchema } from 'mongoose';
import { Category } from 'app/category/schemas/category.schema';

export type SubcategoryDocument = Subcategory & Document;

@Schema(DefaultSchemaConfig)
export class Subcategory {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Category.name })
  category: Category;

  @Prop()
  name: string;
}

export const SubcategorySchema = SchemaFactory.createForClass(Subcategory);
