import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DeleteDialog } from '@/components/shared/delete-dialog';
import { Edit, Trash2, MapPin, Building2 } from 'lucide-react';
import type { Theater } from '@/types/theater';
import { useDeleteTheater } from '@/hooks/use-theaters';

interface TheaterTableProps {
  theaters: Theater[];
  isLoading?: boolean;
}

export function TheaterTable({ theaters, isLoading }: TheaterTableProps) {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const { mutate: deleteTheater, isPending: isDeleting } = useDeleteTheater();

  const handleDelete = (theater: Theater) => {
    setSelectedTheater(theater);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedTheater) {
      deleteTheater(selectedTheater._id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSelectedTheater(null);
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!theaters || theaters.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <Building2 className="h-12 w-12 mx-auto text-zinc-400 mb-3" />
        <p className="text-zinc-500 text-lg">No theaters found</p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Screens</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {theaters.map((theater) => (
              <TableRow key={theater._id}>
                <TableCell className="font-medium">{theater.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-zinc-600">
                    <MapPin className="h-3 w-3" />
                    {theater.location}
                  </div>
                </TableCell>
                <TableCell>{theater.city}</TableCell>
                <TableCell>{theater.screens}</TableCell>
                <TableCell>{theater.capacity}</TableCell>
                <TableCell>
                  <Badge variant={theater.isActive ? 'default' : 'secondary'}>
                    {theater.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/admin/theaters/${theater._id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(theater)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Theater"
        description={`Are you sure you want to delete "${selectedTheater?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </>
  );
}
