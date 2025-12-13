import type { Run, ResultPackage } from '../utils/types'

const API_BASE = import.meta.env.VITE_API_BASE || ''

export async function createJob(payload: any): Promise<Run> {
  const res = await fetch(`${API_BASE}/api/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to create job')
  return res.json()
}

export async function getJobStatus(runId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/api/jobs/${encodeURIComponent(runId)}/status`)
  if (!res.ok) throw new Error('Failed to fetch job status')
  return res.json()
}

export async function getResults(runId: string): Promise<ResultPackage> {
  const res = await fetch(`${API_BASE}/api/results/${encodeURIComponent(runId)}`)
  if (!res.ok) throw new Error('Failed to fetch results')
  return res.json()
}
