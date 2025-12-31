import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';

export const EVENTS_QUERY_KEY = 'events';

export const getEventsQueryKey = (projectKey: string, page: number, size: number, filters?: EventsFilters) => 
  ['events', projectKey, page, size, filters] as const;

export const getEventsInfiniteQueryKey = (projectKey: string, filters?: EventsFilters) => 
  ['eventsInfinite', projectKey, filters] as const;

export interface EventStatsFilters {
  environment?: string;
  channel?: string;
  from?: string;
  to?: string;
}

export const getEventStatsQueryKey = (projectKey: string, groupBy: string, filters?: EventStatsFilters) => 
  ['eventStats', projectKey, groupBy, filters] as const;

export interface EventsFilters {
  environment?: string;
  event?: string;
  channel?: string;
  user_id?: string;
  from?: string;
  to?: string;
}

export function useEventsQuery(
  projectKey: string,
  page: number,
  size: number,
  filters?: EventsFilters
) {
  return useQuery({
    queryKey: getEventsQueryKey(projectKey, page, size, filters),
    queryFn: async () => {
      const response = await apiClient.projects.listEvents(projectKey, {
        page,
        size,
        sort: 'desc',
        ...filters,
      });
      return response.data;
    },
    staleTime: 30 * 1000,
    enabled: !!projectKey,
  });
}

export function useEventsInfiniteQuery(projectKey: string, filters?: EventsFilters) {
  return useInfiniteQuery({
    queryKey: getEventsInfiniteQueryKey(projectKey, filters),
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

export function useEventStatsQuery(
  projectKey: string,
  groupBy: 'event' | 'environment' | 'channel' | 'user_id',
  filters?: EventStatsFilters
) {
  return useQuery({
    queryKey: getEventStatsQueryKey(projectKey, groupBy, filters),
    queryFn: async () => {
      const response = await apiClient.projects.getEventStats(projectKey, {
        group_by: groupBy,
        ...filters,
      });
      return response.data;
    },
    staleTime: 60 * 1000,
    enabled: !!projectKey,
  });
}

