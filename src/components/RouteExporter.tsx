import React from 'react';
import { Download, FileText, Map } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useToast } from '../hooks/use-toast';

interface Position {
  lat: number;
  lng: number;
  timestamp: number;
  accuracy?: number;
}

interface RouteExporterProps {
  route: Position[];
}

export const RouteExporter: React.FC<RouteExporterProps> = ({ route }) => {
  const { toast } = useToast();

  // Convert route to GPX format
  const exportToGPX = () => {
    if (route.length === 0) {
      toast({
        title: "No Route Data",
        description: "Start tracking to generate route data for export.",
        variant: "destructive",
      });
      return;
    }

    const gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="GPS Tracker" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>GPS Route ${new Date().toISOString()}</name>
    <time>${new Date().toISOString()}</time>
  </metadata>
  <trk>
    <name>GPS Track</name>
    <trkseg>
${route.map(point => `      <trkpt lat="${point.lat}" lon="${point.lng}">
        <time>${new Date(point.timestamp).toISOString()}</time>
      </trkpt>`).join('\n')}
    </trkseg>
  </trk>
</gpx>`;

    downloadFile(gpxContent, `gps-route-${new Date().toISOString().split('T')[0]}.gpx`, 'application/gpx+xml');
    
    toast({
      title: "GPX Exported",
      description: `Route exported with ${route.length} points.`,
    });
  };

  // Convert route to GeoJSON format
  const exportToGeoJSON = () => {
    if (route.length === 0) {
      toast({
        title: "No Route Data",
        description: "Start tracking to generate route data for export.",
        variant: "destructive",
      });
      return;
    }

    const geoJsonContent = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: route.map(point => [point.lng, point.lat])
          },
          properties: {
            name: `GPS Route ${new Date().toISOString()}`,
            time: new Date().toISOString(),
            points: route.length,
            timestamps: route.map(point => new Date(point.timestamp).toISOString())
          }
        }
      ]
    };

    downloadFile(
      JSON.stringify(geoJsonContent, null, 2), 
      `gps-route-${new Date().toISOString().split('T')[0]}.geojson`, 
      'application/geo+json'
    );
    
    toast({
      title: "GeoJSON Exported",
      description: `Route exported with ${route.length} points.`,
    });
  };

  // Helper function to trigger file download
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
          <Button
            size="lg"
            variant="gps"
            className="h-12 w-12 p-0 rounded-full shadow-control hover:shadow-active"
            disabled={route.length === 0}
          >
          <Download size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-card border-border/50 backdrop-blur-md"
      >
        <DropdownMenuItem
          onClick={exportToGPX}
          className="flex items-center gap-2 cursor-pointer text-card-foreground hover:bg-secondary/60"
        >
          <Map size={16} />
          Export as GPX
          <span className="ml-auto text-xs text-muted-foreground">GPS</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={exportToGeoJSON}
          className="flex items-center gap-2 cursor-pointer text-card-foreground hover:bg-secondary/60"
        >
          <FileText size={16} />
          Export as GeoJSON
          <span className="ml-auto text-xs text-muted-foreground">JSON</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};