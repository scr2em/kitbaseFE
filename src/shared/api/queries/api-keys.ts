import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';

export const API_KEYS_QUERY_KEY = ['apiKeys'];

export function useApiKeysQuery(bundleId: string, page: number = 0, size: number = 20) {
  return useQuery({
    queryKey: [...API_KEYS_QUERY_KEY, bundleId, page, size],
    queryFn: async () => {
      const response = await apiClient.bundleId.getApiKeys(bundleId, {
        page,
        size,
        sort: 'desc',
      });
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
    enabled: !!bundleId,
  });
}

export function useCreateApiKeyMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ bundleId, name }: { bundleId: string; name: string }) => {
      const response = await apiClient.bundleId.createApiKey(bundleId, { name });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...API_KEYS_QUERY_KEY, variables.bundleId] });
    },
  });
}

export function useDeleteApiKeyMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ bundleId, keyId }: { bundleId: string; keyId: string }) => {
      const response = await apiClient.bundleId.deleteApiKey(bundleId, keyId);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...API_KEYS_QUERY_KEY, variables.bundleId] });
    },
  });
}

