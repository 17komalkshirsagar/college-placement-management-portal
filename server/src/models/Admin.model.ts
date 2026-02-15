import { Schema, model } from 'mongoose';

const adminSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    designation: { type: String, required: true, trim: true },
    permissions: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

const Admin = model('Admin', adminSchema);

export default Admin;
