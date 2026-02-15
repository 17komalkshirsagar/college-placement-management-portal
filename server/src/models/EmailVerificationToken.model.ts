import { Schema, model } from 'mongoose';

const emailVerificationTokenSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const EmailVerificationToken = model('EmailVerificationToken', emailVerificationTokenSchema);

export default EmailVerificationToken;
