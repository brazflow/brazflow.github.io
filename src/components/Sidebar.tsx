import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import RunLookup from './RunLookup'
import { useI18n } from '../i18n'

export default function Sidebar(){
  const { locale, setLocale, t } = useI18n()
  const [method, setMethod] = useState<'map'|'coords'|'shp'|'kmz'>('map')
  const navigate = useNavigate()

  return (
    <aside className="sidebar" aria-label="Sidebar">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h3 style={{margin:0}}>🌊 BrazFlow</h3>
        <div>
          <select value={locale} onChange={e => setLocale(e.target.value as any)} style={{background:'transparent',color:'white',border:'1px solid rgba(255,255,255,0.06)'}}>
            <option value="en-US">EN</option>
            <option value="pt-BR">PT</option>
          </select>
        </div>
      </div>

      <hr style={{borderColor:'rgba(255,255,255,0.06)'}} />

      <div style={{marginTop:12}}>
        <div style={{marginBottom:8}}><strong>{t('quick_run')}</strong></div>
        <div style={{display:'grid',gap:6}}>
          <label style={{display:'flex',gap:8,alignItems:'center'}}><input type="radio" checked={method==='map'} onChange={()=>setMethod('map')} /> {t('quick_run')}</label>
          <label style={{display:'flex',gap:8,alignItems:'center'}}><input type="radio" checked={method==='coords'} onChange={()=>setMethod('coords')} /> {t('latitude')}</label>
          <label style={{display:'flex',gap:8,alignItems:'center'}}><input type="radio" checked={method==='shp'} onChange={()=>setMethod('shp')} /> {t('upload_shapefile')}</label>
          <label style={{display:'flex',gap:8,alignItems:'center'}}><input type="radio" checked={method==='kmz'} onChange={()=>setMethod('kmz')} /> KMZ</label>
        </div>
      </div>

      <div style={{marginTop:16}}>
        <button className="sidebar-button" onClick={()=>navigate('/')}>Quick Run</button>
        <button className="sidebar-button" onClick={()=>navigate('/upload')}>Upload</button>
      </div>

      <div style={{marginTop:16}}>
        <RunLookup />
      </div>

      <div style={{position:'absolute',bottom:16,left:16,right:16}}>
        <small style={{color:'rgba(255,255,255,0.6)'}}>Example UI — use backend for jobs and results</small>
      </div>
    </aside>
  )
}
