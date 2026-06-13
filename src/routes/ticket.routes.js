import { Router } from 'express';
import { ticketController } from '../controllers/ticket.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

// Create ticket (Authenticated user)
router.post('/', authenticate, ticketController.createTicket);

// Manage tickets (Admin only)
router.get('/', authenticate, authorize('Administrador'), ticketController.getTickets);
router.patch('/:id/status', authenticate, authorize('Administrador'), ticketController.updateStatus);

export default router;
