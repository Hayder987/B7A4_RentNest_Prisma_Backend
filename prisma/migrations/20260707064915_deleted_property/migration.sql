-- CreateTable
CREATE TABLE "DeletedProperty" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "landlordId" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,

    CONSTRAINT "DeletedProperty_pkey" PRIMARY KEY ("id")
);
