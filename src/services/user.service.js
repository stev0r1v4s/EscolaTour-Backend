import { userRepository } from '../repositories/user.repository.js';

class UserService {
  async getUsersPaginated({ page = 1, limit = 10, search = '' }) {
    const p = parseInt(page, 10);
    const l = parseInt(limit, 10);
    
    const skip = (p - 1) * l;
    const take = l;

    const users = await userRepository.findPaginated({ skip, take, search });
    const total = await userRepository.count(search);

    return {
      users,
      pagination: {
        total,
        page: p,
        limit: l,
        totalPages: Math.ceil(total / l)
      }
    };
  }

  async updateUserStatus(id, status) {
    const validStatuses = ['Activo', 'Inactivo', 'Suspendido'];
    if (!validStatuses.includes(status)) {
      throw new Error('Estado inválido. Debe ser: Activo, Inactivo o Suspendido.');
    }

    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('Usuario no encontrado.');
    }

    return userRepository.update(id, { status });
  }
}

export const userService = new UserService();
