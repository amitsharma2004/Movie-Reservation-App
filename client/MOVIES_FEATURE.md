# Movies Feature Documentation

## Overview
Complete movie browsing and detail viewing system with search, filtering, and geolocation features.

## File Structure

```
client/src/
├── components/
│   └── movies/
│       ├── category-filter.tsx      # Filter tabs (All, Now Showing, Upcoming)
│       ├── movie-card.tsx           # Individual movie card component
│       ├── movie-grid.tsx           # Responsive grid layout with loading states
│       ├── nearby-shows.tsx         # Geolocation-based movie finder
│       └── search-bar.tsx           # Debounced search input
├── hooks/
│   └── use-movies.ts                # React Query hooks for movie data
├── pages/
│   ├── movies.tsx                   # Main movies listing page
│   └── movie-detail.tsx             # Individual movie detail page
└── types/
    └── movie.ts                     # TypeScript interfaces
```

## Features Implemented

### 1. Movies Listing Page (`/movies`)
- **All Movies View**: Display all available movies
- **Category Filters**: 
  - All Movies
  - Now Showing (currently playing)
  - Upcoming (future releases)
- **Search**: Debounced search with 300ms delay
- **Nearby Shows**: Geolocation-based movie discovery

### 2. Movie Detail Page (`/movies/:id`)
- Complete movie information
- Poster image with fallback
- Release date and duration
- Available tickets count
- Cast members
- Ticket pricing (Silver, Gold, Platinum)
- Genre and language badges
- Book tickets button (disabled when sold out)
- Trailer link (if available)

### 3. Components

#### MovieCard
- Responsive card design
- Hover effects
- Badge for upcoming/now showing status
- Quick info: date, duration, tickets
- Genre and language tags
- Click to view details

#### MovieGrid
- Responsive grid layout (1-4 columns based on screen size)
- Loading skeletons
- Empty state handling

#### SearchBar
- Debounced input (300ms)
- Clear button
- Search icon
- Responsive width

#### CategoryFilter
- Tab-based navigation
- Active state styling
- Mobile responsive

#### NearbyShows
- Geolocation permission request
- Location-based movie filtering
- Refresh location button
- Error handling for location services

### 4. Data Fetching Hooks

All hooks use React Query for caching and state management:

- `useMovies()` - Fetch all movies
- `useMovie(id)` - Fetch single movie by ID
- `useSearchMovies(query)` - Search movies with debouncing
- `useUpcomingMovies()` - Fetch upcoming releases
- `useNowShowingMovies()` - Fetch currently showing movies
- `useNearbyMovies(lat, lng)` - Fetch location-based movies

## API Endpoints Used

```
GET /api/movies                              # All movies
GET /api/movies/search?q={query}             # Search movies
GET /api/movies/upcoming                     # Upcoming releases
GET /api/movies/now-showing                  # Current releases
GET /api/movies/nearby?latitude=X&longitude=Y # Location-based
GET /api/movies/:id                          # Single movie details
```

## Design Features

- Clean, minimal design (no gradients)
- Neutral zinc/gray color palette
- Responsive layouts for all screen sizes
- Loading states with skeleton screens
- Error handling and fallbacks
- Smooth transitions and hover effects

## Usage

### Navigate to Movies
```typescript
navigate('/movies')
```

### View Movie Details
```typescript
navigate(`/movies/${movieId}`)
```

### Search Movies
Type in the search bar - results update automatically after 300ms

### Filter by Category
Click on category tabs: All Movies, Now Showing, or Upcoming

### Enable Nearby Shows
1. Scroll to "Nearby Shows" section
2. Click "Enable Location"
3. Grant location permission
4. View movies near your location

## Dependencies

- `@tanstack/react-query` - Data fetching and caching
- `date-fns` - Date formatting
- `lucide-react` - Icons
- `react-router-dom` - Routing
- `sonner` - Toast notifications

## Movie Data Structure

```typescript
interface Movie {
  _id: string;
  title: string;
  description: string;
  cast: string[];
  duration: number;
  ticketsRemaining: number;
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
  ticketPrice: {
    Silver: number;
    Gold: number;
    Platinum: number;
  };
  showTime?: string;
}
```

## Future Enhancements

- Ticket booking functionality
- Movie ratings and reviews
- Trailer video player
- Advanced filters (genre, language, price range)
- Favorites/watchlist
- Booking history
