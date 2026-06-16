import { reportRepository } from '../repositories/report.repository.js';

class ReportService {
  async createReport(userId, destinationId, reason, details) {
    if (!reason) throw new Error('El motivo del reporte es obligatorio.');
    return reportRepository.create({ userId, destinationId, reason, details });
  }

  async getReports({ page = 1, limit = 20, status } = {}) {
    return reportRepository.findAll({ page, limit, status });
  }

  async updateReportStatus(id, status) {
    const validStatuses = ['Pendiente', 'Revisado', 'Descartado'];
    if (!validStatuses.includes(status)) {
      throw new Error('Estado inválido. Debe ser: Pendiente, Revisado o Descartado.');
    }

    const report = await reportRepository.findById(id);
    if (!report) throw new Error('Reporte no encontrado.');

    return reportRepository.updateStatus(id, status);
  }
}

export const reportService = new ReportService();
