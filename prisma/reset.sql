------------------------------------------------------------
-- WARNING: This will wipe ALL data in your database
-- Use only when you want a full clean reset
------------------------------------------------------------

------------------------------------------------------------
-- DROP TABLES (in dependency‑safe order)
------------------------------------------------------------
DROP TABLE IF EXISTS "AutomationJob" CASCADE;
DROP TABLE IF EXISTS "AutomationTemplate" CASCADE;
DROP TABLE IF EXISTS "Revenue" CASCADE;
DROP TABLE IF EXISTS "Memory" CASCADE;
DROP TABLE IF EXISTS "Customer" CASCADE;
DROP TABLE IF EXISTS "Lead" CASCADE;
DROP TABLE IF EXISTS "Product" CASCADE;
DROP TABLE IF EXISTS "Setting" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

------------------------------------------------------------
-- DROP ENUMS
------------------------------------------------------------
DROP TYPE IF EXISTS "MemoryType" CASCADE;


------------------------------------------------------------
-- RECREATE ENUMS
------------------------------------------------------------
CREATE TYPE "MemoryType" AS ENUM (
  'PERSONAL',
  'BUSINESS',
  'CUSTOMER',
  'LEAD',
  'VOICE',
  'CHAT'
);


------------------------------------------------------------
-- RECREATE TABLES
------------------------------------------------------------

CREATE TABLE "User" (
  "id" SERIAL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'admin',
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

------------------------------------------------------------
-- INDEXES
------------------------------------------------------------
CREATE INDEX "AutomationJob_templateId_idx" ON "AutomationJob"("templateId");
CREATE INDEX "Lead_email_idx" ON "Lead"("email");
CREATE INDEX "Customer_email_idx" ON "Customer"("email");
CREATE INDEX "Memory_type_idx" ON "Memory"("type");


------------------------------------------------------------
-- ADVANCED SEED DATA (same as your advanced seed)
------------------------------------------------------------

-- Admin Users
INSERT INTO "User" ("email", "password", "role")
VALUES 
  ('jondenham85@gmail.com', 'admin123', 'admin'),
  ('allydenham013@gmail.com', 'admin123', 'admin')
ON CONFLICT ("email") DO NOTHING;

-- Settings
INSERT INTO "Setting" ("siteName", "ownerEmail", "supportEmail")
VALUES ('Madison AI', 'jondenham85@gmail.com', 'support@madisonai.com')
ON CONFLICT DO NOTHING;

-- Products
INSERT INTO "Product" ("name", "price", "active")
VALUES
  ('Madison AI Monthly Subscription', 29.99, TRUE),
  ('Madison AI Annual Subscription', 299.00, TRUE),
  ('Madison Automation Engine', 99.00, TRUE),
  ('Madison Voice Assistant Upgrade', 49.00, TRUE),
  ('Madison Pro Operator Tools', 199.00, TRUE)
ON CONFLICT DO NOTHING;

-- Leads
INSERT INTO "Lead" ("name", "email", "status", "notes")
VALUES
  ('Sarah Thompson', 'sarah@example.com', 'new', 'Interested in automation tools'),
  ('Michael Reyes', 'michael@example.com', 'contacted', 'Requested pricing details'),
  ('Dana Collins', 'dana@example.com', 'qualified', 'Ready for onboarding'),
  ('Test Lead', 'lead@example.com', 'new', 'Initial test lead')
ON CONFLICT DO NOTHING;

-- Customers
INSERT INTO "Customer" ("name", "email", "notes")
VALUES
  ('James Carter', 'james@example.com', 'Upgraded to Madison Pro'),
  ('Emily Watson', 'emily@example.com', 'Uses Madison AI daily'),
  ('Test Customer', 'customer@example.com', 'Imported from seed')
ON CONFLICT DO NOTHING;

-- Memory
INSERT INTO "Memory" ("type", "owner", "content")
VALUES
  ('BUSINESS', 'system', 'Madison AI initialized successfully.'),
  ('CHAT', 'system', 'Welcome message generated for new users.'),
  ('LEAD', 'system', 'Lead pipeline seeded with initial prospects.'),
  ('VOICE', 'system', 'Voice assistant module activated.'),
  ('PERSONAL', 'system', 'Jon prefers black + teal UI themes.')
ON CONFLICT DO NOTHING;

-- Automation Templates
INSERT INTO "AutomationTemplate" ("name", "description", "type", "schedule")
VALUES
  ('Daily Revenue Summary', 'Sends Jon a daily revenue report.', 'report', '0 8 * * *'),
  ('Lead Follow-Up', 'Automatically emails leads after 24 hours.', 'email', '0 * * * *'),
  ('Customer Engagement', 'Sends weekly engagement messages.', 'message', '0 9 * * MON'),
  ('System Health Check', 'Runs diagnostics every hour.', 'system', '0 * * * *')
ON CONFLICT DO NOTHING;

-- Automation Jobs
INSERT INTO "AutomationJob" ("templateId", "status", "inputJson", "resultJson")
SELECT id, 'pending', '{"range":"24h"}', NULL
FROM "AutomationTemplate"
WHERE name = 'Daily Revenue Summary'
ON CONFLICT DO NOTHING;

INSERT INTO "AutomationJob" ("templateId", "status", "inputJson", "resultJson")
SELECT id, 'pending', '{"action":"email"}', NULL
FROM "AutomationTemplate"
WHERE name = 'Lead Follow-Up'
ON CONFLICT DO NOTHING;

INSERT INTO "AutomationJob" ("templateId", "status", "inputJson", "resultJson")
SELECT id, 'pending', '{"segment":"active"}', NULL
FROM "AutomationTemplate"
WHERE name = 'Customer Engagement'
ON CONFLICT DO NOTHING;

INSERT INTO "AutomationJob" ("templateId", "status", "inputJson", "resultJson")
SELECT id, 'pending', '{"check":"system"}', NULL
FROM "AutomationTemplate"
WHERE name = 'System Health Check'
ON CONFLICT DO NOTHING;

-- Revenue
INSERT INTO "Revenue" ("amount", "source", "note")
VALUES
  (100.00, 'Initialization', 'First test revenue entry'),
  (29.99, 'Subscription', 'Monthly Madison AI subscription'),
  (299.00, 'Subscription', 'Annual Madison AI subscription'),
  (99.00, 'Automation Engine', 'Automation engine purchase'),
  (49.00, 'Voice Upgrade', 'Voice assistant upgrade')
ON CONFLICT DO NOTHING;
