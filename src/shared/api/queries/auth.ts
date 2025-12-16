import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { 
  LoginRequest, 
  AuthResponse,
  SignupInitiateRequest,
  SignupCompleteRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest
} from '../../../generated-api';
import { USER_QUERY_KEY } from './user';
import { tokenStorage } from '../../lib/cookies';

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await apiClient.auth.login(data);
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

export function useInitiateSignupMutation() {
  return useMutation({
    mutationFn: async (data: SignupInitiateRequest) => {
      const response = await apiClient.auth.initiateSignup(data);
      return response.data;
    },
  });
}

export function useCompleteSignupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SignupCompleteRequest) => {
      const response = await apiClient.auth.completeSignup(data);
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

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: async (data: ForgotPasswordRequest) => {
      const response = await apiClient.auth.forgotPassword(data);
      return response.data;
    },
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: async (data: ResetPasswordRequest) => {
      const response = await apiClient.auth.resetPassword(data);
      return response.data;
    },
  });
}

