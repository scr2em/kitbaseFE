import { useMutation, useInfiniteQuery, useQueryClient, useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { CreateFeatureFlagRequest, UpdateFeatureFlagRequest, UpdateFeatureFlagRulesRequest } from '../../../generated-api';

export const FEATURE_FLAGS_QUERY_KEY = 'feature-flags';

export const getFeatureFlagsQueryKey = (projectKey: string, environmentId: string) => [
  FEATURE_FLAGS_QUERY_KEY,
  projectKey,
  environmentId,
];

export function useFeatureFlagsInfiniteQuery(projectKey: string, environmentId: string) {
  return useInfiniteQuery({
    queryKey: getFeatureFlagsQueryKey(projectKey, environmentId),
    queryFn: async ({ pageParam = 0 }) => {
      const response = await apiClient.projects.listFeatureFlags(projectKey, environmentId, {
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
    enabled: !!projectKey && !!environmentId,
  });
}

export function useFeatureFlagQuery(projectKey: string, environmentId: string, flagKey: string) {
  return useQuery({
    queryKey: [FEATURE_FLAGS_QUERY_KEY, projectKey, environmentId, flagKey],
    queryFn: async () => {
      const response = await apiClient.projects.getFeatureFlag(projectKey, environmentId, flagKey);
      return response.data;
    },
    enabled: !!projectKey && !!environmentId && !!flagKey,
  });
}

export function useCreateFeatureFlagMutation(projectKey: string, environmentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFeatureFlagRequest) => {
      const response = await apiClient.projects.createFeatureFlag(projectKey, environmentId, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getFeatureFlagsQueryKey(projectKey, environmentId) });
    },
  });
}

export function useUpdateFeatureFlagMutation(projectKey: string, environmentId: string, flagKey: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateFeatureFlagRequest) => {
      const response = await apiClient.projects.updateFeatureFlag(projectKey, environmentId, flagKey, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getFeatureFlagsQueryKey(projectKey, environmentId) });
      queryClient.invalidateQueries({ queryKey: [FEATURE_FLAGS_QUERY_KEY, projectKey, environmentId, flagKey] });
    },
  });
}

export function useDeleteFeatureFlagMutation(projectKey: string, environmentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { flagKey: string; deleteAllEnvironments?: boolean }) => {
      const response = await apiClient.projects.deleteFeatureFlag(projectKey, environmentId, input.flagKey, {
        deleteAllEnvironments: input.deleteAllEnvironments,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FEATURE_FLAGS_QUERY_KEY, projectKey] });
    },
  });
}

export function useUpdateFeatureFlagRulesMutation(projectKey: string, environmentId: string, flagKey: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateFeatureFlagRulesRequest) => {
      const response = await apiClient.projects.updateFeatureFlagRules(projectKey, environmentId, flagKey, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FEATURE_FLAGS_QUERY_KEY, projectKey, environmentId, flagKey] });
    },
  });
}

export const FEATURE_FLAG_USAGE_QUERY_KEY = 'feature-flag-usage';

export function useFeatureFlagUsageQuery({projectKey, fromDate, toDate}: {projectKey: string, fromDate: string, toDate: string}) {
  return useQuery({
    queryKey: [FEATURE_FLAG_USAGE_QUERY_KEY, projectKey, fromDate, toDate],
    queryFn: async () => {
      const response = await apiClient.featureFlags.getFeatureFlagUsage({
        projectKey,
        fromDate,
        toDate,
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!projectKey && !!fromDate && !!toDate,
  });
}
