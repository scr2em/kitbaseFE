import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { CreateProjectRequest, UpdateProjectRequest } from '../../../generated-api';

export const PROJECTS_QUERY_KEY = ['projects'];

export function useProjectsQuery() {
  return useQuery({
    queryKey: PROJECTS_QUERY_KEY,
    queryFn: async () => {
      const response = await apiClient.projects.listProjects();
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateProjectRequest) => {
      const response = await apiClient.projects.createProject(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
    },
  });
}

export function useProjectQuery(projectKey: string) {
  return useQuery({
    queryKey: [...PROJECTS_QUERY_KEY, projectKey],
    queryFn: async () => {
      const response = await apiClient.projects.getProject(projectKey);
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
    enabled: !!projectKey,
  });
}

export function useDeleteProjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (projectKey: string) => {
      await apiClient.projects.deleteProject(projectKey);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
    },
  });
}

export function useUpdateProjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectKey, data }: { projectKey: string; data: UpdateProjectRequest }) => {
      const response = await apiClient.projects.updateProject(projectKey, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
    },
  });
}



