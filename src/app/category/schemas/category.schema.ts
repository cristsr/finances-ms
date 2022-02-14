import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DefaultSchemaConfig } from 'database/utils';
import { Subcategory, SubcategorySchema } from './subcategory.schema';

export type CategoryDocument = Category & Document;

@Schema(DefaultSchemaConfig)
export class Category {
  @Prop()
  name: string;

  @Prop()
  icon: string;

  @Prop()
  color: string;

  @Prop({ type: [SubcategorySchema], default: [] })
  subcategories: Subcategory[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
