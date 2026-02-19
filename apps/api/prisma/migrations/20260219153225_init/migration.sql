-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('NOT_MARKED', 'PRESENT', 'ABSENT', 'HALF_DAY', 'LATE', 'ON_LEAVE', 'SICK');

-- CreateEnum
CREATE TYPE "OrgType" AS ENUM ('COMPANY', 'NGO', 'GOVERNMENT', 'COOPERATIVE', 'PERSONAL');

-- CreateEnum
CREATE TYPE "OrgStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "OrgRole" AS ENUM ('OWNER', 'ADMIN', 'MANAGER', 'MEMBER', 'VIEWER');

-- CreateEnum
CREATE TYPE "Industry" AS ENUM ('CONSTRUCTION', 'AGRICULTURE', 'MANUFACTURING', 'LOGISTICS_AND_TRANSPORT', 'EVENTS_AND_HOSPITALITY', 'CLEANING_AND_FACILITIES', 'SECURITY', 'HEALTHCARE', 'RETAIL', 'TECHNOLOGY', 'EDUCATION', 'OTHER');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'BANK_TRANSFER', 'MOBILE_MONEY', 'CHEQUE', 'DIGITAL_WALLET');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('LABOR', 'MATERIALS', 'EQUIPMENT', 'TRANSPORT', 'UTILITIES', 'PERMITS_AND_COMPLIANCE', 'SUBCONTRACTORS', 'CATERING', 'SAFETY', 'MARKETING', 'ADMINISTRATIVE', 'OTHER');

-- CreateEnum
CREATE TYPE "JobCategory" AS ENUM ('SKILLED_TRADESPERSON', 'GENERAL_LABORER', 'MACHINE_OPERATOR', 'DRIVER_OR_COURIER', 'TECHNICIAN', 'TEAM_LEADER', 'SUPERVISOR', 'FOREMAN_OR_FOREWOMAN', 'ENGINEER', 'TECHNOLOGIST', 'SURVEYOR_OR_INSPECTOR', 'SECURITY_GUARD', 'CLEANER_OR_JANITOR', 'CATERING_OR_HOSPITALITY', 'HEALTHCARE_AIDE', 'RETAIL_ASSISTANT', 'ADMINISTRATIVE_STAFF', 'OTHER');

-- CreateEnum
CREATE TYPE "SkillLevel" AS ENUM ('ENTRY', 'JUNIOR', 'INTERMEDIATE', 'SENIOR', 'LEAD', 'SPECIALIST', 'SUPERVISOR');

-- CreateEnum
CREATE TYPE "SystemRole" AS ENUM ('SUPERADMIN', 'SUPPORT', 'USER');

-- CreateEnum
CREATE TYPE "WorkplaceRole" AS ENUM ('WORKPLACE_MANAGER', 'SUPERVISOR', 'WORKER', 'VISITOR');

-- CreateEnum
CREATE TYPE "WagePeriod" AS ENUM ('HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "WorkplaceType" AS ENUM ('PROJECT', 'FACILITY', 'FIELD', 'VENUE', 'ROUTE', 'OTHER');

-- CreateEnum
CREATE TYPE "WorkplaceStatus" AS ENUM ('NOT_STARTED', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'NOT_MARKED',
    "userId" TEXT NOT NULL,
    "workplaceId" TEXT,
    "checkIn" TIMESTAMP(3),
    "checkOut" TIMESTAMP(3),
    "hoursWorked" DOUBLE PRECISION,
    "shiftLabel" TEXT,
    "dailyRate" DOUBLE PRECISION,
    "amountEarned" DOUBLE PRECISION,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "paidAt" TIMESTAMP(3),
    "paymentId" TEXT,
    "notes" TEXT,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Budget" (
    "id" TEXT NOT NULL,
    "planned" DOUBLE PRECISION NOT NULL,
    "consumed" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "labor" DOUBLE PRECISION,
    "materials" DOUBLE PRECISION,
    "equipment" DOUBLE PRECISION,
    "overhead" DOUBLE PRECISION,
    "other" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Org" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "OrgType" NOT NULL DEFAULT 'COMPANY',
    "industry" "Industry" NOT NULL DEFAULT 'OTHER',
    "status" "OrgStatus" NOT NULL DEFAULT 'ACTIVE',
    "description" TEXT,
    "website" TEXT,
    "addressLine" TEXT,
    "city" TEXT,
    "country" TEXT,
    "timezone" TEXT DEFAULT 'UTC',
    "logoUrl" TEXT,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Org_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrgMembership" (
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "OrgRole" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "invitedBy" TEXT,
    "invitedAt" TIMESTAMP(3),
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastSeenAt" TIMESTAMP(3),

    CONSTRAINT "OrgMembership_pkey" PRIMARY KEY ("orgId","userId")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "userId" TEXT NOT NULL,
    "workplaceId" TEXT,
    "orgId" TEXT NOT NULL,
    "notes" TEXT,
    "receiptUrl" TEXT,
    "transactionRef" TEXT,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "category" "ExpenseCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "receiptUrl" TEXT,
    "receiptNo" TEXT,
    "workplaceId" TEXT,
    "orgId" TEXT NOT NULL,
    "recordedBy" TEXT NOT NULL,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkerEarnings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workplaceId" TEXT,
    "orgId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "daysWorked" INTEGER NOT NULL DEFAULT 0,
    "hoursWorked" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalEarned" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalPaid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "lastCalculated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkerEarnings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "occupation" TEXT,
    "occupationCategory" "JobCategory",
    "skillLevel" "SkillLevel" DEFAULT 'ENTRY',
    "systemRole" "SystemRole" NOT NULL DEFAULT 'USER',
    "phoneNumber" TEXT,
    "email" TEXT,
    "profileImage" TEXT,
    "wageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersOnWorkplaces" (
    "userId" TEXT NOT NULL,
    "workplaceId" TEXT NOT NULL,
    "workplaceRole" "WorkplaceRole" NOT NULL DEFAULT 'WORKER',
    "assignedById" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "removedAt" TIMESTAMP(3),

    CONSTRAINT "UsersOnWorkplaces_pkey" PRIMARY KEY ("userId","workplaceId")
);

-- CreateTable
CREATE TABLE "Wage" (
    "id" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "period" "WagePeriod" NOT NULL DEFAULT 'DAILY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workplace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "WorkplaceType" NOT NULL DEFAULT 'PROJECT',
    "location" TEXT,
    "description" TEXT,
    "address" TEXT,
    "coordinates" TEXT,
    "status" "WorkplaceStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "budgetId" TEXT,
    "totalSpent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "laborCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastCalculated" TIMESTAMP(3),
    "orgId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workplace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkplaceImage" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT,
    "workplaceId" TEXT NOT NULL,
    "uploadedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkplaceImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Attendance_userId_date_idx" ON "Attendance"("userId", "date");

-- CreateIndex
CREATE INDEX "Attendance_workplaceId_date_idx" ON "Attendance"("workplaceId", "date");

-- CreateIndex
CREATE INDEX "Attendance_status_idx" ON "Attendance"("status");

-- CreateIndex
CREATE INDEX "Attendance_isPaid_idx" ON "Attendance"("isPaid");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_userId_date_workplaceId_key" ON "Attendance"("userId", "date", "workplaceId");

-- CreateIndex
CREATE INDEX "Budget_currency_idx" ON "Budget"("currency");

-- CreateIndex
CREATE INDEX "Org_status_idx" ON "Org"("status");

-- CreateIndex
CREATE INDEX "Org_type_idx" ON "Org"("type");

-- CreateIndex
CREATE INDEX "Org_industry_idx" ON "Org"("industry");

-- CreateIndex
CREATE INDEX "OrgMembership_userId_role_idx" ON "OrgMembership"("userId", "role");

-- CreateIndex
CREATE INDEX "OrgMembership_orgId_role_idx" ON "OrgMembership"("orgId", "role");

-- CreateIndex
CREATE INDEX "OrgMembership_isActive_idx" ON "OrgMembership"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionRef_key" ON "Payment"("transactionRef");

-- CreateIndex
CREATE INDEX "Payment_userId_paymentDate_idx" ON "Payment"("userId", "paymentDate");

-- CreateIndex
CREATE INDEX "Payment_workplaceId_paymentDate_idx" ON "Payment"("workplaceId", "paymentDate");

-- CreateIndex
CREATE INDEX "Payment_orgId_status_idx" ON "Payment"("orgId", "status");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Expense_workplaceId_date_idx" ON "Expense"("workplaceId", "date");

-- CreateIndex
CREATE INDEX "Expense_orgId_category_idx" ON "Expense"("orgId", "category");

-- CreateIndex
CREATE INDEX "Expense_date_idx" ON "Expense"("date");

-- CreateIndex
CREATE INDEX "WorkerEarnings_userId_year_month_idx" ON "WorkerEarnings"("userId", "year", "month");

-- CreateIndex
CREATE INDEX "WorkerEarnings_workplaceId_year_month_idx" ON "WorkerEarnings"("workplaceId", "year", "month");

-- CreateIndex
CREATE INDEX "WorkerEarnings_orgId_year_month_idx" ON "WorkerEarnings"("orgId", "year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "WorkerEarnings_userId_orgId_workplaceId_month_year_key" ON "WorkerEarnings"("userId", "orgId", "workplaceId", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE INDEX "Users_email_idx" ON "Users"("email");

-- CreateIndex
CREATE INDEX "Users_systemRole_idx" ON "Users"("systemRole");

-- CreateIndex
CREATE INDEX "Users_occupationCategory_idx" ON "Users"("occupationCategory");

-- CreateIndex
CREATE INDEX "UsersOnWorkplaces_userId_isActive_idx" ON "UsersOnWorkplaces"("userId", "isActive");

-- CreateIndex
CREATE INDEX "UsersOnWorkplaces_workplaceId_workplaceRole_idx" ON "UsersOnWorkplaces"("workplaceId", "workplaceRole");

-- CreateIndex
CREATE INDEX "UsersOnWorkplaces_workplaceRole_idx" ON "UsersOnWorkplaces"("workplaceRole");

-- CreateIndex
CREATE INDEX "Wage_currency_idx" ON "Wage"("currency");

-- CreateIndex
CREATE INDEX "Workplace_orgId_status_idx" ON "Workplace"("orgId", "status");

-- CreateIndex
CREATE INDEX "Workplace_status_idx" ON "Workplace"("status");

-- CreateIndex
CREATE INDEX "Workplace_type_idx" ON "Workplace"("type");

-- CreateIndex
CREATE INDEX "WorkplaceImage_workplaceId_idx" ON "WorkplaceImage"("workplaceId");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_workplaceId_fkey" FOREIGN KEY ("workplaceId") REFERENCES "Workplace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgMembership" ADD CONSTRAINT "OrgMembership_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgMembership" ADD CONSTRAINT "OrgMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_workplaceId_fkey" FOREIGN KEY ("workplaceId") REFERENCES "Workplace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_workplaceId_fkey" FOREIGN KEY ("workplaceId") REFERENCES "Workplace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerEarnings" ADD CONSTRAINT "WorkerEarnings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerEarnings" ADD CONSTRAINT "WorkerEarnings_workplaceId_fkey" FOREIGN KEY ("workplaceId") REFERENCES "Workplace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerEarnings" ADD CONSTRAINT "WorkerEarnings_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_wageId_fkey" FOREIGN KEY ("wageId") REFERENCES "Wage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnWorkplaces" ADD CONSTRAINT "UsersOnWorkplaces_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnWorkplaces" ADD CONSTRAINT "UsersOnWorkplaces_workplaceId_fkey" FOREIGN KEY ("workplaceId") REFERENCES "Workplace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnWorkplaces" ADD CONSTRAINT "UsersOnWorkplaces_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workplace" ADD CONSTRAINT "Workplace_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workplace" ADD CONSTRAINT "Workplace_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkplaceImage" ADD CONSTRAINT "WorkplaceImage_workplaceId_fkey" FOREIGN KEY ("workplaceId") REFERENCES "Workplace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
