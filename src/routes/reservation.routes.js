import { Router } from 'express';
import { reservationController } from '../controllers/reservation.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

// Create reservation (Authenticated user / Teacher)
router.post('/', authenticate, reservationController.createReservation);

// View user's own reservations
router.get('/my', authenticate, reservationController.getMyReservations);

// View all reservations (Admin only)
router.get('/', authenticate, authorize('Administrador'), reservationController.getAllReservations);

export default router;
