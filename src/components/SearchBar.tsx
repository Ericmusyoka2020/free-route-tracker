import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface Position {
  lat: number;
  lng: number;
  timestamp: number;
}

interface SearchResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  importance: number;
}

interface SearchBarProps {
  onDestinationSelect: (destination: Position) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onDestinationSelect }) => {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Search using Nominatim API
  const searchPlaces = async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=5&countrycodes=&addressdetails=1&extratags=1`
      );
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data: SearchResult[] = await response.json();
      setResults(data);
      setShowResults(true);
    } catch (error) {
      toast({
        title: "Search Error",
        description: "Failed to search for places. Please try again.",
        variant: "destructive",
      });
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Clear existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout for debounced search
    debounceRef.current = setTimeout(() => {
      searchPlaces(value);
    }, 500);
  };

  // Handle result selection
  const handleResultSelect = (result: SearchResult) => {
    const destination: Position = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      timestamp: Date.now(),
    };

    onDestinationSelect(destination);
    setQuery(result.display_name.split(',')[0]); // Show just the place name
    setShowResults(false);
    
    toast({
      title: "Destination Set",
      description: `Navigation set to ${result.display_name.split(',')[0]}`,
    });
  };

  // Handle clicks outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
          {isLoading ? (
            <Loader2 size={20} className="text-muted-foreground animate-spin" />
          ) : (
            <Search size={20} className="text-muted-foreground" />
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search for places..."
          className="gps-search-input w-full pl-10 pr-4 text-base"
          onFocus={() => {
            if (results.length > 0) {
              setShowResults(true);
            }
          }}
        />
      </div>

      {/* Search Results */}
      {showResults && results.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-2 gps-control-panel max-h-64 overflow-y-auto z-50"
        >
          <div className="p-2">
            {results.map((result) => (
              <div
                key={result.place_id}
                onClick={() => handleResultSelect(result)}
                className="flex items-start gap-3 p-3 rounded-md cursor-pointer hover:bg-secondary/60 transition-colors"
              >
                <MapPin size={16} className="text-primary mt-1 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-card-foreground truncate">
                    {result.display_name.split(',')[0]}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {result.display_name.split(',').slice(1).join(',').trim()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results Message */}
      {showResults && !isLoading && query.length >= 3 && results.length === 0 && (
        <div
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-2 gps-control-panel z-50"
        >
          <div className="p-4 text-center text-muted-foreground">
            <MapPin size={24} className="mx-auto mb-2 opacity-50" />
            <p>No places found</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        </div>
      )}
    </div>
  );
};