import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { uploadAvatarFile } from '../middleware/upload.middleware.js';

const router = Router();

// Admin-only user management routes
router.get('/', authenticate, authorize('Administrador'), userController.getUsers);
router.patch('/:id/status', authenticate, authorize('Administrador'), userController.updateStatus);

// Authenticated user profile update
router.patch('/me/profile', authenticate, userController.updateProfile);
router.post('/me/avatar', authenticate, uploadAvatarFile, userController.updateAvatar);
router.patch('/me/preferences', authenticate, userController.updatePreferences);
router.delete('/me', authenticate, userController.deleteAccount);

export default router;
