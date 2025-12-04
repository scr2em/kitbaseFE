import {  useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';

export const ROLES_QUERY_KEY = ['roles'];

export function useRolesQuery() {
  return useQuery({
    queryKey: ROLES_QUERY_KEY,
    queryFn: async () => {
      const response = await apiClient.roles.listRoles();
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}
