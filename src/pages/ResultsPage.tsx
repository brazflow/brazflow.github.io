import React from 'react'
import { useParams } from 'react-router-dom'
import { useJobStatus } from '../hooks/useJobStatus'
import { getResults } from '../services/api'
import { useQuery } from '@tanstack/react-query'
import TimeSeriesChart from '../components/TimeSeriesChart'

export default function ResultsPage() {
  const { runId } = useParams()
  const statusQ = useJobStatus(runId || null)
  const resultsQ = useQuery(['results', runId], () => getResults(runId as string), { enabled: !!runId })

  return (
    <div>
      <h2>Results: {runId}</h2>
      <div>Status: {statusQ.data ? statusQ.data.status : 'unknown'}</div>
      {resultsQ.data ? (
        <div>
          <TimeSeriesChart data={resultsQ.data.time_series || []} />
        </div>
      ) : <div>Loading results...</div>}
    </div>
  )
}
