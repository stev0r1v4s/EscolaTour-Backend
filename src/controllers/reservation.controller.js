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
      return res.status(500).json({ message: 'Error al obtener tus reservas.', error: error.message });
    }
  }

  async cancelReservation(req, res) {
    const userId = req.user.id;
    const { id } = req.params;
    try {
      await reservationService.cancelReservation(userId, id);
      return res.status(200).json({ message: 'Reserva cancelada exitosamente.' });
    } catch (error) {
      return res.status(400).json({ message: error.message || 'Error al cancelar la reserva.' });
    }
  }

  async updateReservation(req, res) {
    const userId = req.user.id;
    const { id } = req.params;
    const { numTeachers, numStudents } = req.body;
    try {
      const updated = await reservationService.updateReservation(userId, id, { numTeachers, numStudents });
      return res.status(200).json({ message: 'Reserva actualizada exitosamente.', reservation: updated });
    } catch (error) {
      return res.status(400).json({ message: error.message || 'Error al actualizar la reserva.' });
    }
  }

  async adminUpdateReservation(req, res) {
    const { id } = req.params;
    const { numTeachers, numStudents, startDate, endDate } = req.body;
    try {
      const data = {};
      if (numTeachers !== undefined) data.numTeachers = parseInt(numTeachers, 10);
      if (numStudents !== undefined) data.numStudents = parseInt(numStudents, 10);
      if (startDate) data.startDate = new Date(startDate);
      if (endDate)   data.endDate   = new Date(endDate);

      const updated = await reservationService.adminUpdateReservation(id, data);
      return res.status(200).json({ message: 'Reserva actualizada exitosamente.', reservation: updated });
    } catch (error) {
      return res.status(400).json({ message: error.message || 'Error al actualizar la reserva.' });
    }
  }

  async getAllReservations(req, res) {
    try {
      const page  = parseInt(req.query.page,  10) || 1;
      const limit = parseInt(req.query.limit, 10) || 20;
      const search = req.query.search || '';
      const result = await reservationService.getAllReservations({ page, limit, search });
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        message: 'Error al obtener el historial de reservas.',
        error: error.message
      });
    }
  }
}

export const reservationController = new ReservationController();
