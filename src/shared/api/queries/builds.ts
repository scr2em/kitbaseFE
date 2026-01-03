import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';

export const BUILDS_QUERY_KEY = 'builds';

interface UseBuildsQueryParams {
  projectKey: string;
  environmentId: string;
  page: number;
  size: number;
  sort?: 'asc' | 'desc';
}

export function useBuildsQuery({
  projectKey,
  environmentId,
  page,
  size,
  sort = 'desc',
}: UseBuildsQueryParams) {
  return useQuery({
    queryKey: [BUILDS_QUERY_KEY, projectKey, environmentId, page, size, sort],
    queryFn: async () => {
      const response = await apiClient.projects.getBuilds(projectKey, {
        page,
        size,
        sort,
        environmentId,
      });
      return response.data;
    },
    enabled: !!projectKey,
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
