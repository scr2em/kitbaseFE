import { useMutation, useInfiniteQuery, useQueryClient, useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { CreateOtaUpdateRequest, UpdateOtaUpdateRequest } from '../../../generated-api';

export const OTA_UPDATES_QUERY_KEY = 'ota-updates';

export const getOtaUpdatesQueryKey = (projectKey: string) => [OTA_UPDATES_QUERY_KEY, projectKey];

export function useOtaUpdatesInfiniteQuery(projectKey: string, environmentId?: string) {
  return useInfiniteQuery({
    queryKey: [...getOtaUpdatesQueryKey(projectKey), environmentId],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await apiClient.projects.listOtaUpdates(projectKey, {
        page: pageParam,
        size: 20,
        sort: 'desc',
        environmentId,
      });
      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.page + 1 < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 30 * 1000,
    enabled: !!projectKey,
  });
}

export function useOtaUpdateQuery(projectKey: string, otaUpdateId: string) {
  return useQuery({
    queryKey: [OTA_UPDATES_QUERY_KEY, projectKey, otaUpdateId],
    queryFn: async () => {
      const response = await apiClient.projects.getOtaUpdate(projectKey, otaUpdateId);
      return response.data;
    },
    enabled: !!projectKey && !!otaUpdateId,
  });
}

export function useCreateOtaUpdateMutation(projectKey: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateOtaUpdateRequest) => {
      const response = await apiClient.projects.createOtaUpdate(projectKey, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getOtaUpdatesQueryKey(projectKey) });
    },
  });
}

export function useUpdateOtaUpdateMutation(projectKey: string, otaUpdateId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UpdateOtaUpdateRequest) => {
      const response = await apiClient.projects.updateOtaUpdate(projectKey, otaUpdateId, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getOtaUpdatesQueryKey(projectKey) });
    },
  });
}

export function useDeleteOtaUpdateMutation(projectKey: string) {
  const queryClient = useQueryClient();
      
  return useMutation({
    mutationFn: async (otaUpdateId: string) => {
      const response = await apiClient.projects.deleteOtaUpdate(projectKey, otaUpdateId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getOtaUpdatesQueryKey(projectKey) });
    },
  });
}

