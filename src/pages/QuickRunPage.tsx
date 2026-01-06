import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { launchPredictTask } from '../services/api'
import MapViewer from '../components/MapViewer'

export default function QuickRunPage() {
  const [lat, setLat] = useState<number>(-10)
  const [lon, setLon] = useState<number>(-44)
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

  return (
    <div>
      <h1 className="text-2xl font-bold my-4">Water Availability Analysis</h1>
      <div className="flex flex-col md:flex-row gap-3 h-[calc(100vh-200px)]">
        <div className="flex-1 min-h-[300px] md:min-h-auto">
          <MapViewer marker={[lat, lon]} height={'100%'} onMapClick={(newLat, newLon) => { 
            setLat(newLat); 
            setLon(newLon); 
            localStorage.setItem('brazflow.coords', JSON.stringify({lat:newLat,lng:newLon})); 
            window.dispatchEvent(new CustomEvent('brazflow:coords',{detail:{lat:newLat,lng:newLon}})); 
            
            // Automatically launch task on map click
            (async () => {
              try {
                const task = await launchPredictTask({ outlet: { lat: newLat, lng: newLon } })
                nav(`/results/${encodeURIComponent(task.task_id)}`)
              } catch (e) {
                alert('Failed to create job')
              }
            })();
          }} />
        </div>
      </div>
    </div>
  )
}
