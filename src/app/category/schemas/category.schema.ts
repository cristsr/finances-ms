import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DefaultSchemaConfig } from 'database/utils';

export type CategoryDocument = Category & Document;

@Schema(DefaultSchemaConfig)
export class Category {
  @Prop()
  name: string;

  @Prop()
  icon: string;

  @Prop()
  color: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
