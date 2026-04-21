import { Request, Response, NextFunction } from 'express';
import { Invoice } from './invoice.model.js';
import { User } from '../users/user.model.js';
import { Client } from '../clients/client.model.js';
import { generateInvoicePdf } from '../../utils/pdfGenerator.js';

export const getInvoices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const invoices = await Invoice.find({ isDeleted: false })
      .populate('clientId', 'name email state')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: invoices });
  } catch (error) {
    next(error);
  }
};

export const createInvoice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const invoice = await Invoice.create(req.body);
    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};

export const getInvoiceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('clientId');
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};

export const downloadInvoice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('clientId');
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

    const profile = await User.findOne({ isDeleted: false });
    
    const pdfBuffer = await generateInvoicePdf({
      ...(invoice.toObject() as any),
      businessName: profile?.businessName,
      businessAddress: profile?.address,
      businessGstin: profile?.gstin,
      businessState: profile?.state,
      businessPhone: profile?.phone,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Invoice-${invoice.invoiceNumber}.pdf`);
    res.setHeader('X-Filename', `Invoice-${invoice.invoiceNumber}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

export const previewInvoice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await User.findOne({ isDeleted: false });
    
    // If clientId is a string (ID), fetch the client details
    let clientIdData = req.body.clientId;
    if (typeof req.body.clientId === 'string') {
      clientIdData = await Client.findById(req.body.clientId);
    }
    
    const pdfBuffer = await generateInvoicePdf({
      ...req.body,
      clientId: clientIdData,
      createdAt: new Date(),
      businessName: profile?.businessName,
      businessAddress: profile?.address,
      businessGstin: profile?.gstin,
      businessState: profile?.state,
      businessPhone: profile?.phone,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

export const deleteInvoice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.status(200).json({ success: true, message: 'Invoice deleted' });
  } catch (error) {
    next(error);
  }
};

export const updateInvoiceStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('clientId');
    
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    
    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};
