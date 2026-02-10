import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Movie } from '@/types/movie';
import { format } from 'date-fns';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const navigate = useNavigate();

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch {
      return 'TBA';
    }
  };

  const isUpcoming = new Date(movie.releaseDate) > new Date();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      <div
        onClick={() => navigate(`/movies/${movie._id}`)}
        className="relative aspect-[2/3] overflow-hidden bg-zinc-200"
      >
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Poster';
          }}
        />
        <div className="absolute top-2 right-2">
          <Badge variant={isUpcoming ? 'secondary' : 'default'}>
            {isUpcoming ? 'Upcoming' : 'Now Showing'}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1 mb-2">{movie.title}</h3>
        
        <div className="space-y-2 text-sm text-zinc-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(movie.releaseDate)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{movie.duration} mins</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4" />
            <span>{movie.ticketsRemaining} tickets left</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mt-3">
          <Badge variant="outline" className="text-xs">
            {movie.genre}
          </Badge>
          {movie.languages.slice(0, 2).map((lang) => (
            <Badge key={lang} variant="outline" className="text-xs">
              {lang}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={() => navigate(`/movies/${movie._id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
