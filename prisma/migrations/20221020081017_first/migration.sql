-- CreateTable
CREATE TABLE "User" (
    "phoneNumber" INTEGER NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "GeneratedOTP" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "otp" INTEGER NOT NULL,
    "dateCreated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userPhoneNumber" INTEGER NOT NULL,
    CONSTRAINT "GeneratedOTP_userPhoneNumber_fkey" FOREIGN KEY ("userPhoneNumber") REFERENCES "User" ("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "GeneratedOTP_userPhoneNumber_key" ON "GeneratedOTP"("userPhoneNumber");
