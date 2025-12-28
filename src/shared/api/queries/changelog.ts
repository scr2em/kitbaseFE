import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { CreateChangelogRequest, UpdateChangelogRequest } from '../../../generated-api';

export const getChangelogsQueryKey = (projectKey: string) => ['changelogs', projectKey];

export function useChangelogsQuery(projectKey: string, page: number = 0, size: number = 10) {
  return useQuery({
    queryKey: [...getChangelogsQueryKey(projectKey), page, size],
    queryFn: async () => {
      const response = await apiClient.projects.listChangelogs(projectKey, {
        page,
        size,
        sort: 'desc',
      });
      return response.data;
    },
    staleTime: 30 * 1000,
    enabled: !!projectKey,
  });
}

export function useChangelogQuery(projectKey: string, changelogId: string) {
  return useQuery({
    queryKey: [...getChangelogsQueryKey(projectKey), changelogId],
    queryFn: async () => {
      const response = await apiClient.projects.getChangelog(projectKey, changelogId);
      return response.data;
    },
    enabled: !!projectKey && !!changelogId,
  });
}

export function useCreateChangelogMutation(projectKey: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateChangelogRequest) => {
      const response = await apiClient.projects.createChangelog(projectKey, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getChangelogsQueryKey(projectKey),
      });
    },
  });
}

export function useUpdateChangelogMutation(projectKey: string, changelogId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateChangelogRequest) => {
      const response = await apiClient.projects.updateChangelog(projectKey, changelogId, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getChangelogsQueryKey(projectKey),
      });
    },
  });
}

export function useDeleteChangelogMutation(projectKey: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (changelogId: string) => {
      const response = await apiClient.projects.deleteChangelog(projectKey, changelogId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getChangelogsQueryKey(projectKey),
      });
    },
  });
}
