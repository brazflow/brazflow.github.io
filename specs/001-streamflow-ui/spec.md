# Feature Specification: Streamflow UI

**Feature Branch**: `001-streamflow-ui`  
**Created**: 2025-12-13  
**Status**: Draft  
**Input**: User description: "build an app that can easilier simulate streamflow given just a point, or shapefile. The calculation are made in a backend and we need just to present the data. A example page is @app_v2.py. Allow user to acess old runs using a identification."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Quick Run by Point (Priority: P1)

A hydrologist or analyst wants to run a streamflow simulation for a single geographic point and immediately view results in the UI.

**Why this priority**: This is the core MVP: minimal input (one point) and immediate visualization of backend results.

**Independent Test**: Provide a sample point in the UI, submit the request, and verify the results page shows the expected time series and summary statistics returned by the backend.

**Acceptance Scenarios**:

1. **Given** a valid coordinate, **When** the user submits the point, **Then** the UI displays a progress indicator, and when complete shows the time series chart, summary table, and download link for results.
2. **Given** a backend error, **When** the simulation fails, **Then** the UI shows an informative error message and a retry option.

---

### User Story 2 - Run by Shapefile (Priority: P2)

A user wants to upload a river catchment polygon (shapefile) and run the simulation for that area; results may include aggregated metrics and per-point outputs.

**Why this priority**: Enables batch runs and more realistic workflows for spatial analysis.

**Independent Test**: Upload a small shapefile, submit, and verify backend job is queued and results are presented for the area (aggregate stats + downloadable per-location outputs).

**Acceptance Scenarios**:

1. **Given** a valid shapefile upload, **When** the user submits the job, **Then** the UI accepts the file, shows upload progress, confirms job creation, and eventually displays aggregated results and per-location outputs.

---

### User Story 3 - Revisit Old Runs (Priority: P3)

A user wants to access previously-run simulations using an identifier (ID) to view or re-download results without re-running the backend calculation.

**Why this priority**: Improves usability and reproducibility by surfacing past work.

**Independent Test**: Enter or select an existing run ID and verify the UI loads the stored results and metadata from the backend.

**Acceptance Scenarios**:

1. **Given** a valid run ID, **When** a user requests it, **Then** the UI loads the run details, shows run metadata (date, parameters), and provides the same charts and downloads as a fresh run.

---

### Edge Cases

- Upload of malformed shapefile archive: UI must surface a clear error and guidance for correction.
- Large shapefiles or many polygons: UI should inform users of long processing times and provide job tracking/notifications.
- Missing or invalid coordinates: validation must prevent job submission and give actionable feedback.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow a user to submit a simulation for a single geographic point (lat/lon) and receive results presented in the UI.
- **FR-002**: System MUST allow a user to upload a shapefile (as a zipped archive) to run simulations for an area and present aggregated and per-location outputs.
- **FR-003**: System MUST provide a results page that includes: interactive time series chart(s), a summary statistics table, and a downloadable results package (CSV/ZIP).
- **FR-004**: System MUST accept a run identifier and load stored results (metadata, charts, downloads) without re-running the simulation.
- **FR-005**: System MUST show job status (queued, running, failed, complete) and allow users to retry or cancel when appropriate.
- **FR-006**: System MUST validate inputs client-side (coordinate format, file type/size) and display clear error messages.
- **FR-007**: System MUST log user-visible run metadata (timestamp, parameters, run ID) as provided by the backend for display and discovery.

*Assumptions*:

- Backend performs all computations and exposes REST endpoints to create jobs, poll status, and fetch results by run ID.
- Result payloads include URLs to downloadable artifacts and data suitable for charting (JSON time series).
- No user authentication required for initial MVP; access control handled server-side.

### Key Entities *(include if feature involves data)*

- **Run**: Represents a single simulation execution. Attributes: run_id, created_at, status, input_type (point|shapefile), parameters, result_urls.
- **PointInput**: latitude, longitude, label
- **ShapefileInput**: filename, size, checksum, feature_count
- **ResultPackage**: time_series_url, summary_stats, download_url

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can submit a point-based simulation and see results within 2 minutes for the sample dataset used in acceptance testing.
- **SC-002**: Users can upload a <10MB zipped shapefile and receive aggregated results within 10 minutes under normal backend load.
- **SC-003**: 95% of valid point submissions return a successful result page (not error) in acceptance tests.
- **SC-004**: Users can retrieve previously run simulations by run ID and access results and metadata without re-running in 100% of tested cases.
- **SC-005**: Error cases show user-facing messages that guide remediation in 90% of tested malformed input scenarios.

## Deliverables

- UI pages/components: Quick run (point input), Shapefile upload & job submission, Results/Run details page with charts and downloads, Run lookup by ID.
- Client-side validation and user feedback flows (progress, errors, retries).
- Integration with backend job API endpoints for create/poll/fetch results.
- Spec quality checklist at specs/001-streamflow-ui/checklists/requirements.md

## Assumptions

- Backend API endpoints exist for: POST /jobs (create), GET /jobs/{id}/status, GET /results/{id}
- Result payloads include URLs to downloadable artifacts and data suitable for charting (JSON time series).
- No user authentication required for initial MVP; access control handled server-side.

## Open Questions / NEEDS CLARIFICATION (max 3)

- **Q1: Run Identifier Type**: Should run identifiers be human-friendly short codes (e.g., "RUN-2025-0001") or opaque UUIDs?  
  - Option A: Human-friendly short codes — easier for users to read and share; requires server support for short code generation.  
  - Option B: Opaque UUIDs — simpler to implement and globally unique; less friendly for manual entry.  

- **Q2: Result Retention Policy**: How long should backend keep results accessible via run ID?  
  - Option A: 30 days (reasonable default) — balances storage and reproducibility.  
  - Option B: 1 year — favors reproducibility at higher storage cost.  
  - Option C: Indefinite — requires explicit storage plan and higher cost.

- **Q3: Notification Preference**: Should the UI provide asynchronous notifications (email/websocket) when long jobs complete, or rely solely on UI polling?  
  - Option A: UI polling only (MVP) — simpler to implement.  
  - Option B: Push notifications via websocket or server-sent events — better UX for long jobs but increases complexity.  

