---

description: "Task list for feature 001-streamflow-ui"
---

# Tasks: Streamflow UI (001-streamflow-ui)

**Input**: specs/001-streamflow-ui/spec.md
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Create directories: src/components, src/pages, src/services, src/hooks, src/styles, src/utils (no code) and add README at specs/001-streamflow-ui/docs/structure.md
- [x] T002 [P] Update package.json dependencies: add react-router-dom, @tanstack/react-query, react-leaflet, leaflet, recharts, react-dropzone, shpjs and run `npm install` (file: package.json)
- [x] T003 Import Leaflet CSS in src/styles/leaflet.css and reference it from src/main.tsx (file: src/styles/leaflet.css, src/main.tsx)
- [x] T004 Create src/services/api.ts implementing typed wrappers: createJob(payload), getJobStatus(runId), getResults(runId), downloadArtifact(url) (file: src/services/api.ts)
- [x] T005 Create src/hooks/useSSE.ts to subscribe to server-sent events or websocket for job updates; export useJobSSE(runId, onEvent) (file: src/hooks/useSSE.ts)
- [x] T006 Create src/hooks/useJobStatus.ts that uses react-query to fetch and cache job status using api.getJobStatus and integrates useSSE for live updates (file: src/hooks/useJobStatus.ts)
- [x] T007 Configure React Query provider and Router in src/main.tsx (wrap <App /> with QueryClientProvider and BrowserRouter) (file: src/main.tsx)

---

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T008 Create routing skeleton in src/App.tsx with routes: / (QuickRun), /upload (Shapefile), /results/:runId (Results) and add navigation (file: src/App.tsx)
- [x] T009 [P] Create shared UI components: src/components/Button.tsx, src/components/Spinner.tsx, src/components/ErrorBanner.tsx (files: src/components/Button.tsx, src/components/Spinner.tsx, src/components/ErrorBanner.tsx)
- [x] T010 [P] Create src/components/MapViewer.tsx using react-leaflet to show a point or GeoJSON preview (file: src/components/MapViewer.tsx)
- [x] T011 Create src/components/TimeSeriesChart.tsx using Recharts to render time-series payloads (file: src/components/TimeSeriesChart.tsx)
- [x] T012 Create typed model definitions in src/utils/types.ts for Run, ResultPackage, PointInput, ShapefileInput (file: src/utils/types.ts)
- [x] T013 Add client-side validators in src/utils/validators.ts for coordinates and file size/type (file: src/utils/validators.ts)

---

## Phase 3: User Story 1 - Quick Run by Point (Priority: P1)

**Goal**: Allow user to submit a single point and view job lifecycle and results.
**Independent Test**: Submit lat/lon, ensure job is created, status updates via SSE, and results page shows time series and downloads.

- [x] T014 [US1] Create page src/pages/QuickRunPage.tsx with a form that uses src/components/PointInput and submits to api.createJob (file: src/pages/QuickRunPage.tsx)
- [ ] T015 [US1] Create component src/components/PointInput.tsx (lat/lon inputs + validation) and add unit tests at tests/unit/PointInput.test.tsx
- [ ] T016 [US1] Implement src/hooks/useSubmitJob.ts to call api.createJob and return runId and initial status (file: src/hooks/useSubmitJob.ts)
- [x] T017 [US1] Implement Results flow: when createJob returns run_id, navigate to /results/{run_id} and show progress via useJobStatus hook (files: src/pages/ResultsPage.tsx, src/hooks/useJobStatus.ts)
- [ ] T018 [US1] Render time series in src/components/TimeSeriesChart.tsx and summary table in src/components/SummaryTable.tsx (files: src/components/TimeSeriesChart.tsx, src/components/SummaryTable.tsx)
- [ ] T019 [US1] Add unit tests for ResultsPage and integration test for QuickRun -> Results using Vitest + Testing Library (files: tests/integration/quickrun-results.test.tsx)

---

## Phase 4: User Story 2 - Run by Shapefile (Priority: P2)

**Goal**: Allow upload of zipped shapefile, preview the polygon(s), submit job, and view aggregated outputs.
**Independent Test**: Upload a small zipped shapefile, verify parser produces GeoJSON preview, submit job, and view aggregated results.

- [ ] T020 [US2] Create page src/pages/UploadPage.tsx with react-dropzone-based UI and progress (file: src/pages/UploadPage.tsx)
- [ ] T021 [US2] Create component src/components/ShapefileUpload.tsx that uses shpjs to parse uploaded zip and produce GeoJSON preview on MapViewer (file: src/components/ShapefileUpload.tsx)
- [ ] T022 [US2] Implement upload flow in src/services/upload.ts (POST file to backend or upload to pre-signed URL) and integrate with api.createJob for shapefile jobs (file: src/services/upload.ts)
- [ ] T023 [US2] Add unit tests for ShapefileUpload parsing and upload with mocked file inputs (files: tests/unit/shapefile-upload.test.tsx)

---

## Phase 5: User Story 3 - Revisit Old Runs (Priority: P3)

**Goal**: Allow users to load previous runs by run ID and display results without re-running.
**Independent Test**: Enter existing run_id or visit /results/{run_id} and verify results are loaded and displayed.

- [ ] T024 [US3] Create component src/components/RunLookup.tsx to accept run ID input and navigate to /results/{runId} (file: src/components/RunLookup.tsx)
- [ ] T025 [US3] Add route handling in src/App.tsx for /results/:runId to fetch results via api.getResults and render ResultsPage (file: src/App.tsx)
- [ ] T026 [US3] Add unit tests for RunLookup and results-by-id fetch logic (files: tests/unit/run-lookup.test.tsx)
- [ ] T027 [US3] [P] Optionally persist last N run IDs in localStorage for quick access (file: src/utils/storage.ts)

---

## Phase N: Polish & Cross-Cutting Concerns

- [ ] T028 Run lint, typecheck, and build locally: `npm run lint`, `npm run build` and fix issues (no specific file)
- [ ] T029 [P] Add E2E tests (Playwright) that exercise QuickRun -> Results and Upload -> Results (files: tests/e2e/quickrun.spec.ts)
- [ ] T030 [P] Accessibility audit and add a11y fixes to forms and map (files: src/components/*)
- [ ] T031 Update specs/001-streamflow-ui/quickstart.md with exact dev backend endpoints and SSE examples (file: specs/001-streamflow-ui/quickstart.md)

---

## Dependencies & Execution Order

- Phase 1 (T001–T007) must complete before Foundational tasks (T008–T013).
- Foundational tasks (T008–T013) must complete before any User Story specific tasks.
- User stories may be developed in parallel after Foundational phase, but US1 (T014–T019) is the recommended MVP to implement first.

## Parallel Opportunities

- Tasks marked with [P] are parallelizable (e.g., T002, T009, T010, T021, T027, T029, T030).
- Unit tests for components can be developed in parallel with component implementation when interfaces are agreed.

## Summary

- Total tasks: 31
- Tasks per story: US1: 6 (T014–T019), US2: 4 (T020–T023), US3: 4 (T024–T027), Setup+Foundational+Polish: 17
- Suggested MVP scope: implement Phase 1 + Phase 2 + User Story 1 (T001–T019)

## Format validation

All tasks follow the checklist format: `- [ ] T### [P?] [US?] Description with file path`.


