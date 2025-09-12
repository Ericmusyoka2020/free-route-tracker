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
    <div className="space-y-2 sm:space-y-3 w-full max-w-[180px] sm:max-w-none">
      {/* Current Speed */}
      <div className="gps-metric p-2 sm:p-3">
        <div className="flex items-center gap-1 sm:gap-2 mb-1">
          <Gauge size={14} className="text-primary flex-shrink-0" />
          <span className="text-xs text-muted-foreground uppercase tracking-wide truncate">Speed</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-lg sm:text-2xl font-bold text-gps-speed">
            {currentSpeed.toFixed(1)}
          </span>
          <span className="text-xs sm:text-sm text-muted-foreground">km/h</span>
        </div>
      </div>

      {/* Average Speed */}
      <div className="gps-metric p-2 sm:p-3">
        <div className="flex items-center gap-1 sm:gap-2 mb-1">
          <TrendingUp size={14} className="text-accent flex-shrink-0" />
          <span className="text-xs text-muted-foreground uppercase tracking-wide truncate">Average</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-lg sm:text-xl font-semibold text-primary">
            {averageSpeed.toFixed(1)}
          </span>
          <span className="text-xs sm:text-sm text-muted-foreground">km/h</span>
        </div>
      </div>

      {/* Total Distance */}
      <div className="gps-metric p-2 sm:p-3">
        <div className="flex items-center gap-1 sm:gap-2 mb-1">
          <MapPin size={14} className="text-gps-route flex-shrink-0" />
          <span className="text-xs text-muted-foreground uppercase tracking-wide truncate">Distance</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-lg sm:text-xl font-semibold text-foreground">
            {totalDistance.toFixed(2)}
          </span>
          <span className="text-xs sm:text-sm text-muted-foreground">km</span>
        </div>
      </div>

      {/* Tracking Status */}
      {isTracking && (
        <div className="gps-metric border border-accent/30 p-2 sm:p-3">
          <div className="flex items-center gap-1 sm:gap-2 mb-1">
            <Clock size={14} className={`${isPaused ? 'text-gps-warning' : 'text-gps-speed'} flex-shrink-0`} />
            <span className="text-xs text-muted-foreground uppercase tracking-wide truncate">Status</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-gps-warning' : 'bg-gps-speed'} animate-pulse`} />
            <span className={`text-xs sm:text-sm font-medium ${isPaused ? 'text-gps-warning' : 'text-gps-speed'} truncate`}>
              {isPaused ? 'Paused' : 'Tracking'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};