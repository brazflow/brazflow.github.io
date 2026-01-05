import { useParams } from 'react-router-dom';
import FlowDurationCurve from '../components/FlowDurationCurve';
import MapViewer from '../components/MapViewer';
import TimeSeriesChart from '../components/TimeSeriesChart';
import { useJobStatus } from '../hooks/useJobStatus';
import { useI18n } from '../i18n';
import { useState } from 'react';


export default function ResultsPage() {
  const { taskId } = useParams<{ taskId: string }>()
  const { t } = useI18n()
  const statusQ = useJobStatus(taskId || null)
  const [isLogVisible, setIsLogVisible] = useState(false)

  const data = statusQ.data?.result
  const geojson = data?.catchment
  const marker: [number, number] | null = data?.snapped ? [data.snapped.lat, data.snapped.lng] : null
  const metrics = data?.metrics

  const timeSeriesData = data ? data.time_index.map((ts, i) => ({ timestamp: ts, runoff: data.runoff_simulation[i], precipitation: data.precipitation[i] })) : []
  const runoffData = data ? data.runoff_simulation : []

  const handleDownload = () => {
    if (!data) return;
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'brazflow_results.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const signatureUnits: { [key: string]: string } = {
    mean_q: 'm³/s',
    q1: 'm³/s',
    q95: 'm³/s',
    q90: 'm³/s',
    q99: 'm³/s',
    q710: 'm³/s',
  };

  return (
    <div>
      {/* Header and Download Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h1 style={{ margin: 0, fontSize: '2.5em' }}>{t('simulation_results')}</h1> {/* Increased header size */}
        {data && (
          <button onClick={handleDownload} className="sidebar-button" style={{ width: 'auto' }}>
            {t('download_results')}
          </button>
        )}
      </div>

      {/* Log Viewer at the top */}
      <div className="card" style={{ marginBottom: 24, padding: '10px 20px' }}> {/* Subtle box style */}
        <button onClick={() => setIsLogVisible(!isLogVisible)} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: 0, fontWeight: 'bold' }}>
          {isLogVisible ? t('hide_log_details') : t('show_log_details')}
        </button>
        {isLogVisible && (
          <>
            <h3 style={{ marginTop: 12, marginBottom: 8 }}>{t('logs')}</h3>
            <pre style={{ height: 300, overflow: 'auto', background: '#111', color: '#eee', padding: 8, whiteSpace: 'pre-wrap', borderRadius: 4 }}>
              {statusQ.data ? JSON.stringify(statusQ.data, null, 2) : t('polling_for_status')}
            </pre>
          </>
        )}
      </div>

      {/* Status Display - moved and improved */}
      <div className="card" style={{ marginBottom: 24, padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <h3 style={{ margin: 0 }}>{t('status_label')}</h3>
        <span style={{ fontWeight: 'bold', color: statusQ.data?.status === 'completed' ? 'lightgreen' : (statusQ.data?.status === 'failed' ? 'red' : 'yellow') }}>
          {statusQ.isLoading ? t('loading') : statusQ.data?.status?.toUpperCase()}
        </span>
        {statusQ.data?.status === 'running' && <span style={{ fontStyle: 'italic' }}>{t('job_running')}</span>}
        {statusQ.data?.status === 'failed' && <span style={{ color: 'red' }}>{t('job_failed')} {statusQ.data.error}</span>}
      </div>


      {data ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {geojson && (
              <div className="card">
                <MapViewer geojson={geojson} marker={marker} height={300} />
              </div>
            )}
            <FlowDurationCurve data={runoffData} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {metrics && (
              <div className="card">
                <h3>{t('hydrological_signatures')}</h3>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {Object.entries(metrics).map(([name, value]: any) => (
                    <div key={name} style={{ flex: '1 1 120px', background: '#0F3460', padding: 12, borderRadius: 8 }}>
                      <div style={{ fontSize: 12, color: '#bbb' }}>{name.replace(/_/g, ' ').toUpperCase()}</div>
                      <div style={{ fontSize: 20, fontWeight: 700 }}>
                        {typeof value === 'number' ? value.toFixed(2) : String(value)}
                        <span style={{ fontSize: 12, color: '#bbb', marginLeft: 4 }}>{signatureUnits[name]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <TimeSeriesChart data={timeSeriesData} />
          </div>
        </div>
      ) : (
        !statusQ.isLoading && statusQ.data?.status !== 'running' && <div>{t('no_results_available')}</div>
      )}
    </div>
  )
}
