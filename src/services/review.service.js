import { reviewRepository } from '../repositories/review.repository.js';

class ReviewService {
  async createReview(userId, destinationId, rating, comment) {
    if (!comment?.trim()) throw new Error('El comentario es obligatorio.');
    if (rating < 1 || rating > 5) throw new Error('La calificación debe ser entre 1 y 5.');
    return reviewRepository.create({ userId, destinationId, rating: parseInt(rating), comment: comment.trim() });
  }

  async getReviews(destinationId, { page, limit } = {}) {
    return reviewRepository.findByDestination(destinationId, { page, limit });
  }
}

export const reviewService = new ReviewService();
