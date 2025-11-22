import { AuthService } from '../services/auth-service.js';

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { user, token } = await this.authService.login(email, password);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getProfile(req, res) {
    try {
      const user_id = req.user.id;
      const user = await this.authService.getUserById(user_id);

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const user_id = req.user.id;
      const { name, email, password } = req.body;

      const user = await this.authService.updateProfile(user_id, { name, email, password });

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: { user },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
}
