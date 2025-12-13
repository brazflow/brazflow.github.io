import { useEffect } from 'react'

export default function useSSE(url: string | null, onMessage: (data: any) => void) {
  useEffect(() => {
    if (!url) return
    const es = new EventSource(url)
    es.onmessage = (evt) => {
      try { onMessage(JSON.parse(evt.data)) } catch { onMessage(evt.data) }
    }
    es.onerror = () => { es.close() }
    return () => { es.close() }
  }, [url, onMessage])
}
