import { prisma } from '../config/db.js';

class ReservationRepository {
  async create(reservationData) {
    return prisma.reservation.create({
      data: {
        userId: reservationData.userId,
        destinationId: reservationData.destinationId,
        startDate: new Date(reservationData.startDate),
        endDate: new Date(reservationData.endDate),
        numTeachers: parseInt(reservationData.numTeachers || 0, 10),
        numStudents: parseInt(reservationData.numStudents || 0, 10)
      },
      include: {
        destination: true
      }
    });
  }

  async countReservationsInCurrentMonth() {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    return prisma.reservation.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    });
  }

  async findAllByUserId(userId) {
    return prisma.reservation.findMany({
      where: { userId },
      include: { destination: true },
      orderBy: { startDate: 'desc' }
    });
  }

  async findById(id) {
    return prisma.reservation.findUnique({ where: { id } });
  }

  async updateOwned(userId, id, data) {
    return prisma.reservation.update({
      where: { id, userId },
      data,
      include: { destination: true }
    });
  }

  async update(id, data) {
    return prisma.reservation.update({
      where: { id },
      data,
      include: { destination: true }
    });
  }

  async deleteOwned(userId, id) {
    // Delete only if the reservation belongs to this user
    return prisma.reservation.deleteMany({
      where: { id, userId }
    });
  }

  async delete(id) {
    return prisma.reservation.delete({ where: { id } });
  }

  async findAll({ page = 1, limit = 20, search = '' } = {}) {
    const skip = (page - 1) * limit;
    const where = search ? {
      OR: [
        { user: { fullName: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { destination: { title: { contains: search, mode: 'insensitive' } } }
      ]
    } : {};

    const [reservations, total] = await Promise.all([
      prisma.reservation.findMany({
        where,
        include: {
          user: { select: { fullName: true, email: true } },
          destination: { select: { title: true, location: true, imageUrl: true, price: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.reservation.count({ where })
    ]);

    return { reservations, total, page, totalPages: Math.ceil(total / limit) };
  }
}

export const reservationRepository = new ReservationRepository();
