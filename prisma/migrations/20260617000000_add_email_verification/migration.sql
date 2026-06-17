-- Add email verification fields to User table
ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "emailVerified"           BOOLEAN   NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "verificationToken"       TEXT,
  ADD COLUMN IF NOT EXISTS "verificationTokenExpiry" TIMESTAMP(3);

-- Change status default from 'Activo' to 'Pendiente' for new registrations
ALTER TABLE "User" ALTER COLUMN "status" SET DEFAULT 'Pendiente';
