import { useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { CreateEnvironmentRequest, UpdateEnvironmentRequest } from '../../../generated-api';

export const getEnvironmentsQueryKey = (projectKey: string) => ['environments', projectKey];

export function useEnvironmentsInfiniteQuery(projectKey: string) {
  return useInfiniteQuery({
    queryKey: getEnvironmentsQueryKey(projectKey),
    queryFn: async ({ pageParam = 0 }) => {
      const response = await apiClient.projects.listEnvironments(projectKey, {
        page: pageParam,
        size: 20,
        sort: 'desc',
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

export function useCreateEnvironmentMutation(projectKey: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateEnvironmentRequest) => {
      const response = await apiClient.projects.createEnvironment(projectKey, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getEnvironmentsQueryKey(projectKey) });
    },
  });
}

export function useUpdateEnvironmentMutation(projectKey: string, environmentId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UpdateEnvironmentRequest) => {
      const response = await apiClient.projects.updateEnvironment(projectKey, environmentId, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getEnvironmentsQueryKey(projectKey) });
    },
  });
}

export function useDeleteEnvironmentMutation(projectKey: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (environmentName: string) => {
      const response = await apiClient.projects.deleteEnvironment(projectKey, environmentName);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getEnvironmentsQueryKey(projectKey) });
    },
  });
}






