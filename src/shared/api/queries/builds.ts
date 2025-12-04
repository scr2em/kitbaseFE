import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';

export const BUILDS_QUERY_KEY = 'builds';

export function useBuildsQuery(
  bundleId: string,
  page: number,
  size: number,
  sort: 'asc' | 'desc' = 'desc'
) {
  return useQuery({
    queryKey: [BUILDS_QUERY_KEY, bundleId, page, size, sort],
    queryFn: async () => {
      const response = await apiClient.bundleId.getBuilds(bundleId, {
        page,
        size,
        sort,
      });
      return response.data;
    },
    enabled: !!bundleId,
  });
}

export function useDeleteBuildMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ buildId }: { buildId: string }) => {
      const response = await apiClient.builds.deleteBuild(buildId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BUILDS_QUERY_KEY] });
    },
  });
}

