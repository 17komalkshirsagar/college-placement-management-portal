import { z } from 'zod';

export const scheduleInterviewDtoSchema = z.object({
  applicationId: z.string().min(1),
  scheduledAt: z.string().datetime(),
  mode: z.enum(['online', 'offline']),
  round: z.string().min(2),
});

export const updateInterviewStatusDtoSchema = z.object({
  status: z.enum(['scheduled', 'completed', 'cancelled']).optional(),
  result: z.enum(['pending', 'passed', 'failed']).optional(),
  feedback: z.string().optional(),
  scheduledAt: z.string().datetime().optional(),
});

export type ScheduleInterviewDto = z.infer<typeof scheduleInterviewDtoSchema>;
export type UpdateInterviewStatusDto = z.infer<typeof updateInterviewStatusDtoSchema>;
