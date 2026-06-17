import { authService } from '../services/auth.service.js';

class AuthController {

  async register(req, res) {
    const { fullName, username, email, password } = req.body;
    if (!fullName || !username || !email || !password) {
      return res.status(400).json({
        message: 'Todos los campos son obligatorios (fullName, username, email, password).'
      });
    }
    try {
      const result = await authService.register(req.body);
      return res.status(201).json({ message: result.message });
    } catch (error) {
      return res.status(400).json({ message: error.message || 'Error al registrar el usuario.' });
    }
  }

  async login(req, res) {
    const { username, password } = req.body;
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
      // Special sentinel — tell frontend the account needs verification
      if (error.message === 'PENDING_VERIFICATION') {
        return res.status(403).json({
          code: 'PENDING_VERIFICATION',
          message: 'Tu cuenta aún no ha sido verificada. Revisa tu correo y haz clic en el enlace de activación.'
        });
      }
      return res.status(400).json({ message: error.message || 'Error al iniciar sesión.' });
    }
  }

  async getCurrentUser(req, res) {
    return res.status(200).json({ user: req.user });
  }

  async changePassword(req, res) {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'La contraseña actual y la nueva contraseña son obligatorias.'
      });
    }
    try {
      const result = await authService.changePassword(userId, currentPassword, newPassword);
      return res.status(200).json({ message: result.message, passwordChangedAt: result.passwordChangedAt });
    } catch (error) {
      return res.status(400).json({ message: error.message || 'Error al cambiar la contraseña.' });
    }
  }

  async verifyEmail(req, res) {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ message: 'Token de verificación requerido.' });
    }
    try {
      const result = await authService.verifyEmail(token);
      return res.status(200).json({
        message: '¡Correo verificado exitosamente! Tu cuenta está activa.',
        token: result.token,
        user:  result.user
      });
    } catch (error) {
      return res.status(400).json({ message: error.message || 'Error al verificar el correo.' });
    }
  }

  async resendVerification(req, res) {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'El correo electrónico es obligatorio.' });
    }
    try {
      await authService.resendVerification(email);
      // Always respond with success to avoid email enumeration
      return res.status(200).json({
        message: 'Si el correo existe y no está verificado, recibirás un nuevo enlace en breve.'
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error al reenviar el correo de verificación.' });
    }
  }
}

export const authController = new AuthController();
