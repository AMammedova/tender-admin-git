// Helper functions for map functionality
import L from "leaflet"

// Fix Leaflet marker icon issue
export const fixLeafletIcon = () => {
  // @ts-ignore - Leaflet types are not complete
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  })
}

// Geocoding function
export const geocodeAddress = async (address: string) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
  )

  if (!response.ok) {
    throw new Error("Failed to search for address")
  }

  const data = await response.json()

  if (data.length === 0) {
    throw new Error("Address not found")
  }

  const result = data[0]
  return {
    lat: Number.parseFloat(result.lat),
    lng: Number.parseFloat(result.lon),
    displayName: result.display_name,
  }
}
