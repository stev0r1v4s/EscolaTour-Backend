import { Router } from 'express';
import { destinationController } from '../controllers/destination.controller.js';
import { reportController } from '../controllers/report.controller.js';
import { reviewController } from '../controllers/review.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { uploadDestinationFiles } from '../middleware/upload.middleware.js';

const router = Router();

// Public routes
router.get('/', destinationController.getDestinations);
router.get('/top', destinationController.getTopDestinations);
router.get('/:id', destinationController.getDestinationById);
router.get('/:id/reviews', reviewController.getReviews);

// Authenticated user routes
router.post('/:id/report', authenticate, reportController.createReport);
router.post('/:id/review', authenticate, reviewController.createReview);

// Admin-only routes
router.post('/', authenticate, authorize('Administrador'), uploadDestinationFiles, destinationController.createDestination);
router.put('/:id', authenticate, authorize('Administrador'), uploadDestinationFiles, destinationController.updateDestination);
router.delete('/:id', authenticate, authorize('Administrador'), destinationController.deleteDestination);

export default router;
