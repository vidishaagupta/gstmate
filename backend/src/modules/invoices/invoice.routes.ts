import { Router } from 'express';
import * as invoiceController from './invoice.controller.js';
import { validate } from '../../middleware/validate.js';
import { createInvoiceSchema } from './invoice.schema.js';

const router = Router();

router.get('/', invoiceController.getInvoices);
router.post('/', validate(createInvoiceSchema), invoiceController.createInvoice);
router.get('/:id', invoiceController.getInvoiceById);
router.get('/:id/download', invoiceController.downloadInvoice);
router.post('/preview', invoiceController.previewInvoice);
router.delete('/:id', invoiceController.deleteInvoice);

export default router;
