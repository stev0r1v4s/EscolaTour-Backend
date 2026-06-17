import { prisma } from '../config/db.js';

class ReportRepository {
  async create({ userId, destinationId, reason, details }) {
    return prisma.destinationReport.create({
      data: { userId, destinationId, reason, details },
      include: {
        user:        { select: { fullName: true, email: true } },
        destination: { select: { title: true } }
      }
    });
  }

  async findAll({ page = 1, limit = 20, status } = {}) {
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};

    const [reports, total] = await Promise.all([
      prisma.destinationReport.findMany({
        where,
        include: {
          user:        { select: { fullName: true, email: true } },
          destination: { select: { title: true, location: true, imageUrl: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.destinationReport.count({ where })
    ]);

    return { reports, total, page, totalPages: Math.ceil(total / limit) };
  }

  async updateStatus(id, status) {
    return prisma.destinationReport.update({
      where: { id },
      data: { status },
      include: {
        user:        { select: { fullName: true, email: true } },
        destination: { select: { title: true } }
      }
    });
  }

  async findById(id) {
    return prisma.destinationReport.findUnique({
      where: { id },
      include: {
        user:        { select: { fullName: true, email: true } },
        destination: { select: { title: true } }
      }
    });
  }
}

export const reportRepository = new ReportRepository();
