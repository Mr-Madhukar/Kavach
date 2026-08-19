"use client";

import { MapContainer, TileLayer, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Leaflet with Next.js
if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
}

interface Report {
  id: string;
  lat: number;
  lng: number;
  category?: string;
}

interface MapComponentProps {
  reports: Report[];
  alertActive: boolean;
}

export default function MapComponent({ reports, alertActive }: MapComponentProps) {
  // Default to New Delhi coordinates
  const center: [number, number] = [28.6139, 77.2090]; 

  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      
      {/* Reports Heatmap simulation using semi-transparent circles */}
      {reports.map((r) => (
        <CircleMarker
          key={r.id}
          center={[r.lat, r.lng]}
          radius={30}
          pathOptions={{ 
            color: 'transparent', 
            fillColor: '#ef4444', 
            fillOpacity: 0.15 
          }}
        />
      ))}

      {/* User Location Marker */}
      <CircleMarker 
        center={center} 
        radius={alertActive ? 12 : 8}
        pathOptions={{ 
          color: alertActive ? '#ef4444' : '#fbbf24', 
          fillColor: alertActive ? '#ef4444' : '#fbbf24',
          fillOpacity: 1,
          weight: 2
        }}
      />
      
      {/* Pulse effect wrapper using a second larger transparent circle */}
      {alertActive && (
        <CircleMarker 
          center={center} 
          radius={30}
          className="animate-pulse-fast"
          pathOptions={{ 
            color: '#ef4444', 
            fillColor: 'transparent',
            weight: 2,
            opacity: 0.8
          }}
        />
      )}
    </MapContainer>
  );
}
