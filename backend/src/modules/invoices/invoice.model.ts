import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoiceItem {
  description: string;
  quantity: number;
  price: number;
  gstRate: number;
}

export interface IInvoice extends Document {
  invoiceNumber: string;
  clientId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  items: IInvoiceItem[];
  subtotal: number;
  discount: number;
  totalGst: number;
  grandTotal: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  isDeleted: boolean;
}

const invoiceItemSchema = new Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  gstRate: { type: Number, required: true },
});

const invoiceSchema: Schema = new Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    items: [invoiceItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    totalGst: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['draft', 'sent', 'paid', 'overdue'], 
      default: 'draft' 
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Invoice = mongoose.model<IInvoice>('Invoice', invoiceSchema);
