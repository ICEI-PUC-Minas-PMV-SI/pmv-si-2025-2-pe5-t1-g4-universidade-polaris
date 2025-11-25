import express from 'express';
import rateLimit from 'express-rate-limit';
import { AuthController } from '../controllers/auth-controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateLogin, handleValidationErrors } from '../middleware/validators.js';
import { login_rate_limit_options } from '../config/rate-limit.js';
import { handleRateLimitExceeded } from '../middleware/rate-limit.js';

const router = express.Router();
const authController = new AuthController();

const loginRateLimiter = rateLimit({
  ...login_rate_limit_options,
  handler: handleRateLimitExceeded,
});

router.post(
  '/login',
  loginRateLimiter,
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
