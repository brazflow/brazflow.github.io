import { useParams } from 'react-router-dom'
import { useJobStatus } from '../hooks/useJobStatus'
import TimeSeriesChart from '../components/TimeSeriesChart'
import MapViewer from '../components/MapViewer'
import { useI18n } from '../i18n'

export default function ResultsPage() {
  const { taskId } = useParams<{ taskId: string }>()
  const { t } = useI18n()
  const statusQ = useJobStatus(taskId || null)

  const data = statusQ.data?.result
  const geojson = data?.catchment
  const marker: [number, number] | null = data?.snapped ? [data.snapped.lat, data.snapped.lng] : null
  const metrics = data?.metrics

  const timeSeriesData = data ? data.time_index.map((ts, i) => ({ timestamp: ts, runoff: data.runoff_simulation[i], precipitation: data.precipitation[i] })) : []

  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <div style={{ flex: 2 }}>
        {taskId && <h2>{t('results')}: {taskId}</h2>}
        <div>{t('status')}: {statusQ.isLoading ? 'loading...' : statusQ.data?.status}</div>
        {statusQ.data?.status === 'running' && <div>Job is running, results will appear when complete.</div>}
        {statusQ.data?.status === 'failed' && <div>Job failed: {statusQ.data.error}</div>}
        
        {statusQ.isLoading && <div>Loading status...</div>}
        {statusQ.isError && <div>Error loading status.</div>}

        {data ? (
          <>
            {geojson && (
              <div style={{ marginBottom: 12 }}>
                <MapViewer geojson={geojson} marker={marker} height={300} />
              </div>
            )}

            {metrics && (
              <div style={{ marginBottom: 12 }}>
                <h3>{t('hydro_signatures_subheader') || 'Hydrological Signatures'}</h3>
                <div style={{ display: 'flex', gap: 12 }}>
                  {Object.entries(metrics).map(([name, value]: any) => (
                    <div key={name} style={{ flex: 1, background: '#0F3460', padding: 12, borderRadius: 8 }}>
                      <div style={{ fontSize: 12, color: '#bbb' }}>{name.replace(/_/g, ' ').toUpperCase()}</div>
                      <div style={{ fontSize: 20, fontWeight: 700 }}>{typeof value === 'number' ? value.toFixed(2) : String(value)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <TimeSeriesChart data={timeSeriesData} />
          </>
        ) : (
          !statusQ.isLoading && statusQ.data?.status !== 'running' && <div>No results available.</div>
        )}
      </div>
      <aside style={{ width: 360 }}>
        <h3>{t('logs')}</h3>
        <pre style={{ height: 400, overflow: 'auto', background: '#111', color: '#eee', padding: 8, whiteSpace: 'pre-wrap' }}>
          {statusQ.data ? JSON.stringify(statusQ.data, null, 2) : 'Polling for status...'}
        </pre>
      </aside>
    </div>
  )
}