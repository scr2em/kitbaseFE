import { useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { CreateChannelRequest, UpdateChannelRequest } from '../../../generated-api';

export const CHANNELS_QUERY_KEY = ['channels'];

export function useChannelsInfiniteQuery(orgId: string) {
  return useInfiniteQuery({
    queryKey: [...CHANNELS_QUERY_KEY, orgId],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await apiClient.organizations.listChannels(orgId, {
        page: pageParam,
        size: 20,
        sort: 'desc',
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
    enabled: !!orgId,
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useCreateChannelMutation(orgId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateChannelRequest) => {
      const response = await apiClient.organizations.createChannel(orgId, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...CHANNELS_QUERY_KEY, orgId] });
    },
  });
}

export function useUpdateChannelMutation(orgId: string, channelId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UpdateChannelRequest) => {
      const response = await apiClient.organizations.updateChannel(orgId, channelId, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...CHANNELS_QUERY_KEY, orgId] });
    },
  });
}

export function useDeleteChannelMutation(orgId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (channelId: string) => {
      const response = await apiClient.organizations.deleteChannel(orgId, channelId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...CHANNELS_QUERY_KEY, orgId] });
    },
  });
}

