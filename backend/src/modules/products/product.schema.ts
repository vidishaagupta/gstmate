import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    price: z.number().min(0),
    gstRate: z.number().min(0).max(100),
  }),
});
