import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { LoginRequest, UserRegistrationRequest, AuthResponse } from '../../../generated-api';
import { USER_QUERY_KEY } from './user';
import { tokenStorage } from '../../lib/cookies';

export function useLoginMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await apiClient.auth.signin(data);
      return response.data;
    },
    onSuccess: (data: AuthResponse) => {
      tokenStorage.setAccessToken(data.accessToken);
      tokenStorage.setRefreshToken(data.refreshToken);
      // Invalidate user query to fetch fresh data
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
}

export function useSignupMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UserRegistrationRequest) => {
      const response = await apiClient.auth.signup(data);
      return response.data;
    },
    onSuccess: (data: AuthResponse) => {
      tokenStorage.setAccessToken(data.accessToken);
      tokenStorage.setRefreshToken(data.refreshToken);
      // Invalidate user query to fetch fresh data
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
}

