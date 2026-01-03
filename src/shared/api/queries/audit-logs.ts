import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '../client';

export const AUDIT_LOGS_QUERY_KEY = ['auditLogs'];

interface AuditLogsFilters {
  action?: string;
  resourceType?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  sort?: 'asc' | 'desc';
}

export function useAuditLogsQuery(filters?: AuditLogsFilters) {
  return useInfiniteQuery({
    queryKey: [...AUDIT_LOGS_QUERY_KEY, filters],
    queryFn: async ({ pageParam }) => {
      const page = pageParam as number;
      const size = 20;

      const response = await apiClient.auditLogs.getAuditLogs({
        page,
        size,
        action: filters?.action,
        resourceType: filters?.resourceType,
        userId: filters?.userId,
        startDate: filters?.startDate,
        endDate: filters?.endDate,
        sort: filters?.sort ?? 'desc',
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.page;
      const totalPages = lastPage.totalPages;

      return currentPage + 1 < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 0,
    staleTime: 30 * 1000,
  });
}
