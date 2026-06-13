import { prisma } from '../config/db.js';

class DestinationRepository {
  async findById(id) {
    return prisma.destination.findUnique({
      where: { id }
    });
  }

  async create(destinationData) {
    return prisma.destination.create({
      data: destinationData
    });
  }

  async update(id, destinationData) {
    return prisma.destination.update({
      where: { id },
      data: destinationData
    });
  }

  async delete(id) {
    return prisma.destination.delete({
      where: { id }
    });
  }

  async findAll(filters = {}) {
    const { category, search, priceMax } = filters;
    
    const whereClause = {};

    if (category && category !== 'Todos' && category !== 'all') {
      whereClause.category = category;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (priceMax !== undefined) {
      whereClause.price = { lte: parseFloat(priceMax) };
    }

    return prisma.destination.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });
  }

  async countTotal() {
    return prisma.destination.count();
  }
}

export const destinationRepository = new DestinationRepository();
