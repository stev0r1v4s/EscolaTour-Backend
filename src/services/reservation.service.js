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

  async getAllReservations() {
    return reservationRepository.findAll();
  }
}

export const reservationService = new ReservationService();
