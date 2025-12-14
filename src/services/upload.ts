export async function uploadShapefile(file: File) {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch(`${import.meta.env.VITE_API_BASE || ''}/api/jobs`, { method: 'POST', body: fd })
  if (!res.ok) throw new Error('Upload failed')
  return res.json()
}
