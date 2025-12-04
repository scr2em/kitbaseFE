import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { CreateMobileApplicationRequest } from '../../../generated-api';

export const MOBILE_APPS_QUERY_KEY = ['mobileApplications'];

export function useMobileAppsQuery() {
  return useQuery({
    queryKey: MOBILE_APPS_QUERY_KEY,
    queryFn: async () => {
      const response = await apiClient.apps.listApplications();
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useCreateMobileAppMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateMobileApplicationRequest) => {
      const response = await apiClient.apps.createApplication(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MOBILE_APPS_QUERY_KEY });
    },
  });
}

export function useMobileAppQuery(appId: string) {
  return useQuery({
    queryKey: [...MOBILE_APPS_QUERY_KEY, appId],
    queryFn: async () => {
      const response = await apiClient.apps.getApplication(appId);
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
    enabled: !!appId,
  });
}

export function useDeleteMobileAppMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (appId: string) => {
      await apiClient.apps.deleteApplication(appId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MOBILE_APPS_QUERY_KEY });
    },
  });
}
