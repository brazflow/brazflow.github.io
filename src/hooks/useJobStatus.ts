import { useQuery } from '@tanstack/react-query'
import { getTaskStatus } from '../services/api'
import type { TaskStatusResponse } from '../utils/types'

export function useJobStatus(taskId: string | null) {
  const enabled = !!taskId
  const query = useQuery<TaskStatusResponse>({
    queryKey: ['task', taskId],
    queryFn: () => getTaskStatus(taskId as string),
    enabled,
    refetchInterval: (query) => {
      const data = query.state.data
      if (data?.status === 'completed' || data?.status === 'failed') {
        return false // Stop refetching if the job is done
      }
      return 5000 // Refetch every 5 seconds
    },
    refetchOnWindowFocus: false,
  })

  return query
}