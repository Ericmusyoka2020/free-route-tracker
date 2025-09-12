import React, { useState } from 'react';
import { Play, Square, Pause, RotateCcw, History } from 'lucide-react';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

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

interface GPSControlPanelProps {
  isTracking: boolean;
  isPaused: boolean;
  onStartTracking: () => void;
  onStopTracking: () => void;
  onTogglePause: () => void;
  onClearRoute: () => void;
  savedRoutes: RouteData[];
  onLoadRoute: (route: RouteData) => void;
}

export const GPSControlPanel: React.FC<GPSControlPanelProps> = ({
  isTracking,
  isPaused,
  onStartTracking,
  onStopTracking,
  onTogglePause,
  onClearRoute,
  savedRoutes,
  onLoadRoute,
}) => {
  const [showHistory, setShowHistory] = useState(false);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString() + ' ' + 
           new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (startTime: number, endTime?: number) => {
    const duration = (endTime || Date.now()) - startTime;
    const minutes = Math.floor(duration / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  return (
    <>
      <div className="gps-control-panel p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Start/Stop Button */}
          {!isTracking ? (
            <Button
              onClick={onStartTracking}
              variant="success"
              className="flex items-center justify-center gap-2 h-12"
              size="lg"
            >
              <Play size={20} />
              <span className="hidden sm:inline">Start</span>
            </Button>
          ) : (
            <Button
              onClick={onStopTracking}
              variant="danger"
              className="flex items-center justify-center gap-2 h-12"
              size="lg"
            >
              <Square size={20} />
              <span className="hidden sm:inline">Stop</span>
            </Button>
          )}

          {/* Pause/Resume Button */}
          <Button
            onClick={onTogglePause}
            disabled={!isTracking}
            variant="gps"
            className="flex items-center justify-center gap-2 h-12"
            size="lg"
          >
            <Pause size={20} />
            <span className="hidden sm:inline">{isPaused ? 'Resume' : 'Pause'}</span>
          </Button>

          {/* Clear Route Button */}
          <Button
            onClick={onClearRoute}
            variant="outline"
            className="flex items-center justify-center gap-2 h-12 border-border/50 hover:bg-secondary"
            size="lg"
          >
            <RotateCcw size={20} />
            <span className="hidden sm:inline">Clear</span>
          </Button>

          {/* History Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2 h-12 border-border/50 hover:bg-secondary"
                size="lg"
              >
                <History size={20} />
                <span className="hidden sm:inline">History</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] bg-card border-border">
              <SheetHeader>
                <SheetTitle className="text-card-foreground">Route History</SheetTitle>
                <SheetDescription className="text-muted-foreground">
                  Load a previously saved route
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {savedRoutes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <History size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No saved routes yet</p>
                    <p className="text-sm mt-2">Start tracking to create your first route</p>
                  </div>
                ) : (
                  savedRoutes.map((route) => (
                    <div
                      key={route.id}
                      className="gps-metric cursor-pointer hover:bg-secondary/60"
                      onClick={() => onLoadRoute(route)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-card-foreground truncate pr-2">
                          {route.name}
                        </h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(route.startTime)}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Distance</span>
                          <p className="font-medium text-gps-speed">
                            {route.totalDistance.toFixed(2)} km
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Avg Speed</span>
                          <p className="font-medium text-primary">
                            {route.averageSpeed.toFixed(1)} km/h
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Duration</span>
                          <p className="font-medium text-accent-foreground">
                            {formatDuration(route.startTime, route.endTime)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {route.positions.length} points tracked
                      </div>
                    </div>
                  ))
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Status Indicator */}
        {isTracking && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-gps-warning animate-pulse' : 'bg-gps-speed animate-pulse'}`} />
            <span className="text-muted-foreground">
              {isPaused ? 'Tracking Paused' : 'Actively Tracking'}
            </span>
          </div>
        )}
      </div>
    </>
  );
};