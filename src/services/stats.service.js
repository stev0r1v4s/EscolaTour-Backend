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
}

export const statsService = new StatsService();
