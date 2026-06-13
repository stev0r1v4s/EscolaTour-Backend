import { prisma } from '../config/db.js';

class UserRepository {
  async findByUsername(username) {
    return prisma.user.findUnique({
      where: { username }
    });
  }

  async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  async findById(id) {
    return prisma.user.findUnique({
      where: { id }
    });
  }

  async create(userData) {
    return prisma.user.create({
      data: userData
    });
  }

  async update(id, updateData) {
    return prisma.user.update({
      where: { id },
      data: updateData
    });
  }

  async findPaginated({ skip, take, search }) {
    const whereClause = search ? {
      OR: [
        { fullName: { contains: search } },
        { email: { contains: search } },
        { username: { contains: search } }
      ]
    } : {};

    return prisma.user.findMany({
      where: whereClause,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        username: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        lastLogin: true
      }
    });
  }

  async count(search) {
    const whereClause = search ? {
      OR: [
        { fullName: { contains: search } },
        { email: { contains: search } },
        { username: { contains: search } }
      ]
    } : {};

    return prisma.user.count({
      where: whereClause
    });
  }

  async countActiveUsers() {
    return prisma.user.count({
      where: { status: 'Activo' }
    });
  }
}

export const userRepository = new UserRepository();
