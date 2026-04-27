import { z } from 'zod';

export const updateUserProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    businessName: z.string().optional(),
    gstin: z.string().optional(),
    state: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
  }),
});
