import { useMutation, useInfiniteQuery, useQueryClient, useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { CreateFeatureFlagSegmentRequest, UpdateFeatureFlagSegmentRequest } from '../../../generated-api';

export const FEATURE_FLAG_SEGMENTS_QUERY_KEY = 'feature-flag-segments';

export const getFeatureFlagSegmentsQueryKey = (projectKey: string, environmentId: string) => [
  FEATURE_FLAG_SEGMENTS_QUERY_KEY,
  projectKey,
  environmentId,
];

export function useFeatureFlagSegmentsInfiniteQuery(projectKey: string, environmentId: string) {
  return useInfiniteQuery({
    queryKey: getFeatureFlagSegmentsQueryKey(projectKey, environmentId),
    queryFn: async ({ pageParam = 0 }) => {
      const response = await apiClient.projects.listFeatureFlagSegments(projectKey, environmentId, {
        page: pageParam,
        size: 20,
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

export function useFeatureFlagSegmentQuery(projectKey: string, environmentId: string, segmentId: string) {
  return useQuery({
    queryKey: [FEATURE_FLAG_SEGMENTS_QUERY_KEY, projectKey, environmentId, segmentId],
    queryFn: async () => {
      const response = await apiClient.projects.getFeatureFlagSegment(projectKey, environmentId, segmentId);
      return response.data;
    },
    enabled: !!projectKey && !!environmentId && !!segmentId,
  });
}

export function useCreateFeatureFlagSegmentMutation(projectKey: string, environmentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFeatureFlagSegmentRequest) => {
      const response = await apiClient.projects.createFeatureFlagSegment(projectKey, environmentId, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getFeatureFlagSegmentsQueryKey(projectKey, environmentId) });
    },
  });
}

export function useUpdateFeatureFlagSegmentMutation(projectKey: string, environmentId: string, segmentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateFeatureFlagSegmentRequest) => {
      const response = await apiClient.projects.updateFeatureFlagSegment(projectKey, environmentId, segmentId, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getFeatureFlagSegmentsQueryKey(projectKey, environmentId) });
      queryClient.invalidateQueries({ queryKey: [FEATURE_FLAG_SEGMENTS_QUERY_KEY, projectKey, environmentId, segmentId] });
    },
  });
}

export function useDeleteFeatureFlagSegmentMutation(projectKey: string, environmentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (segmentId: string) => {
      const response = await apiClient.projects.deleteFeatureFlagSegment(projectKey, environmentId, segmentId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getFeatureFlagSegmentsQueryKey(projectKey, environmentId) });
    },
  });
}
