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

  async updateProfile(id, { fullName, email, phone, city }) {
    const user = await userRepository.findById(id);
    if (!user) throw new Error('Usuario no encontrado.');

    const data = {};
    if (fullName !== undefined) data.fullName = fullName;
    if (email !== undefined) data.email = email;
    if (phone !== undefined) data.phone = phone;
    if (city !== undefined) data.city = city;

    return userRepository.update(id, data);
  }

  async updateAvatar(id, avatarUrl) {
    const user = await userRepository.findById(id);
    if (!user) throw new Error('Usuario no encontrado.');

    return userRepository.update(id, { avatarUrl });
  }

  async updatePreferences(id, { language, currency, publicProfile, searchHistory, theme }) {
    const user = await userRepository.findById(id);
    if (!user) throw new Error('Usuario no encontrado.');

    const validThemes = ['Claro', 'Oscuro'];
    if (theme !== undefined && !validThemes.includes(theme)) {
      throw new Error('Tema inválido. Debe ser: Claro u Oscuro.');
    }

    const data = {};
    if (language      !== undefined) data.language      = language;
    if (currency      !== undefined) data.currency      = currency;
    if (publicProfile !== undefined) data.publicProfile = publicProfile;
    if (searchHistory !== undefined) data.searchHistory = searchHistory;
    if (theme         !== undefined) data.theme         = theme;

    return userRepository.update(id, data);
  }
}

export const userService = new UserService();
