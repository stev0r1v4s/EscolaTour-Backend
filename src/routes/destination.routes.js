import { Router } from 'express';
import { destinationController } from '../controllers/destination.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { uploadDestinationFiles } from '../middleware/upload.middleware.js';

const router = Router();

// Public routes
router.get('/', destinationController.getDestinations);
router.get('/:id', destinationController.getDestinationById);

// Admin-only routes (Requires JWT authentication + 'Administrador' role)
router.post(
  '/', 
  authenticate, 
  authorize('Administrador'), 
  uploadDestinationFiles, 
  destinationController.createDestination
);

router.put(
  '/:id', 
  authenticate, 
  authorize('Administrador'), 
  uploadDestinationFiles, 
  destinationController.updateDestination
);

router.delete(
  '/:id', 
  authenticate, 
  authorize('Administrador'), 
  destinationController.deleteDestination
);

export default router;
