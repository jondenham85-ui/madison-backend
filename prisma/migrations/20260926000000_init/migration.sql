-- ENUMS
CREATE TYPE "MemoryType" AS ENUM (
  'PERSONAL',
  'BUSINESS',
  'CUSTOMER',
  'LEAD',
  'VOICE',
  'CHAT'
);

CREATE TYPE "Role" AS ENUM (
  'admin',
  'developer',
  'operator',
  'user'
);

-- TABLES
CREATE TABLE "User" (
  "id" SERIAL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'user',
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "Product" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "Setting" (
  "id" SERIAL PRIMARY KEY,
  "siteName" TEXT NOT NULL,
  "ownerEmail" TEXT NOT NULL,
  "supportEmail" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "AutomationTemplate" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "schedule" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "AutomationJob" (
  "id" SERIAL PRIMARY KEY,
  "templateId" INTEGER NOT NULL,
  "status" TEXT NOT NULL,
  "inputJson" TEXT NOT NULL,
  "resultJson" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "startedAt" TIMESTAMP,
  "finishedAt" TIMESTAMP,
  CONSTRAINT "AutomationJob_templateId_fkey"
    FOREIGN KEY ("templateId")
    REFERENCES "AutomationTemplate"("id")
    ON DELETE CASCADE
);

CREATE TABLE "Lead" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'new',
  "notes" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "Customer" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "Revenue" (
  "id" SERIAL PRIMARY KEY,
  "amount" DOUBLE PRECISION NOT NULL,
  "source" TEXT NOT NULL,
  "note" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "Memory" (
  "id" SERIAL PRIMARY KEY,
  "type" "MemoryType" NOT NULL,
  "owner" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- INDEXES
CREATE INDEX "AutomationJob_templateId_idx" ON "AutomationJob"("templateId");
CREATE INDEX "Lead_email_idx" ON "Lead"("email");
CREATE INDEX "Customer_email_idx" ON "Customer"("email");
CREATE INDEX "Memory_type_idx" ON "Memory"("type");
