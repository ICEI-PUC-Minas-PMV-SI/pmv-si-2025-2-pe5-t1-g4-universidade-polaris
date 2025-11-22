import express from 'express';
import { AuthController } from '../controllers/auth-controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateLogin, handleValidationErrors } from '../middleware/validators.js';

const router = express.Router();
const authController = new AuthController();

router.post(
  '/login',
  validateLogin(),
  handleValidationErrors,
  (req, res) => authController.login(req, res)
);

router.get(
  '/profile',
  authenticate,
  (req, res) => authController.getProfile(req, res)
);

router.put(
  '/profile',
  authenticate,
  (req, res) => authController.updateProfile(req, res)
);

export default router;
