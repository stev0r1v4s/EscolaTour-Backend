import { reservationService } from '../services/reservation.service.js';

class ReservationController {
  async createReservation(req, res) {
    const userId = req.user.id; // From auth middleware
    try {
      const reservation = await reservationService.createReservation(userId, req.body);
      return res.status(201).json({
        message: 'Reserva creada exitosamente para tu viaje escolar.',
        reservation
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message || 'Error al crear la reserva.'
      });
    }
  }

  async getMyReservations(req, res) {
    const userId = req.user.id;
    try {
      const reservations = await reservationService.getUserReservations(userId);
      return res.status(200).json(reservations);
    } catch (error) {
      return res.status(500).json({
        message: 'Error al obtener tus reservas.',
        error: error.message
      });
    }
  }

  async getAllReservations(req, res) {
    try {
      const reservations = await reservationService.getAllReservations();
      return res.status(200).json(reservations);
    } catch (error) {
      return res.status(500).json({
        message: 'Error al obtener el historial de reservas.',
        error: error.message
      });
    }
  }
}

export const reservationController = new ReservationController();
