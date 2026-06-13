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
}

export const userController = new UserController();
