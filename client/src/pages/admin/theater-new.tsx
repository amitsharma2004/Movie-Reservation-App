import { useNavigate } from 'react-router-dom';
import { useCreateTheater } from '@/hooks/use-theaters';
import { TheaterForm } from '@/components/theaters/theater-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { TheaterFormData } from '@/types/theater';

export default function NewTheaterPage() {
  const navigate = useNavigate();
  const { mutate: createTheater, isPending } = useCreateTheater();

  const handleSubmit = (data: TheaterFormData) => {
    createTheater(data, {
      onSuccess: () => {
        navigate('/admin/theaters');
      },
    });
  };

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
          <h1 className="text-3xl font-bold mb-2">Create New Theater</h1>
          <p className="text-zinc-600">Add a new theater to the system</p>
        </div>

        <TheaterForm onSubmit={handleSubmit} isLoading={isPending} />
      </div>
    </div>
  );
}
