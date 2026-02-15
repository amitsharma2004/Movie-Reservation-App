import { useState } from 'react';
import { useNearbyMovies } from '@/hooks/use-movies';
import { MovieGrid } from './movie-grid';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function NearbyShows() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  const { data: movies = [], isLoading } = useNearbyMovies(
    location?.latitude,
    location?.longitude
  );

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsGettingLocation(false);
        toast.success('Location detected successfully');
      },
      (error) => {
        setIsGettingLocation(false);
        let message = 'Failed to get location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location permission denied';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out';
            break;
        }
        
        toast.error(message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  if (!location) {
    return (
      <div className="text-center py-12 space-y-4">
        <MapPin className="h-12 w-12 mx-auto text-zinc-400" />
        <div>
          <h3 className="text-lg font-semibold mb-2">Find Movies Near You</h3>
          <p className="text-zinc-600 mb-4">
            Enable location access to see movies playing nearby
          </p>
          <Button onClick={getLocation} disabled={isGettingLocation}>
            {isGettingLocation ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting location...
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-4 w-4" />
                Enable Location
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-zinc-600">
          <MapPin className="h-4 w-4" />
          <span>Showing movies near your location</span>
        </div>
        <Button variant="outline" size="sm" onClick={getLocation}>
          Refresh Location
        </Button>
      </div>
      
      <MovieGrid movies={movies} isLoading={isLoading} />
    </div>
  );
}
