import { useQueryClient, useQuery } from '@tanstack/react-query'
import { getJobStatus } from '../services/api'
import useSSE from './useSSE'

export function useJobStatus(runId: string | null) {
  const queryClient = useQueryClient()
  const enabled = !!runId
  const query = useQuery(['job', runId], () => getJobStatus(runId as string), { enabled })

  useSSE(runId ? `${import.meta.env.VITE_API_BASE || ''}/api/jobs/${encodeURIComponent(runId)}/events` : null, (data) => {
    // Update cache when SSE events arrive
    queryClient.setQueryData(['job', runId], (old: any) => ({ ...(old || {}), ...data }))
  })

  return query
}
