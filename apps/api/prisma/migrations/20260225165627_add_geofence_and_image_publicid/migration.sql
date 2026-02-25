-- AlterTable
ALTER TABLE "WorkplaceImage" ADD COLUMN     "publicId" TEXT;

-- CreateTable
CREATE TABLE "WorkplaceGeofence" (
    "id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "radius" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "setBy" TEXT,
    "workplaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkplaceGeofence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkplaceGeofence_workplaceId_key" ON "WorkplaceGeofence"("workplaceId");

-- AddForeignKey
ALTER TABLE "WorkplaceGeofence" ADD CONSTRAINT "WorkplaceGeofence_workplaceId_fkey" FOREIGN KEY ("workplaceId") REFERENCES "Workplace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
