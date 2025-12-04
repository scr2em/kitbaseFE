import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';

export const PERMISSIONS_QUERY_KEY = ['permissions'];

export function useRolePermissionsQuery(roleId: string | undefined) {
  return useQuery({
    queryKey: [...PERMISSIONS_QUERY_KEY, roleId],
    queryFn: async () => {
      if (!roleId) {
        throw new Error('Role ID is required');
      }
      const response = await apiClient.roles.getRolePermissions(roleId);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - permissions don't change often
    enabled: !!roleId,
  });
}

