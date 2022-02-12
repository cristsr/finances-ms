import { SchemaOptions } from '@nestjs/mongoose';

export const DefaultSchemaConfig: SchemaOptions = {
  id: true,
  toJSON: {
    transform: (_, ret) => {
      delete ret._id;
      delete ret.__v;
    },
    virtuals: true,
  },
};
