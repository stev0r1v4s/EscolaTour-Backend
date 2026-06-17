import { reservationRepository } from '../repositories/reservation.repository.js';
import { destinationRepository } from '../repositories/destination.repository.js';
import { userRepository } from '../repositories/user.repository.js';

class ReservationService {
  async createReservation(userId, reservationData) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado.');
    }

    const destination = await destinationRepository.findById(reservationData.destinationId);
    if (!destination) {
      throw new Error('Destino educativo no encontrado.');
    }

    if (!reservationData.startDate || !reservationData.endDate) {
      throw new Error('Las fechas de inicio y fin son obligatorias.');
    }

    const start = new Date(reservationData.startDate);
    const end = new Date(reservationData.endDate);

    if (start >= end) {
      throw new Error('La fecha de inicio debe ser anterior a la fecha de fin.');
    }

    return reservationRepository.create({
      userId,
      destinationId: reservationData.destinationId,
      startDate: start,
      endDate: end,
      numTeachers: reservationData.numTeachers || 0,
      numStudents: reservationData.numStudents || 0
    });
  }

  async getUserReservations(userId) {
    return reservationRepository.findAllByUserId(userId);
  }

  async cancelReservation(userId, reservationId) {
    // Try to delete directly — Prisma will throw if not found
    try {
      const deleted = await reservationRepository.deleteOwned(userId, reservationId);
      return deleted;
    } catch (err) {
      if (err.code === 'P2025') throw new Error('Reserva no encontrada o ya fue cancelada.');
      if (err.message?.includes('permiso')) throw err;
      throw new Error('Error al cancelar la reserva.');
    }
  }

  async updateReservation(userId, reservationId, { numTeachers, numStudents }) {
    const data = {};
    if (numTeachers !== undefined) data.numTeachers = parseInt(numTeachers, 10);
    if (numStudents !== undefined) data.numStudents = parseInt(numStudents, 10);

    try {
      return await reservationRepository.updateOwned(userId, reservationId, data);
    } catch (err) {
      if (err.code === 'P2025') throw new Error('Reserva no encontrada.');
      throw err;
    }
  }

  async getAllReservations({ page, limit, search } = {}) {
    return reservationRepository.findAll({ page, limit, search });
  }
}

export const reservationService = new ReservationService();
