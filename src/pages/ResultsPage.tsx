import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useJobStatus } from '../hooks/useJobStatus'
import { getResults } from '../services/api'
import { useQuery } from '@tanstack/react-query'
import TimeSeriesChart from '../components/TimeSeriesChart'
import SummaryTable from '../components/SummaryTable'
import useSSE from '../hooks/useSSE'
import { useI18n } from '../i18n'

export default function ResultsPage() {
  const { runId } = useParams()
  const { t } = useI18n()
  const statusQ = useJobStatus(runId || null)
  const resultsQ = useQuery(['results', runId], () => getResults(runId as string), { enabled: !!runId })
  const [logs, setLogs] = useState<string[]>([])

  useSSE(runId ? `${import.meta.env.VITE_API_BASE || ''}/api/jobs/${encodeURIComponent(runId)}/events` : null, (data) => {
    // Append textual messages to logs when present
    try {
      if (data && data.message) setLogs(l => [...l, String(data.message)])
      else if (typeof data === 'string') setLogs(l => [...l, data])
    } catch { }
  })

  useEffect(() => {
    if (resultsQ.data && resultsQ.data.time_series) {
      // ensure logs show retrieval
      setLogs(l => [...l, 'Results loaded'])
    }
  }, [resultsQ.data])

  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <div style={{ flex: 2 }}>
        <h2>{t('results')}: {runId}</h2>
        <div>{t('status')}: {statusQ.data ? statusQ.data.status : 'unknown'}</div>
        {resultsQ.data ? (
          <>
            <TimeSeriesChart data={resultsQ.data.time_series || []} />
            <h3>Summary</h3>
            <SummaryTable summary={resultsQ.data.summary_stats} />
            {resultsQ.data.download_url && <div style={{ marginTop: 8 }}><a href={resultsQ.data.download_url}>{t('download')}</a></div>}
            {/* images if present */}
            {resultsQ.data && (resultsQ.data as any).images && (
              <div>
                {(resultsQ.data as any).images.map((u: string, i: number) => (
                  <img key={i} src={u} alt={`figure-${i}`} style={{ maxWidth: '100%', marginTop: 8 }} />
                ))}
              </div>
            )}
          </>
        ) : <div>Loading results...</div>}
      </div>
      <aside style={{ width: 360 }}>
        <h3>{t('logs')}</h3>
        <div style={{ height: 400, overflow: 'auto', background: '#111', color: '#eee', padding: 8 }}>
          {logs.map((l, i) => <div key={i} style={{ fontFamily: 'monospace', fontSize: 12 }}>{l}</div>)}
        </div>
      </aside>
    </div>
  )
}
