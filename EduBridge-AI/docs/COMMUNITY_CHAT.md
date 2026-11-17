# EduBridge public community chat – implementation notes

## Included in this integration

- Public email/password registration and sign-in backed by Spring Security and BCrypt.
- Short-lived signed JWT access tokens; authenticated API routes.
- PostgreSQL entities and Flyway migration for users, public servers, channels and persisted messages.
- Server and text-channel creation APIs.
- Message history, send and author-only delete APIs.
- STOMP/WebSocket endpoint at `/ws`; CONNECT requires a valid `Authorization: Bearer <JWT>` native STOMP header.
- Frontend community page calls the backend, uses PostgreSQL-backed messages, and polls history every three seconds as a compatibility fallback.
- A protected LiveKit token endpoint. It issues room-scoped participant grants only when LiveKit server credentials are configured.

## Local setup

1. Copy `deployment/.env.example` to `deployment/.env`; set a unique PostgreSQL password and a random `APP_JWT_SECRET` (at least 32 characters).
2. From `deployment/`, run `docker compose up --build`.
3. In another terminal, from `frontend/`, run `npm install`, then `npm run dev`.
4. Set `VITE_API_BASE_URL=http://localhost:8080/api` in `frontend/.env.local` if the API is not on localhost.
5. Register an account from the login screen. Sign in from a second browser/device to verify that the same PostgreSQL-backed messages are visible.

## API

- `POST /api/auth/register` – `{displayName,email,password,role}`; password minimum 10 characters.
- `POST /api/auth/login` – `{email,password}`.
- `GET /api/auth/me` – current authenticated user.
- `GET /api/chat/servers` – public server directory.
- `POST /api/chat/servers` – create a server.
- `POST /api/chat/servers/{serverId}/channels` – owner creates channel.
- `GET /api/chat/channels/{channelId}/messages` – latest 50 messages.
- `POST /api/chat/channels/{channelId}/messages` – persist and broadcast a message.
- `DELETE /api/chat/messages/{messageId}` – author deletes own message.
- `POST /api/voice/token` – returns LiveKit URL and signed room token if configured.

## Important production gaps before public launch

This is a connected foundation, not a claim of production certification or a proven 5,000-concurrent-user deployment. Before opening registration publicly, implement and test:

- Email verification, password reset, refresh-token rotation, account recovery, abuse throttling and bot protection.
- Server membership/invites, private channels, DMs, role/permission checks, block/report, moderation/audit logs and retention controls.
- Attachments through private object storage with signed URLs, malware scanning and size/type limits.
- Message pagination/cursors, idempotency keys, rate limits, content moderation and message edit/reaction/thread APIs.
- Redis-backed presence and distributed event fan-out. The current STOMP simple broker is single-instance and must be replaced with a clustered broker (e.g. RabbitMQ STOMP relay) or a tested distributed messaging layer before horizontal scaling.
- LiveKit client integration in the browser, TURN configuration, recording policy, room limits and media load tests. The API issues tokens; the frontend does not yet join or render actual audio/video rooms.
- TLS, secure cookie strategy or token storage hardening, secrets manager, backups/PITR, monitoring, alerting, WAF, vulnerability scans and load tests.

## 5,000-user capacity plan

Treat 5,000 as a registered-user target until a load test establishes concurrent-user capacity. Use stateless API replicas behind a load balancer, PostgreSQL with connection pooling and tested indexes, Redis for presence/cache, a clustered broker for WebSocket fan-out, object storage for media, and a separately scaled LiveKit deployment. Define an expected concurrency and messages/second SLO, then run realistic load tests before choosing production instance sizes.
