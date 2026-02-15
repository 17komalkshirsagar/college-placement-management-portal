import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5002),
  API_PREFIX: z.string().default('/api/v1'),
  MONGODB_URI: z.string().min(1),
  FRONTEND_URL: z.string().url(),
  FRONTEND_URLS: z.string().optional(),
  LOGIN_URL: z.string().url(),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(6),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_EXPIRE: z.string().default('15m'),
  JWT_REFRESH_EXPIRE: z.string().default('7d'),
  EMAIL_HOST: z.string().min(1),
  EMAIL_PORT: z.coerce.number().default(587),
  EMAIL_USER: z.string().min(1),
  EMAIL_PASSWORD: z.string().min(1),
  EMAIL_FROM: z.string().min(1),
  BCRYPT_ROUNDS: z.coerce.number().default(12),
  UPLOADS_BASE_URL: z.string().url().default('http://localhost:5002/uploads'),
});

export const env = envSchema.parse(process.env);
