import mongoose from 'mongoose';

import { env } from './env.js';
import SupportMessage from '../models/SupportMessage.model.js';

export async function connectDatabase(): Promise<void> {
  await mongoose.connect(env.MONGODB_URI);
}
