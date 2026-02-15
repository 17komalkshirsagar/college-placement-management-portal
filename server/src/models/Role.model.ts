import { Schema, model, type InferSchemaType } from 'mongoose';

const roleSchema = new Schema(
  {
    name: {
      type: String,
      enum: ['admin', 'student', 'company'],
      unique: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export type RoleDocument = InferSchemaType<typeof roleSchema>;

const Role = model('Role', roleSchema);

export default Role;
