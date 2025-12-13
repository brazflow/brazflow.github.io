# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

**Language/Version**: TypeScript (>=5.4) with React 19, Vite build tool (existing project uses Vite).  
**Primary Dependencies**: react, react-dom, tailwindcss, react-router-dom (routing), react-query (data fetching/caching), react-leaflet + leaflet (map), react-dropzone (file uploads), shpjs (shapefile parsing), recharts (charting) or react-chartjs-2 (decision in research.md).  
**Storage**: Frontend does not store simulation results long-term; results are provided by backend via URLs/JSON. Local caching limited to in-memory/react-query cache and optional IndexedDB for offline (NEEDS CLARIFICATION).  
**Testing**: Vitest + @testing-library/react is the recommended testing stack for unit and integration tests; end-to-end tests via Playwright/Cypress (NEEDS CLARIFICATION).  
**Target Platform**: Web (modern browsers).  
**Project Type**: Frontend web application integrated with backend job API (single repo - frontend).  
**Performance Goals**: Interactive charts and map rendering should remain responsive (<100ms interaction latency) for typical result sizes; initial load should stay under 1.5s on warm dev server (informal).  
**Constraints**: Must reuse existing Vite + React + Tailwind setup; use established libraries (react-leaflet for mapping, react-router-dom for routing). File uploads/shapefile parsing must work in-browser for reasonably sized archives (<10MB).  
**Scale/Scope**: MVP targets single-user workflows and small batch shapefile uploads (<10MB). Backend handles heavy computation and storage; frontend focuses on presentation and job lifecycle UX.

**Open/NEEDS_CLARIFICATION**:
- Exact backend payload schemas and auth model (if any) — plan will generate API contract stubs; backend team must confirm.
- Decision between Recharts vs Chart.js (research.md contains recommendation).
- E2E test framework (Playwright vs Cypress) — prefer Playwright unless constrained.


## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The plan MUST include explicit evidence of compliance with the constitution gates below; failure to satisfy these gates blocks Phase 0 completion:

- Tests: Feature spec includes required tests (unit, contract, or integration) and at least one failing test demonstrating the acceptance criterion.
- Structure: Proposed project structure follows the repository conventions (src/, tests/{unit,integration,contract}) and documents deviations with justification.
- Observability: Plans that affect runtime behavior include logging/telemetry requirements sufficient for debugging.
- Versioning: Any public contract change must include a proposed semantic versioning decision and migration plan.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Web frontend (existing repo is the frontend project)
src/
├── components/        # small, focused UI components (Button, Map, Chart)
├── pages/             # page-level components (QuickRunPage, UploadPage, ResultsPage)
├── services/          # API wrappers and data-access (jobs, results)
├── hooks/             # reusable React hooks (useJobStatus, useSSE)
├── stores/            # lightweight state (context or Zustand, minimal)
├── styles/            # tailwind config, global css
└── utils/             # helpers, validators, geo utils

public/                # static assets

tests/
├── unit/              # vitest + @testing-library/react
├── integration/       # component integration tests
└── e2e/               # Playwright/Cypress (optional)
```

**Structure Decision**: Use the existing project root as the frontend application. Add the directories above under src/ and tests/. The plan will implement pages/components inside src/pages and src/components and keep API wrappers in src/services. This layout follows the project's constitution (readable, testable modules) and avoids adding a separate frontend/ folder since the repository is already a frontend project.

**Note**: Any deviation from this structure must be justified in Complexity Tracking.


## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
