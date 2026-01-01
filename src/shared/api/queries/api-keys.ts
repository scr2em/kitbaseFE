import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';

export const API_KEYS_QUERY_KEY = ['apiKeys'];

export function useApiKeysQuery(projectKey: string, page: number = 0, size: number = 20) {
  return useQuery({
    queryKey: [...API_KEYS_QUERY_KEY, projectKey, page, size],
    queryFn: async () => {
      const response = await apiClient.projects.getApiKeys(projectKey, {
        page,
        size,
        sort: 'desc',
      });
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
    enabled: !!projectKey,
  });
}

export function useCreateApiKeyMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ projectKey, name, environmentName }: { projectKey: string; name: string; environmentName: string }) => {
      const response = await apiClient.projects.createApiKey(projectKey, { name, environmentName });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...API_KEYS_QUERY_KEY, variables.projectKey] });
    },
  });
}

export function useDeleteApiKeyMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ projectKey, keyId }: { projectKey: string; keyId: string }) => {
      const response = await apiClient.projects.deleteApiKey(projectKey, keyId);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...API_KEYS_QUERY_KEY, variables.projectKey] });
    },
  });
}
