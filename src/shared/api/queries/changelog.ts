import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { Changelog, ChangelogListResponse } from '../../../features/projects/model/changelog-schema';

export const CHANGELOG_QUERY_KEY = ['changelogs'];

export function useChangelogsQuery(projectKey: string, page: number = 0, size: number = 10) {
  return useQuery({
    queryKey: [...CHANGELOG_QUERY_KEY, projectKey, page, size],
    queryFn: async () => {
      const response = await axios.get<ChangelogListResponse>(
        `/api/projects/${projectKey}/changelogs`,
        { params: { page, size } }
      );
      return response.data;
    },
    staleTime: 30 * 1000,
    enabled: !!projectKey,
  });
}

export function useChangelogQuery(projectKey: string, id: string) {
  return useQuery({
    queryKey: [...CHANGELOG_QUERY_KEY, projectKey, id],
    queryFn: async () => {
      const response = await axios.get<Changelog>(
        `/api/projects/${projectKey}/changelogs/${id}`
      );
      return response.data;
    },
    enabled: !!projectKey && !!id,
  });
}

export function useCreateChangelogMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectKey,
      version,
      markdown,
      is_published,
    }: {
      projectKey: string;
      version: string;
      markdown: string;
      is_published: boolean;
    }) => {
      const response = await axios.post<Changelog>(
        `/api/projects/${projectKey}/changelogs`,
        { version, markdown, is_published }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...CHANGELOG_QUERY_KEY, variables.projectKey],
      });
    },
  });
}

export function useUpdateChangelogMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectKey,
      id,
      version,
      markdown,
      is_published,
    }: {
      projectKey: string;
      id: string;
      version: string;
      markdown: string;
      is_published: boolean;
    }) => {
      const response = await axios.put<Changelog>(
        `/api/projects/${projectKey}/changelogs/${id}`,
        { version, markdown, is_published }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...CHANGELOG_QUERY_KEY, variables.projectKey],
      });
    },
  });
}

export function useDeleteChangelogMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectKey, id }: { projectKey: string; id: string }) => {
      await axios.delete(`/api/projects/${projectKey}/changelogs/${id}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...CHANGELOG_QUERY_KEY, variables.projectKey],
      });
    },
  });
}
