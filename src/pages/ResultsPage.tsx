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
          <button onClick={handleDownload} className="bg-brazflow-panel text-brazflow-text rounded-md border-none py-2.5 px-3 mb-2 cursor-pointer text-center hover:bg-brazflow-panel-hover w-auto">
            {t('download_results')}
          </button>
        )}
      </div>

      {/* Log Viewer at the top */}
      <div className="bg-brazflow-panel rounded-[10px] shadow-[0_4px_8px_rgba(0,0,0,0.2)] border border-brazflow-panel-border mb-6 py-2.5 px-5">
        <button onClick={() => setIsLogVisible(!isLogVisible)} className="bg-none border-none p-0 text-brazflow-text cursor-pointer font-bold">
          {isLogVisible ? t('hide_log_details') : t('show_log_details')}
        </button>
        {isLogVisible && (
          <>
            <h3 className="mt-3 mb-2">{t('logs')}</h3>
            <pre className="h-[300px] overflow-auto bg-brazflow-panel text-[#eee] p-2 whitespace-pre-wrap rounded">
              {statusQ.data ? JSON.stringify(statusQ.data, null, 2) : t('polling_for_status')}
            </pre>
          </>
        )}
      </div>

      {/* Status Display - moved and improved */}
      <div className="bg-brazflow-panel rounded-[10px] shadow-[0_4px_8px_rgba(0,0,0,0.2)] border border-brazflow-panel-border mb-6 py-2.5 px-5 flex items-center gap-x-2.5">
        <h3 className="m-0">{t('status_label')}</h3>
        <span className={`font-bold ${
            statusQ.data?.status === 'completed' ? 'text-green-400' :
            statusQ.data?.status === 'failed' ? 'text-red-500' :
            'text-yellow-400'
          }`}>
          {statusQ.isLoading ? t('loading') : statusQ.data?.status?.toUpperCase()}
        </span>
        {statusQ.data?.status === 'running' && <span className="italic">{t('job_running')}</span>}
        {statusQ.data?.status === 'failed' && <span className="text-red-500">{t('job_failed')} {statusQ.data.error}</span>}
      </div>


      {data ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {geojson && (
              <div className="bg-brazflow-panel rounded-[10px] p-5 mb-6 shadow-[0_4px_8px_rgba(0,0,0,0.2)] border border-brazflow-panel-border">
                <MapViewer geojson={geojson} marker={marker} height={300} />
              </div>
            )}
            <div className="bg-brazflow-panel rounded-[10px] p-5 mb-6 shadow-[0_4px_8px_rgba(0,0,0,0.2)] border border-brazflow-panel-border">
              <FlowDurationCurve data={runoffData} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {metrics && (
              <div className="bg-brazflow-panel rounded-[10px] p-5 mb-6 shadow-[0_4px_8px_rgba(0,0,0,0.2)] border border-brazflow-panel-border">
                <h3>{t('hydrological_signatures')}</h3>
                <div className="flex gap-3 flex-wrap">
                  {Object.entries(metrics).map(([name, value]: any) => (
                    <div key={name} className="flex-[1_1_120px] bg-brazflow-panel p-3 rounded-lg">
                      <div className="text-xs text-[#bbb]">{name.replace(/_/g, ' ').toUpperCase()}</div>
                      <div className="text-xl font-bold">
                        {typeof value === 'number' ? value.toFixed(2) : String(value)}
                        <span className="text-xs text-[#bbb] ml-1">{signatureUnits[name]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-brazflow-panel rounded-[10px] p-5 mb-6 shadow-[0_4px_8px_rgba(0,0,0,0.2)] border border-brazflow-panel-border">
              <TimeSeriesChart data={timeSeriesData} />
            </div>
          </div>
        </div>
      ) : (
        !statusQ.isLoading && statusQ.data?.status !== 'running' && <div>{t('no_results_available')}</div>
      )}
    </div>
  )
}
