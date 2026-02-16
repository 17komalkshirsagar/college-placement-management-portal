import { z } from 'zod';
export const applyJobDtoSchema = z.object({
    jobId: z.string().min(1),
    resumeUrl: z.string().url().refine((value) => value.toLowerCase().endsWith('.pdf'), {
        message: 'Resume must be a PDF file',
    }),
    coverLetter: z.string().optional(),
});
export const updateApplicationStatusDtoSchema = z.object({
    status: z.enum(['shortlisted', 'rejected', 'selected']),
});
