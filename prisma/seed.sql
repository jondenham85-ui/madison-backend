------------------------------------------------------------
-- ADMIN USER
------------------------------------------------------------
INSERT INTO "User" ("email", "password", "role")
VALUES 
  ('jondenham85@gmail.com', 'admin123', 'admin'),
  ('allydenham013@gmail.com', 'admin123', 'admin')
ON CONFLICT ("email") DO NOTHING;


------------------------------------------------------------
-- SETTINGS
------------------------------------------------------------
INSERT INTO "Setting" ("siteName", "ownerEmail", "supportEmail")
VALUES 
  ('Madison AI', 'jondenham85@gmail.com', 'support@madisonai.com')
ON CONFLICT DO NOTHING;


------------------------------------------------------------
-- PRODUCTS (ShopMAD)
------------------------------------------------------------
INSERT INTO "Product" ("name", "price", "active")
VALUES
  ('Madison AI Monthly Subscription', 29.99, TRUE),
  ('Madison AI Annual Subscription', 299.00, TRUE),
  ('Madison Automation Engine', 99.00, TRUE),
  ('Madison Voice Assistant Upgrade', 49.00, TRUE),
  ('Madison Pro Operator Tools', 199.00, TRUE)
ON CONFLICT DO NOTHING;


------------------------------------------------------------
-- LEADS
------------------------------------------------------------
INSERT INTO "Lead" ("name", "email", "status", "notes")
VALUES
  ('Sarah Thompson', 'sarah@example.com', 'new', 'Interested in automation tools'),
  ('Michael Reyes', 'michael@example.com', 'contacted', 'Requested pricing details'),
  ('Dana Collins', 'dana@example.com', 'qualified', 'Ready for onboarding'),
  ('Test Lead', 'lead@example.com', 'new', 'Initial test lead')
ON CONFLICT DO NOTHING;


------------------------------------------------------------
-- CUSTOMERS
------------------------------------------------------------
INSERT INTO "Customer" ("name", "email", "notes")
VALUES
  ('James Carter', 'james@example.com', 'Upgraded to Madison Pro'),
  ('Emily Watson', 'emily@example.com', 'Uses Madison AI daily'),
  ('Test Customer', 'customer@example.com', 'Imported from seed')
ON CONFLICT DO NOTHING;


------------------------------------------------------------
-- MEMORY (System + Business + Chat)
------------------------------------------------------------
INSERT INTO "Memory" ("type", "owner", "content")
VALUES
  ('BUSINESS', 'system', 'Madison AI initialized successfully.'),
  ('CHAT', 'system', 'Welcome message generated for new users.'),
  ('LEAD', 'system', 'Lead pipeline seeded with initial prospects.'),
  ('VOICE', 'system', 'Voice assistant module activated.'),
  ('PERSONAL', 'system', 'Jon prefers black + teal UI themes.')
ON CONFLICT DO NOTHING;


------------------------------------------------------------
-- AUTOMATION TEMPLATES
------------------------------------------------------------
INSERT INTO "AutomationTemplate" ("name", "description", "type", "schedule")
VALUES
  ('Daily Revenue Summary', 'Sends Jon a daily revenue report.', 'report', '0 8 * * *'),
  ('Lead Follow-Up', 'Automatically emails leads after 24 hours.', 'email', '0 * * * *'),
  ('Customer Engagement', 'Sends weekly engagement messages.', 'message', '0 9 * * MON'),
  ('System Health Check', 'Runs diagnostics every hour.', 'system', '0 * * * *')
ON CONFLICT DO NOTHING;


------------------------------------------------------------
-- AUTOMATION JOBS (linked to templates)
------------------------------------------------------------
-- Daily Revenue Summary job
INSERT INTO "AutomationJob" ("templateId", "status", "inputJson", "resultJson")
SELECT id, 'pending', '{"range":"24h"}', NULL
FROM "AutomationTemplate"
WHERE name = 'Daily Revenue Summary'
ON CONFLICT DO NOTHING;

-- Lead Follow-Up job
INSERT INTO "AutomationJob" ("templateId", "status", "inputJson", "resultJson")
SELECT id, 'pending', '{"action":"email"}', NULL
FROM "AutomationTemplate"
WHERE name = 'Lead Follow-Up'
ON CONFLICT DO NOTHING;

-- Customer Engagement job
INSERT INTO "AutomationJob" ("templateId", "status", "inputJson", "resultJson")
SELECT id, 'pending', '{"segment":"active"}', NULL
FROM "AutomationTemplate"
WHERE name = 'Customer Engagement'
ON CONFLICT DO NOTHING;

-- System Health Check job
INSERT INTO "AutomationJob" ("templateId", "status", "inputJson", "resultJson")
SELECT id, 'pending', '{"check":"system"}', NULL
FROM "AutomationTemplate"
WHERE name = 'System Health Check'
ON CONFLICT DO NOTHING;


------------------------------------------------------------
-- REVENUE (Sample entries)
------------------------------------------------------------
INSERT INTO "Revenue" ("amount", "source", "note")
VALUES
  (100.00, 'Initialization', 'First test revenue entry'),
  (29.99, 'Subscription', 'Monthly Madison AI subscription'),
  (299.00, 'Subscription', 'Annual Madison AI subscription'),
  (99.00, 'Automation Engine', 'Automation engine purchase'),
  (49.00, 'Voice Upgrade', 'Voice assistant upgrade')
ON CONFLICT DO NOTHING;
