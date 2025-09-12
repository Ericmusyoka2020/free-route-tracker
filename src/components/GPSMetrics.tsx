import React from 'react';
import { Gauge, TrendingUp, MapPin, Clock } from 'lucide-react';

interface GPSMetricsProps {
  currentSpeed: number;
  averageSpeed: number;
  totalDistance: number;
  isTracking: boolean;
  isPaused: boolean;
}

export const GPSMetrics: React.FC<GPSMetricsProps> = ({
  currentSpeed,
  averageSpeed,
  totalDistance,
  isTracking,
  isPaused,
}) => {
  return (
    <div className="space-y-3">
      {/* Current Speed */}
      <div className="gps-metric">
        <div className="flex items-center gap-2 mb-1">
          <Gauge size={16} className="text-primary" />
          <span className="text-xs text-muted-foreground uppercase tracking-wide">Current Speed</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gps-speed">
            {currentSpeed.toFixed(1)}
          </span>
          <span className="text-sm text-muted-foreground">km/h</span>
        </div>
      </div>

      {/* Average Speed */}
      <div className="gps-metric">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={16} className="text-accent" />
          <span className="text-xs text-muted-foreground uppercase tracking-wide">Average Speed</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-semibold text-primary">
            {averageSpeed.toFixed(1)}
          </span>
          <span className="text-sm text-muted-foreground">km/h</span>
        </div>
      </div>

      {/* Total Distance */}
      <div className="gps-metric">
        <div className="flex items-center gap-2 mb-1">
          <MapPin size={16} className="text-gps-route" />
          <span className="text-xs text-muted-foreground uppercase tracking-wide">Distance</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-semibold text-foreground">
            {totalDistance.toFixed(2)}
          </span>
          <span className="text-sm text-muted-foreground">km</span>
        </div>
      </div>

      {/* Tracking Status */}
      {isTracking && (
        <div className="gps-metric border border-accent/30">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={16} className={isPaused ? 'text-gps-warning' : 'text-gps-speed'} />
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Status</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-gps-warning' : 'bg-gps-speed'} animate-pulse`} />
            <span className={`text-sm font-medium ${isPaused ? 'text-gps-warning' : 'text-gps-speed'}`}>
              {isPaused ? 'Paused' : 'Tracking'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};