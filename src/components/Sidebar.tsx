import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RunLookup from './RunLookup'
import BrandLogo from './BrandLogo'
import { useI18n } from '../i18n'
import { launchPredictTask } from '../services/api'

export default function Sidebar() {
  const { locale, setLocale, t } = useI18n()
  const [method, setMethod] = useState<'map' | 'coords' | 'shp' | 'kmz'>('map')
  const [lat, setLat] = useState<number>(0.0)
  const [lng, setLng] = useState<number>(0.0)
  // const [model, setModel] = useState<string>(() => localStorage.getItem('brazflow.model') || 'cudalstm-precip-aridityidx')
  const navigate = useNavigate()

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('brazflow.coords')
      if (stored) {
        const p = JSON.parse(stored)
        if (p && typeof p.lat === 'number' && typeof p.lng === 'number') {
          setLat(p.lat)
          setLng(p.lng)
        }
      }
    } catch (e) {}
    const handler = (ev: any) => {
      const d = ev?.detail
      if (d && typeof d.lat === 'number' && typeof d.lng === 'number') {
        setLat(d.lat)
        setLng(d.lng)
      }
    }
    window.addEventListener('brazflow:coords', handler as EventListener)
    return () => window.removeEventListener('brazflow:coords', handler as EventListener)
  }, [])

  function useCoords() {
    try {
      const v = { lat: lat, lng: lng }
      localStorage.setItem('brazflow.coords', JSON.stringify(v))
      window.dispatchEvent(new CustomEvent('brazflow:coords', { detail: v }))
      // call global setter if present for immediate sync
      try { (window as any).brazflow_set_coords && (window as any).brazflow_set_coords(v.lat, v.lng) } catch (e) {}
      navigate('/')
    } catch (e) {
      console.error('invalid coords', e)
    }
  }

  async function runJob() {
    let coords = null
    try { coords = JSON.parse(localStorage.getItem('brazflow.coords') || 'null') } catch (e) {}
    const latVal = coords?.lat ?? lat
    const lngVal = coords?.lng ?? lng
    if (typeof latVal !== 'number' || typeof lngVal !== 'number' || Number.isNaN(latVal) || Number.isNaN(lngVal)) {
      alert('Invalid coordinates')
      return
    }
    try {
      const task = await launchPredictTask({ outlet: { lat: latVal, lng: lngVal } })
      navigate(`/results/${encodeURIComponent(task.task_id)}`)
    } catch (e) {
      alert('Failed to create job')
    }
  }

  return (
    <aside className="sidebar bg-[#16213E] p-4 text-white relative" aria-label="Sidebar">
      <div className="flex justify-between items-center mb-2">
        <BrandLogo />
        <div>
          <select value={locale} onChange={e => setLocale(e.target.value as any)} className="bg-transparent text-white border border-white/6 rounded px-2 py-1">
            <option value="en-US">EN</option>
            <option value="pt-BR">PT</option>
          </select>
        </div>
      </div>

      <hr className="border-white/6" />

      <div className="mt-3">
        <div className="mb-2"><strong>{t('input_selection')}</strong></div>
        <div className="grid gap-2">
          <label className="flex gap-2 items-center"><input type="radio" checked={method === 'map'} onChange={() => setMethod('map')} /> {t('method_map')}</label>
          <label className="flex gap-2 items-center"><input type="radio" checked={method === 'coords'} onChange={() => setMethod('coords')} /> {t('method_coords')}</label>
          <label className="flex gap-2 items-center"><input type="radio" checked={method === 'shp'} onChange={() => setMethod('shp')} /> {t('method_shp')}</label>
          <label className="flex gap-2 items-center"><input type="radio" checked={method === 'kmz'} onChange={() => setMethod('kmz')} /> {t('method_kmz')}</label>
        </div>


        {method === 'coords' && (
          <div className="mt-2 grid gap-2">
            <input className="coords-input" type="number" value={lat} onChange={e => setLat(parseFloat(e.target.value))} placeholder={t('latitude_label')} />
            <input className="coords-input" type="number" value={lng} onChange={e => setLng(parseFloat(e.target.value))} placeholder={t('longitude_label')} />
            <button className="sidebar-button" onClick={useCoords}>{t('use_coords_button')}</button>
          </div>
        )}

        {(method === 'map' || method === 'coords') && (
          <>
            {/* Model selection 
            <div className="mt-2">
              <div className="mb-1"><small className="text-sm text-white/60">{t('model_selection_label')}</small></div>
              <select value={model} onChange={(e) => { try { const v = e.target.value; setModel(v); localStorage.setItem('brazflow.model', v); } catch (e) {} }} className="w-full p-2 rounded bg-transparent text-white border border-white/8">
                <option value="cudalstm-precip-aridityidx">cudalstm-precip-aridityidx</option>
                <option value="ealstm-precip-aridityidx">ealstm-precip-aridityidx</option>
              </select>
            </div>
            */}
            
            <div className="mt-3">
              <button className="sidebar-button" onClick={runJob}>{t('run_button_label')}</button>
            </div>
          </>
        )}

        {method === 'shp' && (
          <div className="mt-4">
            <button className="sidebar-button" onClick={() => navigate('/upload')}>{t('method_shp')}</button>
          </div>
        )}

        {method === 'kmz' && (
          <div className="mt-4">
            <button className="sidebar-button" onClick={() => navigate('/upload?type=kmz')}>{t('method_kmz')}</button>
          </div>
        )}

      </div>

      <div className="mt-4">
        <RunLookup />
      </div>

      <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
        <small className="small-muted">Example UI — use backend for jobs and results</small>
      </div>
    </aside>
  )
}

