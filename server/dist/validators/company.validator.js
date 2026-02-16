import { z } from 'zod';
export const updateCompanyProfileDtoSchema = z.object({
    companyName: z.string().min(2).optional(),
    hrEmail: z.string().email().optional(),
    hrMobileNumber: z.string().min(10).optional(),
    website: z.string().url().optional(),
    industry: z.string().min(2).optional(),
    headquarters: z.string().min(2).optional(),
});
export const updateCompanyActivationDtoSchema = z.object({
    isActive: z.boolean(),
});
export const adminUpdateCompanyDtoSchema = z.object({
    companyName: z.string().min(2).optional(),
    hrEmail: z.string().email().optional(),
    hrMobileNumber: z.string().min(10).optional(),
    isActive: z.boolean().optional(),
});
export const adminUpdateCompanyStatusDtoSchema = z.object({
    isActive: z.boolean(),
});
export const adminCompanyIdParamSchema = z.object({
    companyId: z.string().min(1),
});
