"use client"

import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { STATES } from '@/lib/constants'

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function NigeriaMap({ 
  onStateClick 
}: { 
  onStateClick?: (stateId: number) => void 
}) {
  const [geoData, setGeoData] = useState<any>(null)

  useEffect(() => {
    // In a real app, this would fetch from /data/nigeria-states.geojson
    // For now we'll simulate an empty map or fetch if we had it
    fetch('/data/nigeria-states.geojson')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error("Could not load geojson", err))
  }, [])

  const style = (feature: any) => {
    // Determine color based on some random or dummy data
    const isReported = Math.random() > 0.5
    return {
      fillColor: isReported ? '#008751' : '#e2e8f0',
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7
    }
  }

  const onEachFeature = (feature: any, layer: any) => {
    layer.on({
      mouseover: (e: any) => {
        const layer = e.target
        layer.setStyle({
          weight: 2,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.9
        })
      },
      mouseout: (e: any) => {
        const layer = e.target
        layer.setStyle(style(feature))
      },
      click: (e: any) => {
        const stateName = feature.properties.admin1Name || feature.properties.state_name
        const state = STATES.find(s => s.name.toLowerCase() === String(stateName).toLowerCase())
        if (state && onStateClick) {
          onStateClick(state.id)
        }
      }
    })
    
    const stateName = feature.properties.admin1Name || feature.properties.state_name
    layer.bindTooltip(stateName, { permanent: false, direction: "center" })
  }

  return (
    <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden border border-border/50 shadow-sm relative z-0">
      <MapContainer 
        center={[9.0820, 8.6753]} 
        zoom={6} 
        scrollWheelZoom={false} 
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        />
        {geoData && (
          <GeoJSON 
            data={geoData} 
            style={style} 
            onEachFeature={onEachFeature} 
          />
        )}
      </MapContainer>
    </div>
  )
}
