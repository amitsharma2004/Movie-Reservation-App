import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { MovieCategory } from '@/types/movie';

interface CategoryFilterProps {
  activeCategory: MovieCategory;
  onCategoryChange: (category: MovieCategory) => void;
}

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <Tabs className="w-full">
      <TabsList className="w-full sm:w-auto">
        <TabsTrigger
          active={activeCategory === 'all'}
          onClick={() => onCategoryChange('all')}
        >
          All Movies
        </TabsTrigger>
        <TabsTrigger
          active={activeCategory === 'now-showing'}
          onClick={() => onCategoryChange('now-showing')}
        >
          Now Showing
        </TabsTrigger>
        <TabsTrigger
          active={activeCategory === 'upcoming'}
          onClick={() => onCategoryChange('upcoming')}
        >
          Upcoming
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
