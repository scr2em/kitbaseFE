import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { CreateMobileApplicationRequest } from '../../../generated-api';

export const MOBILE_APPS_QUERY_KEY = ['mobileApplications'];

export function useMobileAppsQuery(organizationId: string) {
  return useQuery({
    queryKey: [...MOBILE_APPS_QUERY_KEY, organizationId],
    queryFn: async () => {
      const response = await apiClient.organizations.listApplications(organizationId);
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
    enabled: !!organizationId,
  });
}

export function useCreateMobileAppMutation(organizationId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateMobileApplicationRequest) => {
      const response = await apiClient.organizations.createApplication(organizationId, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...MOBILE_APPS_QUERY_KEY, organizationId] });
    },
  });
}

export function useMobileAppQuery(organizationId: string, appId: string) {
  return useQuery({
    queryKey: [...MOBILE_APPS_QUERY_KEY, organizationId, appId],
    queryFn: async () => {
      const response = await apiClient.organizations.getApplication(organizationId, appId);
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
    enabled: !!organizationId && !!appId,
  });
}

export function useDeleteMobileAppMutation(organizationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (appId: string) => {
      await apiClient.organizations.deleteApplication(organizationId, appId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...MOBILE_APPS_QUERY_KEY, organizationId] });
    },
  });
}
