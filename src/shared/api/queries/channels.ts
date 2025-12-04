import { useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { CreateChannelRequest, UpdateChannelRequest } from '../../../generated-api';

export const CHANNELS_QUERY_KEY = ['channels'];

export function useChannelsInfiniteQuery() {
  return useInfiniteQuery({
    queryKey: CHANNELS_QUERY_KEY,
    queryFn: async ({ pageParam = 0 }) => {
      const response = await apiClient.channels.listChannels({
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
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useCreateChannelMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateChannelRequest) => {
      const response = await apiClient.channels.createChannel(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHANNELS_QUERY_KEY });
    },
  });
}

export function useUpdateChannelMutation(channelId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UpdateChannelRequest) => {
      const response = await apiClient.channels.updateChannel(channelId, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHANNELS_QUERY_KEY });
    },
  });
}

export function useDeleteChannelMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (channelId: string) => {
      const response = await apiClient.channels.deleteChannel(channelId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHANNELS_QUERY_KEY });
    },
  });
}

