import { useParams } from 'react-router-dom';
import { useState } from 'react';
import FlowDurationCurve from '../components/FlowDurationCurve';
import MapViewer from '../components/MapViewer';
import TimeSeriesChart from '../components/TimeSeriesChart';
import RoundedPanel from '../components/ui/RoundedPanel';
import StatusDisplay from '../components/StatusDisplay';
import LogViewer from '../components/LogViewer';
import HydrologicalSignatures from '../components/HydrologicalSignatures';
import { useJobStatus } from '../hooks/useJobStatus';
import { useI18n } from '../i18n';
import { downloadResults } from '../utils/downloadService';


export default function ResultsPage() {
  const { taskId } = useParams<{ taskId: string }>()
  const { t } = useI18n()
  const statusQ = useJobStatus(taskId || null)
  const [isDownloading, setIsDownloading] = useState(false)

  const data = statusQ.data?.result
  const geojson = data?.catchment
  const marker: [number, number] | null = data?.snapped ? [data.snapped.lat, data.snapped.lng] : null
  const metrics = data?.metrics

  const timeSeriesData = data ? data.time_index.map((ts, i) => ({ timestamp: ts, runoff: data.runoff_simulation[i], precipitation: data.precipitation[i] })) : []
  const runoffData = data ? data.runoff_simulation : []

  const handleDownload = async () => {
    if (!data || !taskId) return;
    
    try {
      setIsDownloading(true);
      await downloadResults(taskId, {
        includeGeometry: true,
        includeMetrics: true,
        includeTimeSeries: true,
      });
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-3">
        <h1 className="text-3xl md:text-4xl m-0">{t('simulation_results')}</h1>
        {data && (
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="bg-brazflow-panel text-brazflow-text rounded-md border-none py-2.5 px-3 cursor-pointer text-center hover:bg-brazflow-panel-hover w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? t('downloading') || 'Downloading...' : t('download_results')}
          </button>
        )}
      </div>

      {/* Log Viewer */}
      <LogViewer data={statusQ.data} />

      {/* Status Display */}
      <StatusDisplay
        taskId={taskId}
        status={statusQ.data?.status}
        isLoading={statusQ.isLoading}
        error={statusQ.data?.error}
      />

      {data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-6">
            {geojson && (
              <RoundedPanel>
                <MapViewer geojson={geojson} marker={marker} height={300} />
              </RoundedPanel>
            )}
            <RoundedPanel>
              <FlowDurationCurve data={runoffData} />
            </RoundedPanel>
          </div>
          <div className="flex flex-col gap-6">
            {metrics && (
              <HydrologicalSignatures metrics={metrics} signatureUnits={signatureUnits} />
            )}
            <RoundedPanel>
              <TimeSeriesChart data={timeSeriesData} />
            </RoundedPanel>
          </div>
        </div>
      ) : (
        !statusQ.isLoading && statusQ.data?.status !== 'running' && <div>{t('no_results_available')}</div>
      )}
    </div>
  )
}
