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
      include: {
        destination: true
      },
      orderBy: { startDate: 'desc' }
    });
  }

  async findAll() {
    return prisma.reservation.findMany({
      include: {
        user: {
          select: {
            fullName: true,
            email: true
          }
        },
        destination: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}

export const reservationRepository = new ReservationRepository();
