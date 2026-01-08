import { API_BASE } from '../services/api'

export interface DownloadOptions {
  includeGeometry?: boolean
  includeMetrics?: boolean
  includeTimeSeries?: boolean
}

/**
 * Downloads simulation results as a ZIP file containing multiple formats
 * (CSV, GeoJSON, Shapefile) from the backend API.
 * 
 * @param taskId - The task ID to download results for
 * @param options - Download options (all true by default)
 * @throws Error if the download fails
 */
export async function downloadResults(
  taskId: string,
  options: DownloadOptions = {
    includeGeometry: true,
    includeMetrics: true,
    includeTimeSeries: true,
  }
): Promise<void> {
  const params = new URLSearchParams()
  
  if (options.includeGeometry !== undefined) {
    params.append('include_geometry', String(options.includeGeometry))
  }
  if (options.includeMetrics !== undefined) {
    params.append('include_metrics', String(options.includeMetrics))
  }
  if (options.includeTimeSeries !== undefined) {
    params.append('include_timeseries', String(options.includeTimeSeries))
  }

  const url = `${API_BASE}/api/v2/predict/${encodeURIComponent(taskId)}/download?${params.toString()}`

  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`Download failed with status ${response.status}`)
  }

  const blob = await response.blob()
  
  // Generate filename with current date
  const today = new Date()
  const dateStr = today.toISOString().split('T')[0] // YYYY-MM-DD
  const filename = `brazflow_results_${dateStr}.zip`

  // Trigger browser download
  const downloadUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = downloadUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(downloadUrl)
}
