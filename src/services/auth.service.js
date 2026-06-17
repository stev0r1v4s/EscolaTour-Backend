import bcrypt          from 'bcryptjs';
import jwt             from 'jsonwebtoken';
import crypto          from 'crypto';
import { userRepository } from '../repositories/user.repository.js';
import { emailService }   from './email.service.js';
import { config }         from '../config/config.js';

/** Generate a cryptographically secure random hex token (32 bytes = 64 hex chars). */
function generateRawToken() {
  return crypto.randomBytes(32).toString('hex');
}

/** Hash a raw token for safe DB storage (SHA-256, one-way, no salt needed — token is already high-entropy). */
function hashToken(raw) {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

class AuthService {

  // ── Register ────────────────────────────────────────────────────────────────
  async register(userData) {
    const { fullName, username, email, password } = userData;

    // Uniqueness checks
    if (await userRepository.findByUsername(username)) {
      throw new Error('El nombre de usuario ya está registrado.');
    }
    if (await userRepository.findByEmail(email)) {
      throw new Error('El correo electrónico ya está registrado.');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const rawToken   = generateRawToken();
    const hashedTok  = hashToken(rawToken);
    const expiry     = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 h

    // Create user as Pendiente (not yet active)
    await userRepository.create({
      fullName,
      username,
      email,
      password:               hashedPassword,
      role:                   'Usuario',
      status:                 'Pendiente',
      emailVerified:          false,
      verificationToken:      hashedTok,
      verificationTokenExpiry: expiry,
    });

    // Send verification email (fire — but surface errors)
    await emailService.sendVerificationEmail(email, fullName, rawToken);

    return { message: 'Revisa tu correo y haz clic en el enlace de verificación para activar tu cuenta.' };
  }

  // ── Verify email ─────────────────────────────────────────────────────────────
  async verifyEmail(rawToken) {
    if (!rawToken) throw new Error('Token inválido.');

    const hashedTok = hashToken(rawToken);

    // Find user by hashed token
    const user = await userRepository.findByVerificationToken(hashedTok);

    if (!user) {
      throw new Error('El enlace de verificación no es válido o ya fue utilizado.');
    }

    if (user.verificationTokenExpiry < new Date()) {
      throw new Error('El enlace de verificación ha expirado. Solicita uno nuevo.');
    }

    // Activate user
    const activated = await userRepository.update(user.id, {
      status:                  'Activo',
      emailVerified:           true,
      verificationToken:       null,
      verificationTokenExpiry: null,
    });

    const token       = this.generateToken(activated);
    const userResponse = this.formatUserForResponse(activated);

    return { token, user: userResponse };
  }

  // ── Resend verification email ────────────────────────────────────────────────
  async resendVerification(email) {
    const user = await userRepository.findByEmail(email);

    // Always return success to avoid email enumeration
    if (!user || user.emailVerified) return;

    const rawToken  = generateRawToken();
    const hashedTok = hashToken(rawToken);
    const expiry    = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await userRepository.update(user.id, {
      verificationToken:       hashedTok,
      verificationTokenExpiry: expiry,
    });

    await emailService.sendVerificationEmail(user.email, user.fullName, rawToken);
  }

  // ── Login ────────────────────────────────────────────────────────────────────
  async login(usernameOrEmail, password) {
    let user = await userRepository.findByEmail(usernameOrEmail);
    if (!user) user = await userRepository.findByUsername(usernameOrEmail);

    if (!user) {
      throw new Error('Credenciales incorrectas (usuario/email o contraseña no coinciden).');
    }

    if (user.status === 'Pendiente') {
      throw new Error('PENDING_VERIFICATION');
    }

    if (user.status === 'Suspendido') {
      throw new Error('Tu cuenta ha sido suspendida. Contacta con soporte.');
    }

    if (user.status === 'Inactivo') {
      user = await userRepository.update(user.id, { status: 'Activo' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Credenciales incorrectas (usuario/email o contraseña no coinciden).');
    }

    const updatedUser  = await userRepository.update(user.id, { lastLogin: new Date() });
    const token        = this.generateToken(updatedUser);
    const userResponse = this.formatUserForResponse(updatedUser);

    return { token, user: userResponse };
  }

  // ── Change password ──────────────────────────────────────────────────────────
  async changePassword(userId, currentPassword, newPassword) {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('Usuario no encontrado.');

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) throw new Error('La contraseña actual es incorrecta.');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRepository.update(userId, { password: hashedPassword, passwordChangedAt: new Date() });

    return { message: 'Contraseña actualizada exitosamente.', passwordChangedAt: new Date() };
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────
  generateToken(user) {
    return jwt.sign(
      { id: user.id, fullName: user.fullName, username: user.username, email: user.email, role: user.role, status: user.status },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
  }

  formatUserForResponse(user) {
    const { password, verificationToken, verificationTokenExpiry, ...rest } = user;
    return rest;
  }
}

export const authService = new AuthService();
