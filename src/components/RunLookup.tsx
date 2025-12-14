import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from './Button'

export default function RunLookup() {
  const [id, setId] = useState('')
  const nav = useNavigate()
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <input placeholder="Run ID" value={id} onChange={e => setId(e.target.value)} />
      <Button onClick={() => id && nav(`/results/${encodeURIComponent(id)}`)}>Go</Button>
    </div>
  )
}
