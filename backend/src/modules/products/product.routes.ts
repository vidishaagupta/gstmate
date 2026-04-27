import { Router } from 'express';
import * as productController from './product.controller.js';
import { validate } from '../../middleware/validate.js';
import { createProductSchema } from './product.schema.js';

const router = Router();

router.get('/', productController.getProducts);
router.post('/', validate(createProductSchema), productController.createProduct);
router.patch('/:id', validate(createProductSchema.partial()), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;
