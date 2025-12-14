import React, { useEffect, useRef } from 'react'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import { fromLonLat, toLonLat } from 'ol/proj'
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
  onMapClick?: (lat: number, lon: number) => void
  height?: number | string
}

export default function MapViewer({ center=[-14, -51], zoom=5, marker=null, geojson=null, onMapClick, height=500 }: Props) {
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

    // ensure size is updated after initial render
    setTimeout(() => { try { map.updateSize() } catch (e) {} }, 200)

    // update size on window resize
    const onResize = () => { try { map.updateSize() } catch (e) {} }
    window.addEventListener('resize', onResize)

    if (onMapClick) {
      map.on('singleclick', function(evt) {
        const lonlat = toLonLat(evt.coordinate)
        const lon = lonlat[0]
        const lat = lonlat[1]
        onMapClick(lat, lon)
      })
    }

    return () => {
      window.removeEventListener('resize', onResize)
      map.setTarget(null)
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const ctx = mapRef.current
    if (!ctx) return
    const { vectorSource, view, map } = ctx
    vectorSource.clear()
    if (geojson) {
      const format = new GeoJSON()
      const features = format.readFeatures(geojson, { featureProjection: 'EPSG:3857' })
      vectorSource.addFeatures(features)
      const extent = vectorSource.getExtent()
      if (extent && extent[0] !== Infinity) {
        view.fit(extent, { padding: [20,20,20,20], maxZoom: 14 })
      }
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
    // after changing content, ensure map recalculates size
    setTimeout(() => { try { map.updateSize() } catch (e) {} }, 100)
  }, [marker, geojson])

  // when height prop changes, trigger map resize
  useEffect(() => {
    const ctx = mapRef.current
    if (!ctx) return
    const { map } = ctx
    setTimeout(() => { try { map.updateSize() } catch (e) {} }, 50)
  }, [height])

  // If user requested '100%' height, render map to fill the right-column using CSS calc
  if (typeof height === 'string' && height === '100%') {
    // fill full available viewport height minus header
    return <div ref={ref} style={{ height: 'calc(100vh - 56px)', width: '100%', overflow: 'hidden' }} />
  }

  // resolve height prop: allow numeric or other string values
  const resolvedHeight = typeof height === 'string' && height === '100%'
    ? 'calc(100vh - 56px)'
    : height

  return <div ref={ref} style={{ height: resolvedHeight, width: '100%', overflow: 'hidden' }} />
}
