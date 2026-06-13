import { ticketRepository } from '../repositories/ticket.repository.js';
import { userRepository } from '../repositories/user.repository.js';

class TicketService {
  async getTickets() {
    return ticketRepository.findAll();
  }

  async createTicket(userId, subject, message) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('Usuario solicitante no existe.');
    }

    if (!subject || !message) {
      throw new Error('El asunto y el mensaje son campos obligatorios.');
    }

    return ticketRepository.create({
      userId,
      subject,
      message,
      status: 'Pendiente'
    });
  }

  async updateTicketStatus(id, status) {
    const ticket = await ticketRepository.findById(id);
    if (!ticket) {
      throw new Error('Ticket no encontrado.');
    }

    const validStatuses = ['Pendiente', 'En progreso', 'Resuelto'];
    if (!validStatuses.includes(status)) {
      throw new Error('Estado de ticket inválido.');
    }

    return ticketRepository.updateStatus(id, status);
  }
}

export const ticketService = new TicketService();
