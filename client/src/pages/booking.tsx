import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMovie } from '@/hooks/use-movies';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Ticket, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

type SeatCategory = 'Silver' | 'Gold' | 'Platinum';

export default function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: movie, isLoading } = useMovie(id!);
  
  const [selectedCategory, setSelectedCategory] = useState<SeatCategory>('Silver');
  const [numberOfTickets, setNumberOfTickets] = useState(1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Movie Not Found</h2>
          <Button onClick={() => navigate('/movies')}>Back to Movies</Button>
        </div>
      </div>
    );
  }

  const maxTickets = Math.min(10, movie.ticketsRemaining[selectedCategory]);
  const pricePerTicket = movie.ticketPrice[selectedCategory];
  const totalPrice = pricePerTicket * numberOfTickets;

  const handleProceedToPayment = () => {
    if (numberOfTickets === 0) {
      toast.error('Please select at least one ticket');
      return;
    }

    // Navigate to payment page with booking details
    navigate('/payment', {
      state: {
        movieId: movie._id,
        movieTitle: movie.title,
        category: selectedCategory,
        numberOfTickets,
        pricePerTicket,
        totalPrice,
      },
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(`/movies/${id}`)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Movie
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Book Tickets</h1>
          <p className="text-zinc-600">{movie.title}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Movie Info Card */}
          <Card className="md:col-span-1">
            <CardContent className="p-4">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full rounded-lg mb-4"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Poster';
                }}
              />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Ticket className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm text-zinc-600">
                    {movie.ticketsRemaining[selectedCategory]} {selectedCategory} seats remaining
                  </span>
                </div>
                <Badge variant="outline">{movie.genre}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Booking Form */}
          <div className="md:col-span-2 space-y-6">
            {/* Seat Category Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Seat Category</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(['Silver', 'Gold', 'Platinum'] as SeatCategory[]).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedCategory === category
                        ? 'border-zinc-900 bg-zinc-50'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{category}</p>
                        <p className="text-sm text-zinc-600">
                          {movie.ticketsRemaining[category]} seats remaining
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">${movie.ticketPrice[category]}</p>
                        <p className="text-xs text-zinc-500">per ticket</p>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Number of Tickets */}
            <Card>
              <CardHeader>
                <CardTitle>Number of Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setNumberOfTickets(Math.max(1, numberOfTickets - 1))}
                    disabled={numberOfTickets <= 1}
                  >
                    -
                  </Button>
                  <div className="flex-1 text-center">
                    <p className="text-3xl font-bold">{numberOfTickets}</p>
                    <p className="text-sm text-zinc-500">tickets</p>
                  </div>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setNumberOfTickets(Math.min(maxTickets, numberOfTickets + 1))}
                    disabled={numberOfTickets >= maxTickets}
                  >
                    +
                  </Button>
                </div>
                <p className="text-sm text-zinc-500 text-center mt-2">
                  Maximum {maxTickets} tickets per booking
                </p>
              </CardContent>
            </Card>

            {/* Price Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Price Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-zinc-600">Seat Category</span>
                  <span className="font-medium">{selectedCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Price per Ticket</span>
                  <span className="font-medium">${pricePerTicket}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Number of Tickets</span>
                  <span className="font-medium">{numberOfTickets}</span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Amount</span>
                  <div className="text-right">
                    <p className="text-2xl font-bold">${totalPrice}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Proceed to Payment Button */}
            <Button
              size="lg"
              className="w-full"
              onClick={handleProceedToPayment}
              disabled={movie.ticketsRemaining[selectedCategory] === 0}
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Proceed to Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
