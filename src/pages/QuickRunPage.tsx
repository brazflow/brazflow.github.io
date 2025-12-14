import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createJob } from '../services/api'
import Button from '../components/Button'
import MapViewer from '../components/MapViewer'

export default function QuickRunPage() {
  const [lat, setLat] = useState<number>(-10)
  const [lon, setLon] = useState<number>(-44)
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  // Load initial coords from localStorage and listen for external coord events
  useEffect(() => {
    try{
      const stored = localStorage.getItem('brazflow.coords')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed && typeof parsed.lat === 'number' && typeof parsed.lng === 'number'){
          setLat(parsed.lat)
          setLon(parsed.lng)
        }
      }
    }catch(e){/* ignore */}

    const handler = (ev: any) => {
      const d = ev?.detail
      if (d && typeof d.lat === 'number' && typeof d.lng === 'number'){
        setLat(d.lat)
        setLon(d.lng)
      }
    }
    // expose a global setter for immediate sync
    ;(window as any).brazflow_set_coords = (la: number, lo: number) => {
      setLat(la)
      setLon(lo)
      try{ localStorage.setItem('brazflow.coords', JSON.stringify({lat: la, lng: lo})) }catch(e){}
    }
    window.addEventListener('brazflow:coords', handler as EventListener)
    return () => {
      window.removeEventListener('brazflow:coords', handler as EventListener)
      try{ (window as any).brazflow_set_coords = undefined }catch(e){}
    }
  }, [])

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
      <h1 className="text-2xl font-bold my-4">Water Availability Analysis</h1>
      <div className="flex gap-3 h-[calc(100vh-160px)]">
        <div className="flex-1">
          <MapViewer marker={[lat, lon]} height={'100%'} onMapClick={(newLat, newLon) => { setLat(newLat); setLon(newLon); localStorage.setItem('brazflow.coords', JSON.stringify({lat:newLat,lng:newLon})); window.dispatchEvent(new CustomEvent('brazflow:coords',{detail:{lat:newLat,lng:newLon}})); }} />
        </div>
      </div>
    </div>
  )
}
