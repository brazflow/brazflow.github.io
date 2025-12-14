import React, { useEffect, useRef } from 'react'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import { fromLonLat } from 'ol/proj'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import { Style, Circle as CircleStyle, Fill, Stroke } from 'ol/style'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'

type Props = {
  center?: [number, number]
  zoom?: number
  marker?: [number, number] | null
  geojson?: any
}

export default function MapViewer({ center=[-14, -51], zoom=5, marker=null, geojson=null }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    if (!ref.current) return
    const view = new View({
      center: fromLonLat([center[1], center[0]]),
      zoom
    })
    const map = new Map({
      target: ref.current,
      layers: [
        new TileLayer({ source: new OSM() })
      ],
      view
    })
    const vectorSource = new VectorSource()
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        fill: new Fill({ color: 'rgba(83,114,240,0.3)' }),
        stroke: new Stroke({ color: '#5372F0', width: 2 }),
      })
    })
    map.addLayer(vectorLayer)
    mapRef.current = { map, vectorSource, view }

    return () => {
      map.setTarget(null)
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const ctx = mapRef.current
    if (!ctx) return
    const { vectorSource, view } = ctx
    vectorSource.clear()
    if (geojson) {
      const format = new GeoJSON()
      const features = format.readFeatures(geojson, { featureProjection: 'EPSG:3857' })
      vectorSource.addFeatures(features)
      const extent = vectorSource.getExtent()
      view.fit(extent, { padding: [20,20,20,20], maxZoom: 14 })
    }
    if (marker) {
      const [lat, lon] = marker
      const feat = new Feature(new Point(fromLonLat([lon, lat])))
      feat.setStyle(new Style({
        image: new CircleStyle({ radius: 6, fill: new Fill({ color: '#ff5722' }), stroke: new Stroke({ color: '#fff', width: 2 }) })
      }))
      vectorSource.addFeature(feat)
      view.setCenter(fromLonLat([marker[1], marker[0]]))
    }
  }, [marker, geojson])

  return <div ref={ref} style={{ height: 400, width: '100%' }} />
}
