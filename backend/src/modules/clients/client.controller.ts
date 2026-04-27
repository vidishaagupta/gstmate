import { Request, Response, NextFunction } from 'express';
import { Client } from './client.model.js';

export const getClients = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clients = await Client.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: clients });
  } catch (error) {
    next(error);
  }
};

export const createClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
};

export const updateClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!client) return res.status(404).json({ success: false, message: 'Client not found' });
    res.status(200).json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
};

export const deleteClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!client) return res.status(404).json({ success: false, message: 'Client not found' });
    res.status(200).json({ success: true, message: 'Client deleted' });
  } catch (error) {
    next(error);
  }
};
