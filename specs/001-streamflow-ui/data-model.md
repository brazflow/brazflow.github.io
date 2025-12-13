# Data Model

This file defines entities, fields, validation rules, and state transitions for the Streamflow UI.

## Entities

### Run
- Description: A simulation execution recorded by the backend and referenced by a run_id.
- Fields:
  - run_id: string (provided by backend)
  - created_at: string (ISO 8601 timestamp)
  - status: enum [queued, running, failed, complete, cancelled]
  - input_type: enum [point, shapefile]
  - parameters: object (free-form metadata, e.g., model options)
  - result_urls: object (time_series_url, download_url) | optional
  - summary: object (summary statistics) | optional
- Validation:
  - run_id: required, non-empty
  - status: must be one of allowed enum

### PointInput
- Fields:
  - latitude: number (required, -90..90)
  - longitude: number (required, -180..180)
  - label: string (optional)
- Validation: numeric ranges enforced client-side

### ShapefileInput
- Fields:
  - filename: string
  - size: integer (bytes)
  - checksum: string (optional)
  - feature_count: integer (optional)
- Validation: Accept zipped shapefile (.zip) MIME types; size limits enforced client-side (e.g., 10MB)

### ResultPackage
- Fields:
  - time_series: array of { timestamp: string, value: number }
  - summary_stats: object { mean, median, p90, max, min }
  - download_url: string
- Validation: time_series sorted by timestamp; timestamps must be ISO 8601

## State transitions (Run.status)
- queued -> running -> complete
- queued -> running -> failed
- running -> cancelled
- queued -> cancelled

Transitions are driven by backend; frontend displays them and supports retry/cancel via API calls if backend exposes such actions.

EOF