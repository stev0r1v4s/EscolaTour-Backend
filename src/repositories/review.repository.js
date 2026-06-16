import { prisma } from '../config/db.js';

const REVIEW_INCLUDE = {
  user: { select: { fullName: true, avatarUrl: true } },
  destination: { select: { title: true, category: true } }
};

class ReviewRepository {
  async create({ userId, destinationId, rating, comment }) {
    return prisma.destinationReview.create({
      data: { userId, destinationId, rating, comment },
      include: REVIEW_INCLUDE
    });
  }

  async findByDestination(destinationId, { page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;
    const [reviews, total] = await Promise.all([
      prisma.destinationReview.findMany({
        where: { destinationId },
        include: REVIEW_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.destinationReview.count({ where: { destinationId } })
    ]);
    return { reviews, total, page, totalPages: Math.ceil(total / limit) };
  }

  async findTopLiked(limit = 6) {
    return prisma.destinationReview.findMany({
      orderBy: { likes: 'desc' },
      take: limit,
      include: REVIEW_INCLUDE
    });
  }

  async incrementLikes(id) {
    return prisma.destinationReview.update({
      where: { id },
      data: { likes: { increment: 1 } },
      include: REVIEW_INCLUDE
    });
  }

  async incrementDislikes(id) {
    return prisma.destinationReview.update({
      where: { id },
      data: { dislikes: { increment: 1 } },
      include: REVIEW_INCLUDE
    });
  }
}

export const reviewRepository = new ReviewRepository();
