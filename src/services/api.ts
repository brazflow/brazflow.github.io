import type {
  PredictRequest,
  TaskResponse,
  TaskStatusResponse,
  ResultTask,
} from '../utils/types'

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export async function launchPredictTask(payload: PredictRequest): Promise<TaskResponse> {
  const res = await fetch(`${API_BASE}/api/v2/predict/launch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to launch prediction task')
  return res.json()
}

export async function getTaskStatus(taskId: string): Promise<TaskStatusResponse> {
  const res = await fetch(`${API_BASE}/api/v2/predict/${encodeURIComponent(taskId)}/status`)
  if (!res.ok) throw new Error('Failed to fetch task status')
  return res.json()
}

export async function getTaskResult(taskId: string): Promise<ResultTask> {
  const res = await fetch(`${API_BASE}/api/v2/predict/${encodeURIComponent(taskId)}/result`)
  if (!res.ok) throw new Error('Failed to fetch task result')
  return res.json()
}