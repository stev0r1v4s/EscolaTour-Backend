-- CreateTable
CREATE TABLE "DestinationReport" (
    "id"            TEXT        NOT NULL,
    "userId"        TEXT        NOT NULL,
    "destinationId" TEXT        NOT NULL,
    "reason"        TEXT        NOT NULL,
    "details"       TEXT,
    "status"        TEXT        NOT NULL DEFAULT 'Pendiente',
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DestinationReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DestinationReport" ADD CONSTRAINT "DestinationReport_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DestinationReport" ADD CONSTRAINT "DestinationReport_destinationId_fkey"
    FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;
