import { z } from 'zod';

export const createClientSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    address: z.string().optional(),
    gstin: z.string().optional(),
    state: z.string().min(2),
  }),
});
