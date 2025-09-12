// GPS utility functions for calculations

interface Position {
  lat: number;
  lng: number;
  timestamp?: number;
}

/**
 * Calculate distance between two GPS coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(pos1: Position, pos2: Position): number {
  const R = 6371; // Earth's radius in kilometers
  
  const lat1Rad = (pos1.lat * Math.PI) / 180;
  const lat2Rad = (pos2.lat * Math.PI) / 180;
  const deltaLat = ((pos2.lat - pos1.lat) * Math.PI) / 180;
  const deltaLng = ((pos2.lng - pos1.lng) * Math.PI) / 180;

  const a = 
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Calculate speed between two GPS points
 * Returns speed in km/h
 */
export function calculateSpeed(pos1: Position, pos2: Position): number {
  if (!pos1.timestamp || !pos2.timestamp) {
    return 0;
  }

  const distance = calculateDistance(pos1, pos2); // km
  const timeDiff = (pos2.timestamp - pos1.timestamp) / 1000 / 3600; // hours

  if (timeDiff === 0) {
    return 0;
  }

  return distance / timeDiff;
}

/**
 * Calculate bearing (direction) from one point to another
 * Returns bearing in degrees (0-360)
 */
export function calculateBearing(pos1: Position, pos2: Position): number {
  const lat1Rad = (pos1.lat * Math.PI) / 180;
  const lat2Rad = (pos2.lat * Math.PI) / 180;
  const deltaLng = ((pos2.lng - pos1.lng) * Math.PI) / 180;

  const x = Math.sin(deltaLng) * Math.cos(lat2Rad);
  const y = 
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLng);

  const bearingRad = Math.atan2(x, y);
  const bearingDeg = (bearingRad * 180) / Math.PI;

  return (bearingDeg + 360) % 360;
}

/**
 * Convert degrees to cardinal direction
 */
export function degreesToCardinal(degrees: number): string {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

/**
 * Calculate total distance of a route
 */
export function calculateTotalDistance(positions: Position[]): number {
  if (positions.length < 2) {
    return 0;
  }

  let totalDistance = 0;
  for (let i = 1; i < positions.length; i++) {
    totalDistance += calculateDistance(positions[i - 1], positions[i]);
  }

  return totalDistance;
}

/**
 * Calculate average speed of a route
 */
export function calculateAverageSpeed(positions: Position[]): number {
  if (positions.length < 2) {
    return 0;
  }

  const totalDistance = calculateTotalDistance(positions);
  const startTime = positions[0].timestamp || 0;
  const endTime = positions[positions.length - 1].timestamp || 0;
  const timeDiff = (endTime - startTime) / 1000 / 3600; // hours

  if (timeDiff === 0) {
    return 0;
  }

  return totalDistance / timeDiff;
}

/**
 * Smooth GPS coordinates to reduce noise
 */
export function smoothCoordinates(positions: Position[], windowSize: number = 3): Position[] {
  if (positions.length <= windowSize) {
    return positions;
  }

  const smoothed: Position[] = [];
  
  for (let i = 0; i < positions.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(positions.length, i + Math.ceil(windowSize / 2));
    
    let latSum = 0;
    let lngSum = 0;
    let count = 0;
    
    for (let j = start; j < end; j++) {
      latSum += positions[j].lat;
      lngSum += positions[j].lng;
      count++;
    }
    
    smoothed.push({
      lat: latSum / count,
      lng: lngSum / count,
      timestamp: positions[i].timestamp,
    });
  }
  
  return smoothed;
}

/**
 * Filter out GPS points that are too close together or have low accuracy
 */
export function filterGPSPoints(
  positions: Position[], 
  minDistance: number = 0.005, // km
  maxAccuracy: number = 50 // meters
): Position[] {
  if (positions.length === 0) {
    return positions;
  }

  const filtered: Position[] = [positions[0]]; // Always keep the first point
  
  for (let i = 1; i < positions.length; i++) {
    const current = positions[i];
    const last = filtered[filtered.length - 1];
    
    // Check distance threshold
    const distance = calculateDistance(last, current);
    if (distance < minDistance) {
      continue;
    }
    
    // Check accuracy if available
    const position = positions[i] as Position & { accuracy?: number };
    if (position.accuracy && position.accuracy > maxAccuracy) {
      continue;
    }
    
    filtered.push(current);
  }
  
  return filtered;
}