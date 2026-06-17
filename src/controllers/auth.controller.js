import { authService } from '../services/auth.service.js';

class AuthController {
  async register(req, res) {
    const { fullName, username, email, password } = req.body;

    // Validation
    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ 
        message: 'Todos los campos son obligatorios (fullName, username, email, password).' 
      });
    }

    try {
      const result = await authService.register(req.body);
      return res.status(201).json({
        message: 'Usuario registrado exitosamente.',
        token: result.token,
        user: result.user
      });
    } catch (error) {
      return res.status(400).json({ 
        message: error.message || 'Error al registrar el usuario.' 
      });
    }
  }

  async login(req, res) {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'El nombre de usuario/correo y la contraseña son obligatorios.' 
      });
    }

    try {
      const result = await authService.login(username, password);
      return res.status(200).json({
        message: 'Inicio de sesión exitoso.',
        token: result.token,
        user: result.user
      });
    } catch (error) {
      return res.status(400).json({ 
        message: error.message || 'Error al iniciar sesión.' 
      });
    }
  }

  async getCurrentUser(req, res) {
    // req.user is populated by authenticate middleware
    return res.status(200).json({
      user: req.user
    });
  }

  async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          message: 'La contraseña actual y la nueva contraseña son obligatorias.'
        });
      }

      const result = await authService.changePassword(userId, currentPassword, newPassword);
      return res.status(200).json({
        message: result.message,
        passwordChangedAt: result.passwordChangedAt
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message || 'Error al cambiar la contraseña.'
      });
    }
  }
}

export const authController = new AuthController();
