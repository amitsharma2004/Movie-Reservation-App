import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheaters, useSearchTheaters } from '@/hooks/use-theaters';
import { TheaterTable } from '@/components/theaters/theater-table';
import { TheaterSearch } from '@/components/theaters/theater-search';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function TheatersPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: allTheaters = [], isLoading: isLoadingAll } = useTheaters();
  const { data: searchResults = [], isLoading: isSearching } = useSearchTheaters(searchQuery);

  const theaters = searchQuery.trim() ? searchResults : allTheaters;
  const isLoading = searchQuery.trim() ? isSearching : isLoadingAll;

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Theater Management</h1>
              <p className="text-zinc-600">Manage all theaters in the system</p>
            </div>
            <Button onClick={() => navigate('/admin/theaters/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Theater
            </Button>
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
