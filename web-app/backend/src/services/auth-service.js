import jwt from 'jsonwebtoken';
import { env } from '../config/index.js';
import { UserRepository } from '../repositories/user-repository.js';
import { SecurityLogger, ConsoleLogger } from '../lib/index.js';

export class AuthService {
  constructor(logger = null) {
    this.userRepository = new UserRepository();
    this.securityLogger = new SecurityLogger(logger || new ConsoleLogger());
  }

  async createUser(user_data) {
    const { name, email, password, role } = user_data;

    const existing_user = await this.userRepository.findByEmail(email);
    if (existing_user) {
      throw new Error('Email already registered');
    }

    const user = await this.userRepository.create({
      name,
      email,
      password,
      role: role || 'student',
    });

    const user_response = user.get({ plain: true });
    delete user_response.password;

    return user_response;
  }

  async login(email, password) {
    if (!email || !password) {
      this.securityLogger.logAuthenticationFailure(email || 'unknown', 'Missing credentials');
      throw new Error('Please provide email and password');
    }

    const user = await this.userRepository.findByEmailWithPassword(email);
    if (!user) {
      this.securityLogger.logAuthenticationFailure(email, 'User not found');
      throw new Error('Invalid credentials');
    }

    const is_password_valid = await user.comparePassword(password);
    if (!is_password_valid) {
      this.securityLogger.logAuthenticationFailure(email, 'Invalid password');
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.jwt.secret,
      { expiresIn: env.jwt.expiresIn }
    );

    const user_response = user.get({ plain: true });
    delete user_response.password;

    this.securityLogger.logSuccessfulLogin(user.id, email);

    return { user: user_response, token };
  }

  async verifyToken(token) {
    try {
      return jwt.verify(token, env.jwt.secret);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  async getUserById(user_id) {
    const user = await this.userRepository.findById(user_id);
    if (!user) {
      throw new Error('User not found');
    }
    if (user.password) {
      delete user.password;
    }
    return user;
  }

  async getAllUsers(filters = {}, options = {}) {
    const users = await this.userRepository.findAll(filters, options);
    return users.map((user) => {
      if (user.password) {
        delete user.password;
      }
      return user;
    });
  }

  async updateUser(user_id, updates) {
    const { name, email, password, role } = updates;

    const user = await this.userRepository.findById(user_id);
    if (!user) {
      throw new Error('User not found');
    }

    const update_data = {};
    if (name) update_data.name = name;
    if (email) {
      const existing = await this.userRepository.findByEmail(email);
      if (existing && existing.id !== user_id) {
        throw new Error('Email already in use');
      }
      update_data.email = email;
    }
    if (password) update_data.password = password;
    if (role && ['admin', 'moderator', 'teacher', 'student'].includes(role)) {
      update_data.role = role;
    }

    const updated_user = await this.userRepository.update(user_id, update_data);
    if (updated_user.password) {
      delete updated_user.password;
    }
    return updated_user;
  }
  //TODO: a validação do update poderia ser refatorada para ser mais modular e reutilizável


  async updateProfile(user_id, updates) {
    const { name, email, password } = updates;

    const user = await this.userRepository.findById(user_id);
    if (!user) {
      throw new Error('User not found');
    }

    const update_data = {};
    if (name) update_data.name = name;
    if (email) {
      const existing = await this.userRepository.findByEmail(email);
      if (existing && existing.id !== user_id) {
        throw new Error('Email already in use');
      }
      update_data.email = email;
    }
    if (password) {
      if (password.length < 6) {
        throw new Error('Senha deve ter pelo menos 6 caracteres');
      }
      update_data.password = password;
    }

    const updated_user = await this.userRepository.update(user_id, update_data);
    if (updated_user.password) {
      delete updated_user.password;
    }
    return updated_user;
  }
  //TODO: a validação do update poderia ser refatorada para ser mais modular e reutilizável

  async deleteUser(user_id) {
    const user = await this.userRepository.findById(user_id);
    if (!user) {
      throw new Error('User not found');
    }

    await this.userRepository.delete(user_id);
    return { message: 'User deleted successfully' };
  }
}
