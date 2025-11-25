import express from 'express';
import { UserController } from '../controllers/user-controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateCreateUser, handleValidationErrors } from '../middleware/validators.js';

const router = express.Router();
const userController = new UserController();

router.use(authenticate);

router.post(
  '/',
  authorize(['admin', 'moderator', 'teacher']),
  validateCreateUser(),
  handleValidationErrors,
  (req, res) => userController.createUser(req, res)
);

router.get(
  '/',
  authorize(['admin', 'moderator', 'teacher']),
  (req, res) => userController.getAllUsers(req, res)
);

router.get(
  '/:id',
  authorize(['admin', 'moderator', 'teacher']),
  (req, res) => userController.getUserById(req, res)
);

router.put(
  '/:id',
  authorize(['admin', 'moderator', 'teacher']),
  (req, res) => userController.updateUser(req, res)
);

router.delete(
  '/:id',
  authorize(['admin']),
  (req, res) => userController.deleteUser(req, res)
);

export default router;
