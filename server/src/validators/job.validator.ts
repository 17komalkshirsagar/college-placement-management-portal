import { z } from 'zod';

export const createJobDtoSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  location: z.string().min(2),
  packageLpa: z.number().positive(),
  eligibility: z.string().min(2),
  deadline: z.string().datetime(),
});

export const updateJobDtoSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  location: z.string().min(2).optional(),
  packageLpa: z.number().positive().optional(),
  eligibility: z.string().min(2).optional(),
  deadline: z.string().datetime().optional(),
});

export type CreateJobDto = z.infer<typeof createJobDtoSchema>;
export type UpdateJobDto = z.infer<typeof updateJobDtoSchema>;
