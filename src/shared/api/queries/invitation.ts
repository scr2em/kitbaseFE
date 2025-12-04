import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import { type CreateInvitationRequest } from '../../../generated-api';
import { ORGANIZATION_MEMBERS_QUERY_KEY } from './organization';

export const INVITATIONS_QUERY_KEY = ['invitations'];

export function useCreateInvitationMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateInvitationRequest) => {
      const response = await apiClient.invite.sendInvitation(data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate members query to refetch the teams page
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_MEMBERS_QUERY_KEY });
    },
  });
}

export function useAcceptInvitationMutation() {
  return useMutation({
    mutationFn: async (invitationId: string) => {
      const response = await apiClient.invitations.acceptInvitation(invitationId);
      return response.data;
    },
  });
}

export function useCancelInvitationMutation() {
  return useMutation({
    mutationFn: async (invitationId: string) => {
      const response = await apiClient.invitations.cancelInvitation(invitationId);
      return response.data;
    },
  });
}

export function useRevokeInvitationMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (invitationId: string) => {
      const response = await apiClient.invitations.revokeInvitation(invitationId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_MEMBERS_QUERY_KEY });
    },
  });
}

