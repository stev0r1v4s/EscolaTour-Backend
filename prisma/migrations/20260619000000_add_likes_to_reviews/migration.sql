-- AlterTable: add likes and dislikes counters to DestinationReview
ALTER TABLE "DestinationReview"
  ADD COLUMN "likes"    INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "dislikes" INTEGER NOT NULL DEFAULT 0;
