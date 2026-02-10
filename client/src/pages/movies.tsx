import { useState } from 'react';
import { useMovies, useNowShowingMovies, useUpcomingMovies, useSearchMovies } from '@/hooks/use-movies';
import { MovieGrid } from '@/components/movies/movie-grid';
import { SearchBar } from '@/components/movies/search-bar';
import { CategoryFilter } from '@/components/movies/category-filter';
import { NearbyShows } from '@/components/movies/nearby-shows';
import type { MovieCategory } from '@/types/movie';

export default function MoviesPage() {
  const [activeCategory, setActiveCategory] = useState<MovieCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: allMovies = [], isLoading: isLoadingAll } = useMovies();
  const { data: nowShowingMovies = [], isLoading: isLoadingNowShowing } = useNowShowingMovies();
  const { data: upcomingMovies = [], isLoading: isLoadingUpcoming } = useUpcomingMovies();
  const { data: searchResults = [], isLoading: isSearching } = useSearchMovies(searchQuery);

  const getMovies = () => {
    if (searchQuery.trim()) {
      return searchResults;
    }

    switch (activeCategory) {
      case 'now-showing':
        return nowShowingMovies;
      case 'upcoming':
        return upcomingMovies;
      default:
        return allMovies;
    }
  };

  const getIsLoading = () => {
    if (searchQuery.trim()) {
      return isSearching;
    }

    switch (activeCategory) {
      case 'now-showing':
        return isLoadingNowShowing;
      case 'upcoming':
        return isLoadingUpcoming;
      default:
        return isLoadingAll;
    }
  };

  const movies = getMovies();
  const isLoading = getIsLoading();

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Movies</h1>
          <p className="text-zinc-600">Browse and book your favorite movies</p>
        </div>

        <div className="space-y-6">
          <SearchBar onSearch={setSearchQuery} />

          {!searchQuery && (
            <CategoryFilter
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          )}

          {searchQuery ? (
            <div>
              <p className="text-sm text-zinc-600 mb-4">
                {isSearching ? 'Searching...' : `Found ${movies.length} results for "${searchQuery}"`}
              </p>
              <MovieGrid movies={movies} isLoading={isLoading} />
            </div>
          ) : activeCategory === 'all' ? (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">All Movies</h2>
                <MovieGrid movies={movies} isLoading={isLoading} />
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Nearby Shows</h2>
                <NearbyShows />
              </div>
            </div>
          ) : (
            <MovieGrid movies={movies} isLoading={isLoading} />
          )}
        </div>
      </div>
    </div>
  );
}
