import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Movie } from '@/types/movie';

// Fetch all movies
export const useMovies = () => {
  return useQuery<Movie[]>({
    queryKey: ['movies'],
    queryFn: async () => {
      const response = await api.get('/movies');
      return response.data.data?.movies || [];
    },
  });
};

// Fetch movie by ID
export const useMovie = (id: string) => {
  return useQuery<Movie>({
    queryKey: ['movie', id],
    queryFn: async () => {
      const response = await api.get(`/movies/${id}`);
      return response.data.data?.movie;
    },
    enabled: !!id,
  });
};

// Search movies
export const useSearchMovies = (query: string) => {
  return useQuery<Movie[]>({
    queryKey: ['movies', 'search', query],
    queryFn: async () => {
      if (!query.trim()) return [];
      const response = await api.get(`/movies/search?q=${encodeURIComponent(query)}`);
      return response.data.data?.movies || [];
    },
    enabled: query.trim().length > 0,
  });
};

// Fetch upcoming movies
export const useUpcomingMovies = () => {
  return useQuery<Movie[]>({
    queryKey: ['movies', 'upcoming'],
    queryFn: async () => {
      const response = await api.get('/movies/upcoming');
      return response.data.data?.movies || [];
    },
  });
};

// Fetch now showing movies
export const useNowShowingMovies = () => {
  return useQuery<Movie[]>({
    queryKey: ['movies', 'now-showing'],
    queryFn: async () => {
      const response = await api.get('/movies/now-showing');
      return response.data.data?.movies || [];
    },
  });
};

// Fetch nearby movies (requires geolocation)
export const useNearbyMovies = (latitude?: number, longitude?: number) => {
  return useQuery<Movie[]>({
    queryKey: ['movies', 'nearby', latitude, longitude],
    queryFn: async () => {
      if (!latitude || !longitude) return [];
      const response = await api.get(
        `/movies/nearby?latitude=${latitude}&longitude=${longitude}`
      );
      return response.data.data?.movies || [];
    },
    enabled: !!latitude && !!longitude,
  });
};
