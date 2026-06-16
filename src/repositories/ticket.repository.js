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

  async findAll({ page = 1, limit = 20, status } = {}) {
    const skip = (page - 1) * limit;

    const whereClause = status ? { status } : {};

    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
              username: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.supportTicket.count({ where: whereClause })
    ]);

    return { tickets, total, page, totalPages: Math.ceil(total / limit) };
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
