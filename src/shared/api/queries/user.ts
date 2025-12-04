import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';

export const USER_QUERY_KEY = ['currentUser'];

export function useCurrentUserQuery(enabled = true) {
  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      const response = await apiClient.auth.getCurrentUser();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled,
    retry: false,
  });
}

export function useInvalidateUser() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
}

