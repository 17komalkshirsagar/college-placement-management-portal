import { z } from 'zod';
export const createOfferDtoSchema = z.object({
    applicationId: z.string().min(1),
    offeredCtc: z.number().positive(),
    joiningDate: z.string().datetime(),
});
export const respondOfferDtoSchema = z.object({
    action: z.enum(['accepted', 'rejected']),
});
