import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  gstin?: string;
  state: string;
  isDeleted: boolean;
}

const clientSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    gstin: { type: String },
    state: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Client = mongoose.model<IClient>('Client', clientSchema);
