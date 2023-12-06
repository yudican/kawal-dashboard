import mapboxgl from 'mapbox-gl'
import { useEffect, useRef } from 'react'

mapboxgl.accessToken = 'pk.eyJ1IjoieXVkaWNhbmRyYTEiLCJhIjoiY2tuemd6dXhoMDR1ZDJ2cGMzbGk0dHpoaSJ9.Y5TZzkmHQd4Q2hWpDllpsQ'
const MapWithMarkers = ({ data }) => {
  const coordinates = data.map(item => item.geolocation.coordinates)
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map-marker',
      // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [116.416505398238, 1.28915],
      zoom: 5
    })
    map.on('load', () => {
      // Create a default Marker and add it to the map.
      // Create a default Marker, colored black, rotated 45 degrees.
      coordinates.forEach(item => new mapboxgl.Marker({ color: 'black' }).setLngLat(item).addTo(map))
    })
  }, [data])

  return <div id='map-marker' className='map-container' style={{ height: 500 }} />
}

export default MapWithMarkers
