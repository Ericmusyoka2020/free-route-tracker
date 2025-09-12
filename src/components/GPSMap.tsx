import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Position {
  lat: number;
  lng: number;
  timestamp: number;
  accuracy?: number;
}

interface GPSMapProps {
  currentPosition?: Position;
  destination?: Position;
  route: Position[];
  plannedRoute: Position[];
  currentSpeed: number;
  routeInfo?: { distance: number; duration: number };
}

export const GPSMap: React.FC<GPSMapProps> = ({
  currentPosition,
  destination,
  route,
  plannedRoute,
  currentSpeed,
  routeInfo,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const currentMarkerRef = useRef<L.Marker | null>(null);
  const destinationMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const plannedRouteLineRef = useRef<L.Polyline | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update current position marker
  useEffect(() => {
    if (!mapRef.current || !currentPosition) return;

    // Remove existing marker
    if (currentMarkerRef.current) {
      mapRef.current.removeLayer(currentMarkerRef.current);
    }

    // Create current position icon
    const currentIcon = L.divIcon({
      className: 'current-location-marker',
      html: `
        <div style="
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
        "></div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    // Add marker
    const marker = L.marker([currentPosition.lat, currentPosition.lng], {
      icon: currentIcon
    }).addTo(mapRef.current);

    marker.bindPopup(`
      <div style="color: #333;">
        <strong>Current Location</strong><br />
        Speed: ${currentSpeed.toFixed(1)} km/h<br />
        Accuracy: ${currentPosition.accuracy?.toFixed(0) || 'N/A'}m
      </div>
    `);

    currentMarkerRef.current = marker;

    // Center map on current position
    mapRef.current.setView([currentPosition.lat, currentPosition.lng], mapRef.current.getZoom());
  }, [currentPosition, currentSpeed]);

  // Update destination marker
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing marker
    if (destinationMarkerRef.current) {
      mapRef.current.removeLayer(destinationMarkerRef.current);
      destinationMarkerRef.current = null;
    }

    if (!destination) return;

    // Create destination icon
    const destinationIcon = L.divIcon({
      className: 'destination-marker',
      html: `
        <div style="
          width: 30px;
          height: 30px;
          background: #ef4444;
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
        "></div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });

    // Add marker
    const marker = L.marker([destination.lat, destination.lng], {
      icon: destinationIcon
    }).addTo(mapRef.current);

    let popupContent = '<div style="color: #333;"><strong>Destination</strong>';
    if (routeInfo) {
      popupContent += `<br />Distance: ${routeInfo.distance.toFixed(1)} km`;
      popupContent += `<br />Duration: ${Math.round(routeInfo.duration)} min`;
    }
    popupContent += '</div>';

    marker.bindPopup(popupContent);
    destinationMarkerRef.current = marker;
  }, [destination, routeInfo]);

  // Update traveled route
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing route
    if (routeLineRef.current) {
      mapRef.current.removeLayer(routeLineRef.current);
      routeLineRef.current = null;
    }

    if (route.length < 2) return;

    // Create route line
    const routeLine = L.polyline(
      route.map(pos => [pos.lat, pos.lng]),
      {
        color: '#3b82f6',
        weight: 4,
        opacity: 0.8,
      }
    ).addTo(mapRef.current);

    routeLineRef.current = routeLine;
  }, [route]);

  // Update planned route
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing planned route
    if (plannedRouteLineRef.current) {
      mapRef.current.removeLayer(plannedRouteLineRef.current);
      plannedRouteLineRef.current = null;
    }

    if (plannedRoute.length < 2) return;

    // Create planned route line
    const plannedRouteLine = L.polyline(
      plannedRoute.map(pos => [pos.lat, pos.lng]),
      {
        color: '#a855f7',
        weight: 3,
        opacity: 0.6,
        dashArray: '10, 10',
      }
    ).addTo(mapRef.current);

    plannedRouteLineRef.current = plannedRouteLine;
  }, [plannedRoute]);

  return (
    <div 
      ref={mapContainerRef}
      style={{ height: '100%', width: '100%' }}
      className="relative"
    />
  );
};