-- Seed: Admin User
INSERT INTO "User" ("email", "password", "role")
VALUES ('jondenham85@gmail.com', 'admin123', 'admin')
ON CONFLICT ("email") DO NOTHING;

-- Seed: Default Settings
INSERT INTO "Setting" ("siteName", "ownerEmail", "supportEmail")
VALUES ('Madison AI', 'jondenham85@gmail.com', 'support@madisonai.com')
ON CONFLICT DO NOTHING;

-- Seed: Sample Product
INSERT INTO "Product" ("name", "price", "active")
VALUES ('Madison AI Subscription', 29.99, TRUE)
ON CONFLICT DO NOTHING;

-- Seed: Sample Lead
INSERT INTO "Lead" ("name", "email", "status", "notes")
VALUES ('Test Lead', 'lead@example.com', 'new', 'Initial test lead')
ON CONFLICT DO NOTHING;

-- Seed: Sample Customer
INSERT INTO "Customer" ("name", "email", "notes")
VALUES ('Test Customer', 'customer@example.com', 'Imported from seed')
ON CONFLICT DO NOTHING;

-- Seed: Sample Memory
INSERT INTO "Memory" ("type", "owner", "content")
VALUES ('BUSINESS', 'system', 'Madison AI initialized successfully.')
ON CONFLICT DO NOTHING;

-- Seed: Sample Revenue
INSERT INTO "Revenue" ("amount", "source", "note")
VALUES (100.00, 'Initialization', 'First test revenue entry')
ON CONFLICT DO NOTHING;
