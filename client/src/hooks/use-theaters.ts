import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Theater, TheaterFormData } from '@/types/theater';
import { toast } from 'sonner';

// Fetch all theaters
export const useTheaters = (filters?: { city?: string; isActive?: boolean }) => {
  return useQuery<Theater[]>({
    queryKey: ['theaters', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.city) params.append('city', filters.city);
      if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
      
      const response = await api.get(`/theaters/getall?${params.toString()}`);
      return response.data.data?.theaters || [];
    },
  });
};

// Fetch pending theaters (Admin only)
export const usePendingTheaters = () => {
  return useQuery<Theater[]>({
    queryKey: ['theaters', 'pending'],
    queryFn: async () => {
      const response = await api.get('/theaters/pending');
      return response.data.data?.theaters || [];
    },
  });
};

// Fetch theater by ID
export const useTheater = (id: string) => {
  return useQuery<Theater>({
    queryKey: ['theater', id],
    queryFn: async () => {
      const response = await api.get(`/theaters/get/${id}`);
      return response.data.data?.theater;
    },
    enabled: !!id,
  });
};

// Search theaters
export const useSearchTheaters = (query: string) => {
  return useQuery<Theater[]>({
    queryKey: ['theaters', 'search', query],
    queryFn: async () => {
      if (!query.trim()) return [];
      const response = await api.get(`/theaters/search?q=${encodeURIComponent(query)}`);
      return response.data.data?.theaters || [];
    },
    enabled: query.trim().length > 0,
  });
};

// Create theater
export const useCreateTheater = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: TheaterFormData) => {
      const response = await api.post('/theaters/create', data);
      return response.data.data?.theater;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theaters'] });
      toast.success('Theater created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create theater');
    },
  });
};

// Update theater
export const useUpdateTheater = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TheaterFormData }) => {
      const response = await api.put(`/theaters/update/${id}`, data);
      return response.data.data?.theater;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['theaters'] });
      queryClient.invalidateQueries({ queryKey: ['theater', variables.id] });
      toast.success('Theater updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update theater');
    },
  });
};

// Delete theater
export const useDeleteTheater = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/theaters/delete/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theaters'] });
      toast.success('Theater deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete theater');
    },
  });
};

// Approve theater (Admin only)
export const useApproveTheater = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.put(`/theaters/approve/${id}`);
      return response.data.data?.theater;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theaters'] });
      toast.success('Theater approved successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to approve theater');
    },
  });
};

// Reject theater (Admin only)
export const useRejectTheater = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const response = await api.put(`/theaters/reject/${id}`, { reason });
      return response.data.data?.theater;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theaters'] });
      toast.success('Theater rejected');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reject theater');
    },
  });
};
