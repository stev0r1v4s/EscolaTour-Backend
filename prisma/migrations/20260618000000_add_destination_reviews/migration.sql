-- CreateTable
CREATE TABLE "DestinationReview" (
    "id"            TEXT         NOT NULL,
    "userId"        TEXT         NOT NULL,
    "destinationId" TEXT         NOT NULL,
    "rating"        INTEGER      NOT NULL,
    "comment"       TEXT         NOT NULL,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DestinationReview_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DestinationReview" ADD CONSTRAINT "DestinationReview_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DestinationReview" ADD CONSTRAINT "DestinationReview_destinationId_fkey"
    FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;
