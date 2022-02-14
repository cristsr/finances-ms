import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DefaultSchemaConfig } from 'database/utils';

export type SubcategoryDocument = Subcategory & Document;

@Schema(DefaultSchemaConfig)
export class Subcategory {
  @Prop()
  name: string;
}

export const SubcategorySchema = SchemaFactory.createForClass(Subcategory);
