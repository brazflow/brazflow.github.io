import { API_BASE } from './api'

export async function uploadShapefile(file: File) {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch(`${API_BASE}/api/v1/jobs`, { method: 'POST', body: fd })
  if (!res.ok) throw new Error('Upload failed')
  return res.json()
}
