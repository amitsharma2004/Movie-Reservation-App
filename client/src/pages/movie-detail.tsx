import { useParams, useNavigate } from 'react-router-dom';
import { useMovie } from '@/hooks/use-movies';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, Clock, Ticket, Users, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: movie, isLoading, error } = useMovie(id!);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid md:grid-cols-3 gap-8">
            <Skeleton className="aspect-[2/3] w-full" />
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Movie Not Found</h2>
          <p className="text-zinc-600 mb-4">The movie you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/movies')}>Back to Movies</Button>
        </div>
      </div>
    );
  }

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), 'MMMM dd, yyyy');
    } catch {
      return 'TBA';
    }
  };

  const isUpcoming = new Date(movie.releaseDate) > new Date();

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/movies')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Movies
        </Button>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="sticky top-8">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-zinc-200 shadow-lg">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Poster';
                  }}
                />
                <div className="absolute top-4 right-4">
                  <Badge variant={isUpcoming ? 'secondary' : 'default'}>
                    {isUpcoming ? 'Upcoming' : 'Now Showing'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{movie.genre}</Badge>
                {movie.languages.map((lang) => (
                  <Badge key={lang} variant="outline">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Movie Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-zinc-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-zinc-500">Release Date</p>
                      <p className="font-medium">{formatDate(movie.releaseDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-zinc-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-zinc-500">Duration</p>
                      <p className="font-medium">{movie.duration} minutes</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Ticket className="h-5 w-5 text-zinc-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-zinc-500">Tickets Available</p>
                      <p className="font-medium">{movie.ticketsRemaining} / {movie.totalTickets.Silver + movie.totalTickets.Gold + movie.totalTickets.Platinum}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-zinc-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-zinc-500">Tickets Sold</p>
                      <p className="font-medium">{movie.totalTicketsSold}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-zinc-700 leading-relaxed">{movie.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Cast</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map((actor, index) => (
                    <Badge key={index} variant="secondary">
                      {actor}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Ticket Prices</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-zinc-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-zinc-500">Silver</p>
                      <p className="font-medium text-lg">${movie.ticketPrice.Silver}</p>
                      <p className="text-xs text-zinc-500">{movie.totalTickets.Silver} seats</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-zinc-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-zinc-500">Gold</p>
                      <p className="font-medium text-lg">${movie.ticketPrice.Gold}</p>
                      <p className="text-xs text-zinc-500">{movie.totalTickets.Gold} seats</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-zinc-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-zinc-500">Platinum</p>
                      <p className="font-medium text-lg">${movie.ticketPrice.Platinum}</p>
                      <p className="text-xs text-zinc-500">{movie.totalTickets.Platinum} seats</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button size="lg" className="flex-1" disabled={movie.ticketsRemaining === 0}>
                {movie.ticketsRemaining === 0 ? 'Sold Out' : 'Book Tickets'}
              </Button>
              {movie.video_url && (
                <Button size="lg" variant="outline">
                  Watch Trailer
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
