import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  // Log queries in development mode for easier debugging
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error']
});
