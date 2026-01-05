import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from './Button'
import { useI18n } from '../i18n'

export default function RunLookup() {
  const { t } = useI18n()
  const [id, setId] = useState('')
  const nav = useNavigate()
  return (
    <div className="flex gap-2 items-center">
      <label className="flex flex-col flex-1">
        <small className="text-sm text-white/60">{t('load_run_by_id')}</small>
        <input className="run-id-input bg-transparent border border-white/8 p-2 rounded" placeholder={t('load_run_by_id')} value={id} onChange={e => setId(e.target.value)} />
      </label>
      <Button onClick={() => id && nav(`/results/${encodeURIComponent(id)}}`)}>{t('go')}</Button>
    </div>
  )
}
