import { AuthService } from '../services/auth-service.js';

const ROLE_HIERARCHY = {
  admin: 0,
  moderator: 1,
  teacher: 2,
  student: 3,
};

export class UserController {
  constructor() {
    this.authService = new AuthService();
  }

  canManageRole(userRole, targetRole) {
    const userLevel = ROLE_HIERARCHY[userRole];
    const targetLevel = ROLE_HIERARCHY[targetRole];
    return userLevel < targetLevel;
  }

  async createUser(req, res) {
    try {
      const { name, email, password, role } = req.body;
      const currentUser = req.user;

      if (!role) {
        return res.status(400).json({
          success: false,
          error: 'Role é obrigatório',
        });
      }

      if (!this.canManageRole(currentUser.role, role)) {
        return res.status(403).json({
          success: false,
          error: 'Você não tem permissão para criar usuários com essa função',
        });
      }

      const user = await this.authService.createUser({
        name,
        email,
        password,
        role,
      });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: { user },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const currentUser = req.user;
      const skip = (page - 1) * limit;

      const users = await this.authService.getAllUsers({}, {
        skip,
        limit: parseInt(limit),
      });

      const currentUserLevel = ROLE_HIERARCHY[currentUser.role];
      const filteredUsers = users.filter((user) => {
        const userLevel = ROLE_HIERARCHY[user.role];
        return userLevel >= currentUserLevel;
      });

      const total = filteredUsers.length;

      res.status(200).json({
        success: true,
        data: { users: filteredUsers },
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const currentUser = req.user;

      const user = await this.authService.getUserById(id);

      const currentUserLevel = ROLE_HIERARCHY[currentUser.role];
      const userLevel = ROLE_HIERARCHY[user.role];

      if (userLevel < currentUserLevel) {
        return res.status(403).json({
          success: false,
          error: 'Você não tem permissão para visualizar esse usuário',
        });
      }

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

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const currentUser = req.user;

      const targetUser = await this.authService.getUserById(id);
      const currentUserLevel = ROLE_HIERARCHY[currentUser.role];
      const targetUserLevel = ROLE_HIERARCHY[targetUser.role];

      if (targetUserLevel < currentUserLevel) {
        return res.status(403).json({
          success: false,
          error: 'Você não tem permissão para editar esse usuário',
        });
      }

      if (updates.role && !this.canManageRole(currentUser.role, updates.role)) {
        return res.status(403).json({
          success: false,
          error: 'Você não tem permissão para atribuir essa função',
        });
      }

      const user = await this.authService.updateUser(id, updates);

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: { user },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const currentUser = req.user;

      if (currentUser.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Apenas administradores podem deletar usuários',
        });
      }

      const targetUser = await this.authService.getUserById(id);

      if (targetUser.id === currentUser.id) {
        return res.status(400).json({
          success: false,
          error: 'Você não pode deletar sua própria conta',
        });
      }

      await this.authService.deleteUser(id);

      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
}

