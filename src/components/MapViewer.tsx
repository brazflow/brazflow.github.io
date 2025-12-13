import React from 'react'
import { MapContainer, TileLayer, Marker, GeoJSON } from 'react-leaflet'

type Props = {
  center?: [number, number]
  zoom?: number
  marker?: [number, number] | null
  geojson?: any
}

export default function MapViewer({ center=[-14, -51], zoom=5, marker=null, geojson=null }: Props) {
  return (
    <div style={{ height: 400 }}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {marker && <Marker position={marker} />}
        {geojson && <GeoJSON data={geojson} />}
      </MapContainer>
    </div>
  )
}
