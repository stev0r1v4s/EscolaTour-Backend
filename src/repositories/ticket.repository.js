import { prisma } from '../config/db.js';

class TicketRepository {
  async create(ticketData) {
    return prisma.supportTicket.create({
      data: ticketData,
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            username: true
          }
        }
      }
    });
  }

  async findAll() {
    return prisma.supportTicket.findMany({
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            username: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id) {
    return prisma.supportTicket.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            username: true
          }
        }
      }
    });
  }

  async updateStatus(id, status) {
    return prisma.supportTicket.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            username: true
          }
        }
      }
    });
  }
}

export const ticketRepository = new TicketRepository();
