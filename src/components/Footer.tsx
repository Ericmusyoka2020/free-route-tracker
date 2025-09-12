import React from 'react';
import { Heart, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-background/95 backdrop-blur-md border-t border-border/50 px-4 py-3">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin size={12} className="text-primary" />
          <span>GPS Tracker © 2024</span>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>Built with</span>
          <Heart size={12} className="text-red-500 animate-pulse" />
          <span>using React & OpenStreetMap</span>
        </div>
        
        <div className="text-xs text-muted-foreground">
          <span>No API keys required • Privacy focused</span>
        </div>
      </div>
    </footer>
  );
};