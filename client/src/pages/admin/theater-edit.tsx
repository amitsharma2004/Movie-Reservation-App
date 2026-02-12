import { useParams, useNavigate } from 'react-router-dom';
import { useTheater, useUpdateTheater } from '@/hooks/use-theaters';
import { TheaterForm } from '@/components/theaters/theater-form';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import type { TheaterFormData } from '@/types/theater';

export default function EditTheaterPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: theater, isLoading } = useTheater(id!);
  const { mutate: updateTheater, isPending } = useUpdateTheater();

  const handleSubmit = (data: TheaterFormData) => {
    if (id) {
      updateTheater({ id, data }, {
        onSuccess: () => {
          navigate('/admin/theaters');
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton className="h-10 w-48 mb-6" />
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!theater) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Theater Not Found</h2>
          <p className="text-zinc-600 mb-4">The theater you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/admin/theaters')}>Back to Theaters</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/theaters')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Theaters
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edit Theater</h1>
          <p className="text-zinc-600">Update theater information</p>
        </div>

        <TheaterForm
          theater={theater}
          onSubmit={handleSubmit}
          isLoading={isPending}
        />
      </div>
    </div>
  );
}
