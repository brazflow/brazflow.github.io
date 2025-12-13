# Quickstart: Streamflow UI (development)

Prerequisites:
- Node.js 18+ (LTS)
- Yarn or npm

1. Install dependencies

```bash
npm install
# or yarn
```

2. Configure backend base URL

Create a .env file at project root with:

VITE_API_BASE=https://api.example.com

(For local development, point to your backend dev server: http://localhost:8000)

3. Start dev server

```bash
npm run dev
```

4. Notes

- The frontend expects the backend to provide run IDs and result URLs. The frontend will connect to backend SSE/WebSocket endpoints for job updates; ensure CORS and SSE endpoints are enabled on the backend.
- Leaflet requires its CSS to be included; Vite + Tailwind setup should include leaflet.css import in the main entry (src/main.tsx).
- To test job updates locally, run a dev backend that supports POST /api/jobs and SSE at /api/jobs/{run_id}/events or equivalent.
