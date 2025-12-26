import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { Changelog, ChangelogListResponse } from '../../../features/apps/model/changelog-schema';

export const CHANGELOG_QUERY_KEY = ['changelogs'];

export function useChangelogsQuery(bundleId: string, page: number = 0, size: number = 10) {
  return useQuery({
    queryKey: [...CHANGELOG_QUERY_KEY, bundleId, page, size],
    queryFn: async () => {
      const response = await axios.get<ChangelogListResponse>(
        `/api/mobile-apps/${bundleId}/changelogs`,
        { params: { page, size } }
      );
      return response.data;
    },
    staleTime: 30 * 1000,
    enabled: !!bundleId,
  });
}

export function useChangelogQuery(bundleId: string, id: string) {
  return useQuery({
    queryKey: [...CHANGELOG_QUERY_KEY, bundleId, id],
    queryFn: async () => {
      const response = await axios.get<Changelog>(
        `/api/mobile-apps/${bundleId}/changelogs/${id}`
      );
      return response.data;
    },
    enabled: !!bundleId && !!id,
  });
}

export function useCreateChangelogMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bundleId,
      version,
      markdown,
    }: {
      bundleId: string;
      version: string;
      markdown: string;
    }) => {
      const response = await axios.post<Changelog>(
        `/api/mobile-apps/${bundleId}/changelogs`,
        { version, markdown }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...CHANGELOG_QUERY_KEY, variables.bundleId],
      });
    },
  });
}

export function useUpdateChangelogMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bundleId,
      id,
      version,
      markdown,
    }: {
      bundleId: string;
      id: string;
      version: string;
      markdown: string;
    }) => {
      const response = await axios.put<Changelog>(
        `/api/mobile-apps/${bundleId}/changelogs/${id}`,
        { version, markdown }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...CHANGELOG_QUERY_KEY, variables.bundleId],
      });
    },
  });
}

export function useDeleteChangelogMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bundleId, id }: { bundleId: string; id: string }) => {
      await axios.delete(`/api/mobile-apps/${bundleId}/changelogs/${id}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...CHANGELOG_QUERY_KEY, variables.bundleId],
      });
    },
  });
}

