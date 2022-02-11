export const DefaultSchemaConfig = {
  id: true,
  toJSON: {
    transform: (_, ret) => {
      delete ret._id;
      delete ret.__v;
    },
    virtuals: true,
  },
};
