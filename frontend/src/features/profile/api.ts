import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '../../lib/api/client.js';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => client.get('/profile').then(r => r.data.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: any) => client.patch('/profile', body).then(r => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }),
  });
}
