import { BaseRepository } from './base-repository.js';
import { User } from '../models/user.js';

export class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return await this.model.findOne({
      where: { email },
      raw: true,
    });
  }

  async findByEmailWithPassword(email) {
    return await this.model.findOne({
      where: { email },
      attributes: { include: ['password'] },
    });
  }
}
