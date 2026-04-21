import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  businessName?: string;
  gstin?: string;
  state?: string;
  address?: string;
  phone?: string;
  role: 'owner' | 'admin';
  isDeleted: boolean;
}

const userSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    businessName: { type: String },
    gstin: { type: String },
    state: { type: String },
    address: { type: String },
    phone: { type: String },
    role: { type: String, enum: ['owner', 'admin'], default: 'owner' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
