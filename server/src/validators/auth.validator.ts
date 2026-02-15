import { z } from 'zod';

export const loginDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const refreshTokenDtoSchema = z.object({
  refreshToken: z.string().min(20),
});

export type LoginDto = z.infer<typeof loginDtoSchema>;
export type RefreshTokenDto = z.infer<typeof refreshTokenDtoSchema>;
