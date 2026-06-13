import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository.js';
import { config } from '../config/config.js';

class AuthService {
  /**
   * Register a new user
   */
  async register(userData) {
    const { fullName, username, email, password, role } = userData;

    // Check if username already exists
    const existingUsername = await userRepository.findByUsername(username);
    if (existingUsername) {
      throw new Error('El nombre de usuario ya está registrado.');
    }

    // Check if email already exists
    const existingEmail = await userRepository.findByEmail(email);
    if (existingEmail) {
      throw new Error('El correo electrónico ya está registrado.');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in DB
    const newUser = await userRepository.create({
      fullName,
      username,
      email,
      password: hashedPassword,
      role: role || 'Usuario', // Defaults to 'Usuario'
      status: 'Activo'
    });

    // Generate JWT
    const token = this.generateToken(newUser);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    return {
      token,
      user: userWithoutPassword
    };
  }

  /**
   * Authenticate a user
   */
  async login(usernameOrEmail, password) {
    // Find user by either email or username
    let user = await userRepository.findByEmail(usernameOrEmail);
    if (!user) {
      user = await userRepository.findByUsername(usernameOrEmail);
    }

    if (!user) {
      throw new Error('Credenciales incorrectas (usuario/email o contraseña no coinciden).');
    }

    // Check status
    if (user.status === 'Suspendido') {
      throw new Error('Tu cuenta ha sido suspendida. Contacta con soporte.');
    }

    if (user.status === 'Inactivo') {
      // Re-activate user upon login if inactive
      user = await userRepository.update(user.id, { status: 'Activo' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Credenciales incorrectas (usuario/email o contraseña no coinciden).');
    }

    // Update lastLogin timestamp
    const updatedUser = await userRepository.update(user.id, {
      lastLogin: new Date()
    });

    // Generate JWT
    const token = this.generateToken(updatedUser);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;

    return {
      token,
      user: userWithoutPassword
    };
  }

  /**
   * Helper method to generate JWT
   */
  generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
  }
}

export const authService = new AuthService();
