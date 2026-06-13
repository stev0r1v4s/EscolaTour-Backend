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
    const [destinosEducativos, usuariosRegistrados, destinations] = await Promise.all([
      destinationRepository.countTotal(),
      userRepository.countActiveUsers(),
      destinationRepository.findAll()
    ]);

    // calculate unique categories and average rating
    const uniqueCategories = new Set(destinations.map(d => d.category));
    const categoriasTematicas = uniqueCategories.size;

    let calificacionPromedio = 5.0;
    if (destinations.length > 0) {
      const sumRatings = destinations.reduce((sum, d) => sum + (d.rating || 0), 0);
      calificacionPromedio = Number((sumRatings / destinations.length).toFixed(1));
    }

    return {
      destinosEducativos,
      usuariosRegistrados,
      categoriasTematicas,
      calificacionPromedio
    };
  }
}

export const statsService = new StatsService();
