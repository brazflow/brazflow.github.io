# Research: Streamflow UI decisions

This document records research decisions for the Streamflow UI feature.

## Decision: Core frontend stack
- Decision: Keep existing Vite + React + TypeScript + Tailwind setup.
- Rationale: Project already initialized with these technologies and they are well-suited for fast dev iteration.
- Alternatives considered: Switch to Next.js or CRA; rejected due to migration cost and no server-side needs for MVP.

## Decision: Routing
- Decision: Use react-router-dom for client-side routing.
- Rationale: Widely used, integrates well with React and Vite, minimal overhead.
- Alternatives: Reach Router (deprecated), custom router (rejected).

## Decision: Mapping
- Decision: Use Leaflet with react-leaflet bindings.
- Rationale: Lightweight, excellent browser support, integrates with GeoJSON and many tile providers.
- Alternatives: Mapbox GL (paid tiers / different licensing), OpenLayers (more heavy-weight).

## Decision: Charts
- Decision: Use Recharts for React-first charting (time series) as the initial choice.
- Rationale: Recharts is React-native, easy to compose, and good for line/time-series charts. If more advanced interactions are required, consider Chart.js via react-chartjs-2.
- Alternatives: Chart.js (wider plugin ecosystem), D3 (more complex, lower-level).

## Decision: Data fetching & job lifecycle
- Decision: Use TanStack Query (react-query) for data fetching, caching, and background updates. For real-time job updates, use SSE/EventSource or WebSocket with a small wrapper hook (useSSE/useWebSocket).
- Rationale: React-query simplifies cache, retries, and background refetch. SSE is simple to consume for job updates when server supports it.
- Alternatives: SWR (similar), manual fetch + context (more boilerplate).

## Decision: Shapefile handling
- Decision: Use shpjs (https://github.com/mbostock/shp.js) or similar in-browser parser to extract GeoJSON from zipped shapefile uploads.
- Rationale: Allows users to upload zipped shapefiles and parse client-side for preview and submission without server preprocessing.
- Alternatives: Server-side parsing only (simpler but worse UX); ogr2ogr in-browser (not practical).

## Decision: File uploads
- Decision: Use react-dropzone for file selection and upload UI.
- Rationale: Simple UX and good integration with React.
- Alternatives: Native file input (simpler UI but less UX-friendly).

## Decision: Charting and mapping integration
- Decision: Compose Recharts time-series alongside react-leaflet map for spatial context.
- Rationale: Separates concerns and uses well-supported libraries.

## Decision: Testing
- Decision: Use Vitest + @testing-library/react for unit and component tests; Playwright for E2E if needed.
- Rationale: Vitest integrates with Vite and is fast in dev; Testing Library focuses on user-centric tests.

## Open Questions resolved by user input
- Backend supplies run identifiers and result storage; the frontend will accept backend-provided IDs.
- Frontend will connect to backend using websocket/SSE for job updates.
- Frontend does not manage long-term retention of results.


EOF