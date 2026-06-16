import { prisma } from '../config/db.js';

class ReviewRepository {
  async create({ userId, destinationId, rating, comment }) {
    return prisma.destinationReview.create({
      data: { userId, destinationId, rating, comment },
      include: {
        user: { select: { fullName: true, avatarUrl: true } }
      }
    });
  }

  async findByDestination(destinationId, { page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;
    const [reviews, total] = await Promise.all([
      prisma.destinationReview.findMany({
        where: { destinationId },
        include: { user: { select: { fullName: true, avatarUrl: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.destinationReview.count({ where: { destinationId } })
    ]);
    return { reviews, total, page, totalPages: Math.ceil(total / limit) };
  }
}

export const reviewRepository = new ReviewRepository();
