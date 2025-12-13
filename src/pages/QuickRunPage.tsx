import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createJob } from '../services/api'
import Button from '../components/Button'

export default function QuickRunPage() {
  const [lat, setLat] = useState<number>(-10)
  const [lon, setLon] = useState<number>(-44)
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  async function submit() {
    setLoading(true)
    try {
      const run = await createJob({ input_type: 'point', point: { latitude: lat, longitude: lon } })
      nav(`/results/${encodeURIComponent(run.run_id)}`)
    } catch (e) {
      alert('Failed to create job')
    } finally { setLoading(false) }
  }

  return (
    <div>
      <h2>Quick Run</h2>
      <div>
        <label>Latitude</label>
        <input value={lat} onChange={e => setLat(Number(e.target.value))} />
      </div>
      <div>
        <label>Longitude</label>
        <input value={lon} onChange={e => setLon(Number(e.target.value))} />
      </div>
      <Button onClick={submit} disabled={loading}>{loading ? 'Submitting...' : 'Run'}</Button>
    </div>
  )
}
