"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Loader2, Loader, CircleX } from "lucide-react";
import { Coordinates } from "@/lib/types";

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string;
}

interface SearchComponentProps {
  onLocationSelect: (location: string, coordinates: Coordinates) => void;
  currentLocation: string;
}

export default function SearchComponent({
  onLocationSelect,
  currentLocation,
}: SearchComponentProps) {
  const [query, setQuery] = useState(currentLocation);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(currentLocation);
    setSuggestions([]);
  }, [currentLocation]);

  const searchPlaces = async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=5&addressdetails=1`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error searching places:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setShowSuggestions(true);

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new debounce
    debounceRef.current = setTimeout(() => {
      searchPlaces(value);
    }, 300); // 300ms debounce
  };

  const handleSuggestionSelect = (suggestion: SearchResult) => {
    const coordinates: Coordinates = {
      lat: Number.parseFloat(suggestion.lat),
      lng: Number.parseFloat(suggestion.lon),
    };

    setQuery(suggestion.display_name);
    onLocationSelect(suggestion.display_name, coordinates);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for a location..."
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="pl-10 pr-10"
        />
        {isLoading ? (
          <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 " />
        ) : (
          <Button
            onClick={() => setQuery("")}
            variant={"ghost"}
            className="p-0 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
          >
            <CircleX />
          </Button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion.place_id}
              variant="ghost"
              className="w-full justify-start text-left p-3 h-auto hover:bg-gray-50"
              onClick={() => handleSuggestionSelect(suggestion)}
            >
              <MapPin className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
              <span className="text-sm truncate">
                {suggestion.display_name}
              </span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
