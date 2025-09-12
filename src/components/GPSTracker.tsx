import React, { useState, useEffect, useRef, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import { GPSControlPanel } from './GPSControlPanel';
import { GPSMetrics } from './GPSMetrics';
import { SearchBar } from './SearchBar';
import { RouteExporter } from './RouteExporter';
import { GPSMap } from './GPSMap';
import { calculateDistance, calculateSpeed, calculateBearing } from '../utils/gpsUtils';
import { useToast } from '../hooks/use-toast';

interface Position {
  lat: number;
  lng: number;
  timestamp: number;
  accuracy?: number;
}

interface RouteData {
  id: string;
  name: string;
  positions: Position[];
  startTime: number;
  endTime?: number;
  totalDistance: number;
  averageSpeed: number;
}

export const GPSTracker: React.FC = () => {
  const { toast } = useToast();
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [route, setRoute] = useState<Position[]>([]);
  const [plannedRoute, setPlannedRoute] = useState<Position[]>([]);
  const [destination, setDestination] = useState<Position | null>(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [averageSpeed, setAverageSpeed] = useState(0);
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number } | null>(null);
  const [savedRoutes, setSavedRoutes] = useState<RouteData[]>([]);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  
  const lastPositionRef = useRef<Position | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Load saved routes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gps-routes');
    if (saved) {
      try {
        setSavedRoutes(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved routes:', error);
      }
    }
  }, []);

  // Check geolocation permissions
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.permissions?.query({ name: 'geolocation' }).then((result) => {
        setHasLocationPermission(result.state === 'granted');
        if (result.state === 'denied') {
          toast({
            title: "Location Access Denied",
            description: "Please enable location access to use GPS tracking.",
            variant: "destructive",
          });
        }
      }).catch(() => {
        // Fallback for browsers without permissions API
        setHasLocationPermission(true);
      });
    } else {
      toast({
        title: "GPS Not Available",
        description: "Your device doesn't support GPS tracking.",
        variant: "destructive",
      });
      setHasLocationPermission(false);
    }
  }, [toast]);

  // GPS position handler
  const handlePositionUpdate = useCallback((position: GeolocationPosition) => {
    const newPosition: Position = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      timestamp: Date.now(),
      accuracy: position.coords.accuracy,
    };

    setCurrentPosition(newPosition);

    // Calculate current speed
    if (lastPositionRef.current && position.coords.speed !== null) {
      const speed = position.coords.speed * 3.6; // Convert m/s to km/h
      setCurrentSpeed(Math.max(0, speed));
    }

    // Add to route if tracking and not paused
    if (isTracking && !isPaused) {
      setRoute(prev => {
        const newRoute = [...prev, newPosition];
        
        // Calculate total distance
        if (prev.length > 0) {
          const lastPos = prev[prev.length - 1];
          const distance = calculateDistance(lastPos, newPosition);
          setTotalDistance(prevTotal => prevTotal + distance);
        }

        // Calculate average speed
        const timeElapsed = (Date.now() - startTimeRef.current) / 1000 / 3600; // hours
        if (timeElapsed > 0) {
          setAverageSpeed(totalDistance / timeElapsed);
        }

        return newRoute;
      });
    }

    lastPositionRef.current = newPosition;
  }, [isTracking, isPaused, totalDistance]);

  // GPS error handler
  const handlePositionError = useCallback((error: GeolocationPositionError) => {
    let message = "Location error occurred";
    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = "Location access denied. Please enable GPS and location permissions.";
        setHasLocationPermission(false);
        break;
      case error.POSITION_UNAVAILABLE:
        message = "Location information unavailable. Please check your GPS signal.";
        break;
      case error.TIMEOUT:
        message = "Location request timed out. Please try again.";
        break;
    }
    
    toast({
      title: "GPS Error",
      description: message,
      variant: "destructive",
    });
  }, [toast]);

  // Start GPS tracking
  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      toast({
        title: "GPS Not Supported",
        description: "Your browser doesn't support GPS tracking.",
        variant: "destructive",
      });
      return;
    }

    const id = navigator.geolocation.watchPosition(
      handlePositionUpdate,
      handlePositionError,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000,
      }
    );

    setWatchId(id);
    setIsTracking(true);
    setIsPaused(false);
    startTimeRef.current = Date.now();
    setTotalDistance(0);
    setRoute([]);
    
    toast({
      title: "GPS Tracking Started",
      description: "Now tracking your location and route.",
    });
  }, [handlePositionUpdate, handlePositionError, toast]);

  // Stop GPS tracking
  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    
    // Save route if it has positions
    if (route.length > 0) {
      const routeData: RouteData = {
        id: Date.now().toString(),
        name: `Route ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        positions: route,
        startTime: startTimeRef.current,
        endTime: Date.now(),
        totalDistance,
        averageSpeed,
      };
      
      const updatedRoutes = [...savedRoutes, routeData];
      setSavedRoutes(updatedRoutes);
      localStorage.setItem('gps-routes', JSON.stringify(updatedRoutes));
      
      toast({
        title: "Route Saved",
        description: `Saved route with ${route.length} points and ${totalDistance.toFixed(2)} km.`,
      });
    }
    
    setIsTracking(false);
    setIsPaused(false);
  }, [watchId, route, totalDistance, averageSpeed, savedRoutes, toast]);

  // Toggle pause/resume
  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
    toast({
      title: isPaused ? "Tracking Resumed" : "Tracking Paused",
      description: isPaused ? "GPS tracking is now active." : "GPS tracking is paused.",
    });
  }, [isPaused, toast]);

  // Clear current route
  const clearRoute = useCallback(() => {
    setRoute([]);
    setPlannedRoute([]);
    setDestination(null);
    setTotalDistance(0);
    setCurrentSpeed(0);
    setAverageSpeed(0);
    setRouteInfo(null);
    startTimeRef.current = Date.now();
  }, []);

  // Load saved route
  const loadRoute = useCallback((routeData: RouteData) => {
    setRoute(routeData.positions);
    setTotalDistance(routeData.totalDistance);
    setAverageSpeed(routeData.averageSpeed);
    
    toast({
      title: "Route Loaded",
      description: `Loaded route: ${routeData.name}`,
    });
  }, [toast]);

  // Handle destination selection
  const handleDestinationSelect = useCallback(async (destination: Position) => {
    if (!currentPosition) {
      toast({
        title: "No Current Location",
        description: "Please wait for GPS to determine your location first.",
        variant: "destructive",
      });
      return;
    }

    setDestination(destination);
    
    try {
      // Fetch route from OSRM
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${currentPosition.lng},${currentPosition.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`
      );
      
      const data = await response.json();
      
      if (data.routes && data.routes[0]) {
        const coordinates = data.routes[0].geometry.coordinates;
        const routePositions = coordinates.map((coord: [number, number]) => ({
          lat: coord[1],
          lng: coord[0],
          timestamp: Date.now(),
        }));
        
        setPlannedRoute(routePositions);
        setRouteInfo({
          distance: data.routes[0].distance / 1000, // Convert to km
          duration: data.routes[0].duration / 60, // Convert to minutes
        });
        
        toast({
          title: "Route Calculated",
          description: `Distance: ${(data.routes[0].distance / 1000).toFixed(1)} km, Duration: ${Math.round(data.routes[0].duration / 60)} minutes`,
        });
      }
    } catch (error) {
      toast({
        title: "Route Error",
        description: "Failed to calculate route. Please try again.",
        variant: "destructive",
      });
    }
  }, [currentPosition, toast]);

  const defaultCenter: [number, number] = currentPosition ? [currentPosition.lat, currentPosition.lng] : [51.505, -0.09];

  if (hasLocationPermission === false) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="gps-control-panel p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-foreground">GPS Permission Required</h1>
          <p className="text-muted-foreground mb-6">
            This app needs access to your location to provide GPS tracking functionality.
            Please enable location permissions in your browser settings.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-gps-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Map */}
      <div className="h-screen">
        <GPSMap
          currentPosition={currentPosition || undefined}
          destination={destination || undefined}
          route={route}
          plannedRoute={plannedRoute}
          currentSpeed={currentSpeed}
          routeInfo={routeInfo || undefined}
        />
      </div>

      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-[1000]">
        <SearchBar onDestinationSelect={handleDestinationSelect} />
      </div>

      {/* GPS Metrics */}
      <div className="absolute top-20 left-4 z-[1000]">
        <GPSMetrics
          currentSpeed={currentSpeed}
          averageSpeed={averageSpeed}
          totalDistance={totalDistance}
          isTracking={isTracking}
          isPaused={isPaused}
        />
      </div>

      {/* Control Panel */}
      <div className="absolute bottom-4 left-4 right-4 z-[1000]">
        <GPSControlPanel
          isTracking={isTracking}
          isPaused={isPaused}
          onStartTracking={startTracking}
          onStopTracking={stopTracking}
          onTogglePause={togglePause}
          onClearRoute={clearRoute}
          savedRoutes={savedRoutes}
          onLoadRoute={loadRoute}
        />
      </div>

      {/* Route Exporter */}
      {route.length > 0 && (
        <div className="absolute bottom-4 right-4 z-[1000]">
          <RouteExporter route={route} />
        </div>
      )}
    </div>
  );
};