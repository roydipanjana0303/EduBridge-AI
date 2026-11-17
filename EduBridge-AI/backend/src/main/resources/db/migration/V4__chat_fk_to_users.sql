-- Chat tables (V3) referenced app_users, but accounts are stored in users (V1).
-- Re-point the foreign keys so chat servers/messages can be created by real users.
ALTER TABLE chat_servers  DROP CONSTRAINT IF EXISTS chat_servers_owner_id_fkey;
ALTER TABLE chat_servers  ADD  CONSTRAINT chat_servers_owner_id_fkey  FOREIGN KEY (owner_id)  REFERENCES users(id);
ALTER TABLE chat_messages DROP CONSTRAINT IF EXISTS chat_messages_sender_id_fkey;
ALTER TABLE chat_messages ADD  CONSTRAINT chat_messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES users(id);
