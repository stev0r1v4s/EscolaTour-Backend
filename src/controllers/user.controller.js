import { userService } from '../services/user.service.js';

class UserController {
  async getUsers(req, res) {
    try {
      const { page, limit, search } = req.query;
      const result = await userService.getUsersPaginated({ page, limit, search });
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        message: 'Error al listar los usuarios.',
        error: error.message
      });
    }
  }

  async updateStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'El campo status es requerido.' });
    }

    try {
      const updatedUser = await userService.updateUserStatus(id, status);
      return res.status(200).json({
        message: 'Estado de usuario actualizado exitosamente.',
        user: {
          id: updatedUser.id,
          fullName: updatedUser.fullName,
          username: updatedUser.username,
          email: updatedUser.email,
          role: updatedUser.role,
          status: updatedUser.status
        }
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message || 'Error al actualizar el estado del usuario.'
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { fullName, email, phone, city } = req.body;
      const updated = await userService.updateProfile(userId, { fullName, email, phone, city });
      return res.status(200).json({
        message: 'Perfil actualizado exitosamente.',
        user: {
          id: updated.id,
          fullName: updated.fullName,
          username: updated.username,
          email: updated.email,
          phone: updated.phone,
          city: updated.city,
          avatarUrl: updated.avatarUrl,
          role: updated.role,
          status: updated.status,
          language: updated.language,
          currency: updated.currency,
          publicProfile: updated.publicProfile,
          searchHistory: updated.searchHistory,
          theme: updated.theme
        }
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message || 'Error al actualizar el perfil.'
      });
    }
  }

  async updateAvatar(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No se subió ninguna imagen.' });
      }
      
      const avatarUrl = `/uploads/avatars/${req.file.filename}`;
      const userId = req.user.id;
      
      const updated = await userService.updateAvatar(userId, avatarUrl);
      
      return res.status(200).json({
        message: 'Foto de perfil actualizada exitosamente.',
        user: {
          id: updated.id,
          fullName: updated.fullName,
          username: updated.username,
          email: updated.email,
          phone: updated.phone,
          city: updated.city,
          avatarUrl: updated.avatarUrl,
          role: updated.role,
          status: updated.status,
          language: updated.language,
          currency: updated.currency,
          publicProfile: updated.publicProfile,
          searchHistory: updated.searchHistory,
          theme: updated.theme
        }
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message || 'Error al actualizar la foto de perfil.'
      });
    }
  }

  async updatePreferences(req, res) {
    try {
      const userId = req.user.id;
      const { language, currency, publicProfile, searchHistory, theme } = req.body;
      const updated = await userService.updatePreferences(userId, { language, currency, publicProfile, searchHistory, theme });
      return res.status(200).json({
        message: 'Preferencias actualizadas exitosamente.',
        preferences: {
          language: updated.language, currency: updated.currency,
          publicProfile: updated.publicProfile, searchHistory: updated.searchHistory,
          theme: updated.theme
        }
      });
    } catch (error) {
      return res.status(400).json({ message: error.message || 'Error al actualizar las preferencias.' });
    }
  }

  async deleteAccount(req, res) {
    try {
      const userId = req.user.id;
      await userService.deleteAccount(userId);
      return res.status(200).json({ message: 'Cuenta eliminada exitosamente.' });
    } catch (error) {
      return res.status(400).json({ message: error.message || 'Error al eliminar la cuenta.' });
    }
  }
}

export const userController = new UserController();
