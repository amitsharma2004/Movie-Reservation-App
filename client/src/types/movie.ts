export interface Movie {
  _id: string;
  title: string;
  description: string;
  cast: string[];
  duration: number;
  ticketsRemaining: {
    Silver: number;
    Gold: number;
    Platinum: number;
  };
  releaseDate: string;
  languages: string[];
  genre: string;
  poster: string;
  video_url?: string;
  totalTickets: {
    Silver: number;
    Gold: number;
    Platinum: number;
  };
  totalTicketsSold: number;
  totalRates: number;
  ticketPrice: {
    Silver: number;
    Gold: number;
    Platinum: number;
  };
  showTime?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MoviesResponse {
  success: boolean;
  message: string;
  data: Movie[];
}

export interface MovieResponse {
  success: boolean;
  message: string;
  data: Movie;
}

export type MovieCategory = 'all' | 'now-showing' | 'upcoming';
