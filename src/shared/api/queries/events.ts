import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';

export const EVENTS_QUERY_KEY = 'events';

export const getEventsQueryKey = (projectKey: string, filters?: EventsFilters) => 
  ['events', projectKey, filters] as const;

export interface EventsFilters {
  environment?: string;
  event?: string;
  channel?: string;
  user_id?: string;
  from?: string;
  to?: string;
}

export function useEventsInfiniteQuery(projectKey: string, filters?: EventsFilters) {
  return useInfiniteQuery({
    queryKey: getEventsQueryKey(projectKey, filters),
    queryFn: async ({ pageParam = 0 }) => {
      const response = await apiClient.projects.listEvents(projectKey, {
        page: pageParam,
        size: 20,
        sort: 'desc',
        ...filters,
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
    enabled: !!projectKey,
  });
}

export function useEventQuery(projectKey: string, eventId: string) {
  return useQuery({
    queryKey: ['event', projectKey, eventId],
    queryFn: async () => {
      const response = await apiClient.projects.getEvent(projectKey, eventId);
      return response.data;
    },
    staleTime: 30 * 1000,
    enabled: !!projectKey && !!eventId,
  });
}

