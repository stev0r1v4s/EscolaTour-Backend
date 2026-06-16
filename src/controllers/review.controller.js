import { reviewService } from '../services/review.service.js';

class ReviewController {
  async createReview(req, res) {
    try {
      const userId = req.user.id;
      const destinationId = req.params.id;
      const { rating, comment } = req.body;
      const review = await reviewService.createReview(userId, destinationId, rating, comment);
      return res.status(201).json({ message: 'Reseña publicada exitosamente.', review });
    } catch (error) {
      return res.status(400).json({ message: error.message || 'Error al publicar la reseña.' });
    }
  }

  async getReviews(req, res) {
    try {
      const { id } = req.params;
      const page  = parseInt(req.query.page,  10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const result = await reviewService.getReviews(id, { page, limit });
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener las reseñas.', error: error.message });
    }
  }

  async getTopReviews(req, res) {
    try {
      const limit = parseInt(req.query.limit, 10) || 6;
      const reviews = await reviewService.getTopReviews(limit);
      return res.status(200).json(reviews);
    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener reseñas destacadas.', error: error.message });
    }
  }

  async likeReview(req, res) {
    try {
      const reviewId = req.params.id;
      const userId = req.user.id;
      const updated = await reviewService.likeReview(reviewId, userId);
      return res.status(200).json({ message: 'Like registrado.', review: updated });
    } catch (error) {
      return res.status(400).json({ message: error.message || 'Error al registrar like.' });
    }
  }

  async dislikeReview(req, res) {
    try {
      const reviewId = req.params.id;
      const userId = req.user.id;
      const updated = await reviewService.dislikeReview(reviewId, userId);
      return res.status(200).json({ message: 'Dislike registrado.', review: updated });
    } catch (error) {
      return res.status(400).json({ message: error.message || 'Error al registrar dislike.' });
    }
  }
}

export const reviewController = new ReviewController();
