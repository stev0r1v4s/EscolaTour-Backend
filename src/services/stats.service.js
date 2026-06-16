import { userRepository } from '../repositories/user.repository.js';
import { destinationRepository } from '../repositories/destination.repository.js';
import { reservationRepository } from '../repositories/reservation.repository.js';

class StatsService {
  async getDashboardKPIs() {
    const [usuariosActivos, destinosRegistrados, reservasMes] = await Promise.all([
      userRepository.countActiveUsers(),
      destinationRepository.countTotal(),
      reservationRepository.countReservationsInCurrentMonth()
    ]);

    return {
      usuariosActivos,
      destinosRegistrados,
      reservasMes
    };
  }

  async getPublicStats() {
    const [destinosEducativos, usuariosRegistrados, categoriasTematicas, calificacionPromedioBruta] = await Promise.all([
      destinationRepository.countTotal(),
      userRepository.countActiveUsers(),
      destinationRepository.getUniqueCategoriesCount(),
      destinationRepository.getAverageRating()
    ]);

    const calificacionPromedio = Number(calificacionPromedioBruta.toFixed(1));

    return {
      destinosEducativos,
      usuariosRegistrados,
      categoriasTematicas,
      calificacionPromedio
    };
  }
}

export const statsService = new StatsService();
