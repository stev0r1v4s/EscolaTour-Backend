-- AlterTable
ALTER TABLE "User" ADD COLUMN "language"      TEXT    NOT NULL DEFAULT 'es-CO',
                  ADD COLUMN "currency"       TEXT    NOT NULL DEFAULT 'COP',
                  ADD COLUMN "publicProfile"  BOOLEAN NOT NULL DEFAULT true,
                  ADD COLUMN "searchHistory"  BOOLEAN NOT NULL DEFAULT true,
                  ADD COLUMN "theme"          TEXT    NOT NULL DEFAULT 'Claro';
