import { z } from 'zod';

export const createStudentAccountDtoSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  mobileNumber: z.string().min(10),
  course: z.string().min(2),
  branch: z.string().min(2),
  year: z.number().int().min(1).max(6),
});

export const createCompanyAccountDtoSchema = z.object({
  companyName: z.string().min(2),
  hrEmail: z.string().email(),
  hrMobileNumber: z.string().min(10),
  website: z.string().url().optional(),
  industry: z.string().min(2).optional(),
  headquarters: z.string().min(2).optional(),
});

export const updateUserDtoSchema = z.object({
  fullName: z.string().min(2).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export type CreateStudentAccountDto = z.infer<typeof createStudentAccountDtoSchema>;
export type CreateCompanyAccountDto = z.infer<typeof createCompanyAccountDtoSchema>;
export type UpdateUserDto = z.infer<typeof updateUserDtoSchema>;
