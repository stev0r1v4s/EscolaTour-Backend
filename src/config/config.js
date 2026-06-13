import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'scolatour_super_secret_jwt_key_2026_change_me_in_production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d'
};
