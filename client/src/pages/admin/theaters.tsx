import { useState } from 'react';
import { useTheaters, useSearchTheaters } from '@/hooks/use-theaters';
import { TheaterTable } from '@/components/theaters/theater-table';
import { TheaterSearch } from '@/components/theaters/theater-search';

export default function TheatersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: allTheaters = [], isLoading: isLoadingAll } = useTheaters();
  const { data: searchResults = [], isLoading: isSearching } = useSearchTheaters(searchQuery);

  const theaters = searchQuery.trim() ? searchResults : allTheaters;
  const isLoading = searchQuery.trim() ? isSearching : isLoadingAll;

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="mb-4">
            <h1 className="text-3xl font-bold">All Theaters</h1>
            <p className="text-zinc-600">View and manage all theaters in the system</p>
          </div>

          <div className="flex items-center gap-4">
            <TheaterSearch onSearch={setSearchQuery} />
            {searchQuery && (
              <p className="text-sm text-zinc-600">
                {isSearching ? 'Searching...' : `Found ${theaters.length} results`}
              </p>
            )}
          </div>
        </div>

        <TheaterTable theaters={theaters} isLoading={isLoading} />
      </div>
    </div>
  );
}
