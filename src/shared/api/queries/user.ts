import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { UpdateUserRequest } from '../../../generated-api';

export const USER_QUERY_KEY = ['currentUser'];

export function useCurrentUserQuery(enabled = true) {
  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      const response = await apiClient.users.getCurrentUser();
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

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UpdateUserRequest) => {
      const response = await apiClient.users.updateCurrentUser(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
}

