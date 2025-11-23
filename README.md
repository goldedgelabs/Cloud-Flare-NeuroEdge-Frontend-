# NeuroEdge Next.js Migration

This repository is a full Next.js (app router) conversion of the NeuroEdge frontend.

## Run locally

1. Copy `.env.example` to `.env.local` and set:
```
NEXT_PUBLIC_API_BASE_URL=https://api.your-neuroedge.example
NEXT_PUBLIC_WS_BASE_URL=wss://ws.your-neuroedge.example
```

2. Install dependencies:
```
npm install
```

3. Run dev:
```
npm run dev
```

## Notes
- All frontend SSE and WS hooks use `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_WS_BASE_URL`.
- Chat streaming expects SSE at `/v1/chat/stream`.
- Agent streaming available at `/v1/agents/stream?agentId=...`.
- Floating assistant and main chat use separate Zustand stores for isolation.


## CI/CD & Deployment

- A GitHub Actions workflow is included at `.github/workflows/ci.yml` to install and build the app.
- `vercel.json` is provided with environment variable references and a rewrite to the internal proxy route (`/api/proxy`).

## Server-side proxy

- `POST /api/proxy?path=...` will forward POST requests to the configured `NEXT_PUBLIC_API_BASE_URL` on the server side. This avoids exposing internal endpoints to the browser and lets you inject server-side auth.



## SSE Streaming Proxy

Use the server-side streaming proxy to safely proxy server-sent events (SSE) from your backend into the browser:

```
GET /api/stream?path=/v1/chat/stream?conversation_id=...
```

This endpoint:
- Verifies a server-side secret `NE_PROXY_SECRET` submitted by the client via `x-ne-auth` header (optional but recommended).
- Applies simple rate limiting per-IP to protect abuse.
- Pipes the backend SSE to the browser with `Content-Type: text/event-stream`.

## WebSocket Proxy (Standalone)

For WebSocket support in environments that do not allow raw WS on your main host (e.g., some serverless platforms), run the included WS proxy:

```
cd ws-proxy
docker build -t neuroedge-ws-proxy .
docker run -e BACKEND_WS=wss://your-backend -e NE_PROXY_SECRET=your_secret -p 8080:8080 neuroedge-ws-proxy
```

- The WS proxy validates `x-ne-auth` header for upgrade requests.
- It connects to `BACKEND_WS` and forwards messages between clients and backend.


## Redis-backed rate limiting & pub/sub + JWT Auth

### Environment variables
- `REDIS_URL` — connection string for Redis (e.g. redis://:pass@host:6379)
- `JWT_SECRET` — secret used to sign JWT access/refresh tokens
- `NE_PUBLISH_SECRET` — secret used by backend to publish SSE events to `/api/publish`
- `NE_PROXY_SECRET` — optional secret for proxy; legacy support

### Auth flow (implemented)
1. `POST /api/auth/login` — provide `{ username, password }`. Returns `{ access }` and sets `ne_refresh` HttpOnly cookie with refresh token.
2. `POST /api/auth/refresh` — server reads `ne_refresh` cookie and, if valid, issues a new access token.
3. `POST /api/auth/logout` — clears refresh token.

Access tokens should be sent to the server as `Authorization: Bearer <access>` when calling `/api/proxy` or `/api/stream`. Rate limiting will be applied per-user if token present, else per-IP.

### SSE pub/sub
- Backend should publish events to Redis via `POST /api/publish` with `{ conversation_id, payload }` and header `x-ne-auth` matching `NE_PUBLISH_SECRET`.
- Clients subscribe to `GET /api/stream?conversation_id=...` which subscribes to Redis channel `conv:<id>` and streams SSE messages to the browser.

### WS proxy with Redis
- Start `ws-proxy` (docker example provided). Clients can connect, send `{"subscribe":"conv:123"}` to receive messages from that Redis channel.
- WS proxy validates either `x-ne-auth` header matching `NE_PROXY_SECRET` or a JWT bearer token in `Authorization` header.

