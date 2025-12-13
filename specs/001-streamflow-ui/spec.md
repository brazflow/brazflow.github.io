# Feature Specification: Streamflow UI

**Feature Branch**: `001-streamflow-ui`  
**Created**: 2025-12-13  
**Status**: Draft  
**Input**: User description: "build an app that can easilier simulate streamflow given just a point, or shapefile. The calculation are made in a backend and we need just to present the data. A example page is @app_v2.py. Allow user to acess old runs using an identification."

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

- Backend performs all computations and exposes endpoints for job creation, status polling, and result retrieval; the frontend will use the run identifiers supplied by the backend and will not persist result data locally.
- Result payloads include URLs or inline JSON for downloadable artifacts and time series data suitable for charting.
- The frontend will connect to the backend using websocket or Server-Sent Events (SSE) to receive job status updates for long-running jobs.
- No user authentication required for the MVP; access control is handled server-side.

### Key Entities *(include if feature involves data)*

- **Run**: Represents a single simulation execution. Attributes: run_id, created_at, status, input_type (point|shapefile), parameters, result_urls.
- **PointInput**: latitude, longitude, label
- **ShapefileInput**: filename, size, checksum, feature_count
- **ResultPackage**: time_series (array), summary_stats, download_url

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
- Integration with backend job API endpoints for create/poll/fetch results (frontend uses abstraction; no endpoint paths are required here).
- Spec quality checklist at specs/001-streamflow-ui/checklists/requirements.md

## Assumptions

- Backend supplies run identifiers and maintains result storage; the frontend relies on backend-provided IDs and result URLs.
- Result payloads include URLs or JSON suitable for chart rendering.
- Frontend uses websocket/SSE for job updates; polling is acceptable only when websocket/SSE is unavailable.

## Resolved Questions

- **Q1 (Run Identifier Type)**: Run identifiers are provided by the backend; the frontend will display and accept whatever identifier format the backend issues (opaque UUIDs or human-friendly codes).
- **Q2 (Result Retention Policy)**: Frontend does not manage result retention or storage; availability of results is the backend's responsibility and surfaced via run ID lookups.
- **Q3 (Notification Preference)**: Frontend will connect to the backend using websocket or SSE to receive job status updates for long-running jobs.

