import { statsService } from '../services/stats.service.js';

class StatsController {
  async getStats(req, res) {
    try {
      const stats = await statsService.getDashboardKPIs();
      return res.status(200).json(stats);
    } catch (error) {
      return res.status(500).json({
        message: 'Error al obtener estadísticas del sistema.',
        error: error.message
      });
    }
  }

  async getPublicStats(req, res) {
    try {
      const stats = await statsService.getPublicStats();
      return res.status(200).json(stats);
    } catch (error) {
      return res.status(500).json({
        message: 'Error al obtener estadísticas públicas.',
        error: error.message
      });
    }
  }
}

export const statsController = new StatsController();
