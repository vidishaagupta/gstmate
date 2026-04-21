import { Router } from 'express';
import clientRoutes from './modules/clients/client.routes.js';
import productRoutes from './modules/products/product.routes.js';
import invoiceRoutes from './modules/invoices/invoice.routes.js';
import userRoutes from './modules/users/user.routes.js';

const router = Router();

router.use('/clients', clientRoutes);
router.use('/products', productRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/profile', userRoutes);

export default router;
