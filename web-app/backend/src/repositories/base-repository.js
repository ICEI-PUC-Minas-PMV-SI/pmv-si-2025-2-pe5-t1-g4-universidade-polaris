export class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll(filters = {}, options = {}) {
    const { skip = 0, limit = 10, sort = [['createdAt', 'DESC']] } = options;
    const results = await this.model.findAll({
      where: filters,
      offset: skip,
      limit,
      order: sort,
      raw: true,
    });
    return results.map((item) => this._normalizeItem(item));
  }

  async findById(id) {
    const result = await this.model.findByPk(id, { raw: true });
    return result ? this._normalizeItem(result) : null;
  }

  async findOne(filters) {
    const result = await this.model.findOne({
      where: filters,
      raw: true,
    });
    return result ? this._normalizeItem(result) : null;
  }

  async create(data) {
    const result = await this.model.create(data, { raw: true });
    return this._normalizeItem(result);
  }

  async update(id, data) {
    await this.model.update(data, { where: { id } });
    const result = await this.findById(id);
    return result ? this._normalizeItem(result) : null;
  }

  async delete(id) {
    return await this.model.destroy({ where: { id } });
  }

  async count(filters = {}) {
    return await this.model.count({ where: filters });
  }

  _normalizeItem(item) {
    if (item && typeof item === 'object' && item.gpa !== undefined) {
      return {
        ...item,
        gpa: item.gpa ? parseFloat(item.gpa) : null,
        semester: item.semester ? parseInt(item.semester) : item.semester,
      };
    }
    return item;
  }
}
