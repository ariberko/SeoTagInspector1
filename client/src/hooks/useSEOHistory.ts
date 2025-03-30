import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { SEOHistory, SEOTask } from '@shared/schema';

export function useSEOHistory(url: string | null) {
  return useQuery({
    queryKey: ['/api/history', url],
    queryFn: async () => {
      if (!url) return [] as SEOHistory[];
      const encodedUrl = encodeURIComponent(url);
      const result = await apiRequest(`/api/history/${encodedUrl}`);
      return result as SEOHistory[];
    },
    enabled: !!url,
  });
}

export function useSEOTasks(url: string | null) {
  const fetchTasks = useQuery({
    queryKey: ['/api/tasks', url],
    queryFn: async () => {
      if (!url) return [] as SEOTask[];
      const encodedUrl = encodeURIComponent(url);
      const result = await apiRequest(`/api/tasks/${encodedUrl}`);
      return result as SEOTask[];
    },
    enabled: !!url,
  });

  const createTask = useMutation({
    mutationFn: async (task: Omit<SEOTask, 'id' | 'createdAt' | 'updatedAt'>) => {
      const result = await apiRequest('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      return result as SEOTask[];
    },
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ['/api/tasks', url] });
    },
  });

  return {
    tasks: fetchTasks,
    createTask,
  };
}

export function useExportData(url: string | null) {
  return useQuery({
    queryKey: ['/api/export', url],
    queryFn: async () => {
      if (!url) return null;
      const encodedUrl = encodeURIComponent(url);
      const result = await apiRequest(`/api/export/${encodedUrl}`);
      return result;
    },
    enabled: false, // Only run when explicitly requested
  });
}