"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"

// Fix Leaflet marker icon issue
const fixLeafletIcon = () => {
  // @ts-ignore - Leaflet types are not complete
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  })
}

interface MapEventsProps {
  onMapClick: (e: L.LeafletMouseEvent) => void
}

// Separate component for map events to avoid render issues
function MapEvents({ onMapClick }: MapEventsProps) {
  useMapEvents({
    click: onMapClick,
  })
  return null
}

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void
  initialPosition?: [number, number]
  zoom?: number
  searchCoordinates?: { lat: number; lng: number } | null
}

// Main component
const MapPicker = ({
  onLocationSelect,
  initialPosition = [40.409264, 49.867092], // Default to Baku, Azerbaijan
  zoom = 13,
  searchCoordinates = null,
}: MapPickerProps) => {
  const leafletLoaded = useRef(false)
  const mapRef = useRef<L.Map | null>(null)
  const [position, setPosition] = useState<L.LatLng | null>(null)
  const searchCoordsRef = useRef(searchCoordinates)

  useEffect(() => {
    if (!leafletLoaded.current) {
      fixLeafletIcon()
      leafletLoaded.current = true
    }
  }, [])

  // Handle search coordinates updates
  useEffect(() => {
    if (
      searchCoordinates &&
      mapRef.current &&
      (searchCoordsRef.current?.lat !== searchCoordinates.lat || searchCoordsRef.current?.lng !== searchCoordinates.lng)
    ) {
      const { lat, lng } = searchCoordinates
      const newLatLng = L.latLng(lat, lng)

      // Update the marker position
      setPosition(newLatLng)

      // Pan the map to the new location
      mapRef.current.setView(newLatLng, 15)

      // Update the ref to prevent unnecessary updates
      searchCoordsRef.current = searchCoordinates
    }
  }, [searchCoordinates])

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    const newPosition = e.latlng
    setPosition(newPosition)
    onLocationSelect(newPosition.lat, newPosition.lng)
  }

  return (
    <MapContainer
      center={initialPosition}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
      ref={(map) => {
        if (map) mapRef.current = map
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEvents onMapClick={handleMapClick} />
      {position && <Marker position={position} />}
    </MapContainer>
  )
}

// Make sure to export as default
export default MapPicker
