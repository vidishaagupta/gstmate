import { Router } from 'express';
import * as clientController from './client.controller.js';
import { validate } from '../../middleware/validate.js';
import { createClientSchema } from './client.schema.js';

const router = Router();

router.get('/', clientController.getClients);
router.post('/', validate(createClientSchema), clientController.createClient);
router.patch('/:id', validate(createClientSchema.partial()), clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

export default router;
