import { Router } from 'express';
import { reservationController } from '../controllers/reservation.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

// Create reservation (Authenticated user / Teacher)
router.post('/', authenticate, reservationController.createReservation);

// View user's own reservations
router.get('/my', authenticate, reservationController.getMyReservations);

// Cancel a reservation
router.delete('/:id', authenticate, reservationController.cancelReservation);

// Update participants on a reservation
router.patch('/:id', authenticate, reservationController.updateReservation);

// View all reservations (Admin only)
router.get('/', authenticate, authorize('Administrador'), reservationController.getAllReservations);

// Admin update any reservation
router.patch('/admin/:id', authenticate, authorize('Administrador'), reservationController.adminUpdateReservation);

export default router;
