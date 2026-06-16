import { reportService } from '../services/report.service.js';

class ReportController {
  // POST /destinations/:id/report  — authenticated user submits a report
  async createReport(req, res) {
    try {
      const userId        = req.user.id;
      const destinationId = req.params.id;
      const { reason, details } = req.body;

      const report = await reportService.createReport(userId, destinationId, reason, details);
      return res.status(201).json({
        message: 'Reporte enviado exitosamente.',
        report
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message || 'Error al enviar el reporte.'
      });
    }
  }

  // GET /reports  — admin gets paginated list
  async getReports(req, res) {
    try {
      const page   = parseInt(req.query.page,  10) || 1;
      const limit  = parseInt(req.query.limit, 10) || 20;
      const { status } = req.query;

      const result = await reportService.getReports({ page, limit, status });
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        message: 'Error al obtener los reportes.',
        error: error.message
      });
    }
  }

  // PATCH /reports/:id/status  — admin updates report status
  async updateReportStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updated = await reportService.updateReportStatus(id, status);
      return res.status(200).json({
        message: 'Estado del reporte actualizado.',
        report: updated
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message || 'Error al actualizar el reporte.'
      });
    }
  }
}

export const reportController = new ReportController();
