import { z } from 'zod';

export const updateStudentProfileDtoSchema = z.object({
  mobileNumber: z.string().min(10).optional(),
  course: z.string().min(2).optional(),
  branch: z.string().min(2).optional(),
  year: z.number().int().min(1).max(6).optional(),
  skills: z.array(z.string().min(1)).optional(),
});

export type UpdateStudentProfileDto = z.infer<typeof updateStudentProfileDtoSchema>;
