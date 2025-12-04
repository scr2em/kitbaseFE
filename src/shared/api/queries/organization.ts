import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { CreateOrganizationRequest, UpdateOrganizationRequest } from '../../../generated-api';
import { USER_QUERY_KEY } from './user';

export const ORGANIZATION_QUERY_KEY = ['organization', 'current'];
export const ORGANIZATION_MEMBERS_QUERY_KEY = ['organizationMembers'];

export function useCreateOrganizationMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateOrganizationRequest) => {
      const response = await apiClient.organizations.createOrganization(data);
      return response.data;
    },
    onSuccess: () => {
      // After creating organization, invalidate user query to fetch updated user data
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
}

export function useGetOrganizationQuery() {
  return useQuery({
    queryKey: ORGANIZATION_QUERY_KEY,
    queryFn: async () => {
      const response = await apiClient.organizations.getCurrentOrganization();
      return response.data;
    },
  });
}

export function useUpdateOrganizationMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UpdateOrganizationRequest) => {
      const response = await apiClient.organizations.updateOrganization(data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate organization and user queries to refresh data
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
}

export function useOrganizationMembersQuery() {
  return useInfiniteQuery({
    queryKey: ORGANIZATION_MEMBERS_QUERY_KEY,
    queryFn: async ({ pageParam }) => {
      const page = pageParam as number;
      const limit = 20;
      
      const response = await apiClient.users.listOrganizationMembers({ page, limit });
      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length - 1;
      const totalPages = Math.ceil(lastPage.total / lastPage.itemsPerPage);
      
      // Backend uses 0-based pagination, so next page is currentPage + 1
      return currentPage + 1 < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 0,
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useRemoveMemberMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (membershipId: string) => {
      const response = await apiClient.users.removeMember(membershipId);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate members query to refetch the teams page
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_MEMBERS_QUERY_KEY });
    },
  });
}

export function useUpdateMemberRoleMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ membershipId, roleId }: { membershipId: string; roleId: string }) => {
      const response = await apiClient.users.updateMemberRole(membershipId, { roleId });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate members query to refetch the teams page
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_MEMBERS_QUERY_KEY });
    },
  });
}

