import { useMutation, useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { CreateWebhookRequest, UpdateWebhookRequest } from '../../../generated-api';

export const WEBHOOKS_QUERY_KEY = ['webhooks'];

export function useWebhooksInfiniteQuery() {
  return useInfiniteQuery({
    queryKey: WEBHOOKS_QUERY_KEY,
    queryFn: async ({ pageParam = 0 }) => {
      const response = await apiClient.webhooks.listWebhooks({
        page: pageParam,
        size: 20,
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
  });
}

export function useWebhookQuery(webhookId: string) {
  return useQuery({
    queryKey: [...WEBHOOKS_QUERY_KEY, webhookId],
    queryFn: async () => {
      const response = await apiClient.webhooks.getWebhook(webhookId);
      return response.data;
    },
    enabled: !!webhookId,
    staleTime: 30 * 1000,
  });
}

export function useWebhookDeliveriesInfiniteQuery(webhookId: string) {
  return useInfiniteQuery({
    queryKey: [...WEBHOOKS_QUERY_KEY, webhookId, 'deliveries'],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await apiClient.webhooks.listWebhookDeliveries(webhookId, {
        page: pageParam,
        size: 20,
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
    enabled: !!webhookId,
    staleTime: 30 * 1000,
  });
}

export function useCreateWebhookMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateWebhookRequest) => {
      const response = await apiClient.webhooks.createWebhook(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WEBHOOKS_QUERY_KEY });
    },
  });
}

export function useUpdateWebhookMutation(webhookId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateWebhookRequest) => {
      const response = await apiClient.webhooks.updateWebhook(webhookId, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WEBHOOKS_QUERY_KEY });
    },
  });
}

export function useDeleteWebhookMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (webhookId: string) => {
      const response = await apiClient.webhooks.deleteWebhook(webhookId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WEBHOOKS_QUERY_KEY });
    },
  });
}

