import { Router } from 'express';
import * as userController from './user.controller.js';
import { validate } from '../../middleware/validate.js';
import { updateUserProfileSchema } from './user.schema.js';

const router = Router();

router.get('/', userController.getProfile);
router.patch('/', validate(updateUserProfileSchema), userController.updateProfile);

export default router;
