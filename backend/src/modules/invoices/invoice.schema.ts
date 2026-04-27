import { z } from 'zod';

const invoiceItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().min(0),
  price: z.number().min(0),
  gstRate: z.number().min(0).max(100),
});

export const createInvoiceSchema = z.object({
  body: z.object({
    invoiceNumber: z.string().min(1),
    clientId: z.string().min(24), // MongoDB ObjectId length
    items: z.array(invoiceItemSchema).min(1),
    subtotal: z.number().min(0),
    discount: z.number().min(0).default(0),
    totalGst: z.number().min(0),
    grandTotal: z.number().min(0),
    status: z.enum(['draft', 'sent', 'paid', 'overdue']).default('draft'),
  }),
});
