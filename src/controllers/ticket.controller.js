import { ticketService } from '../services/ticket.service.js';

class TicketController {
  async getTickets(req, res) {
    try {
      const tickets = await ticketService.getTickets();
      return res.status(200).json(tickets);
    } catch (error) {
      return res.status(500).json({
        message: 'Error al obtener los tickets de soporte.',
        error: error.message
      });
    }
  }

  async createTicket(req, res) {
    const userId = req.user.id; // From auth middleware
    const { subject, message } = req.body;

    try {
      const ticket = await ticketService.createTicket(userId, subject, message);
      return res.status(201).json({
        message: 'Ticket de soporte creado exitosamente.',
        ticket
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message || 'Error al crear el ticket de soporte.'
      });
    }
  }

  async updateStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const ticket = await ticketService.updateTicketStatus(id, status);
      return res.status(200).json({
        message: 'Estado del ticket actualizado exitosamente.',
        ticket
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message || 'Error al actualizar el estado del ticket.'
      });
    }
  }
}

export const ticketController = new TicketController();
