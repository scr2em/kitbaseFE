import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import type {
  TwoFactorEnableRequest,
  TwoFactorDisableRequest,
} from '../../../generated-api';
import axios from 'axios';
import { USER_QUERY_KEY } from './user';

export const TWO_FACTOR_STATUS_KEY = ['twoFactorStatus'];

export function useTwoFactorStatusQuery() {
  return useQuery({
    queryKey: TWO_FACTOR_STATUS_KEY,
    queryFn: async () => {
      const response = await apiClient.users.getTwoFactorStatus();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTwoFactorSetupMutation() {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.users.setupTwoFactor();
      return response.data;
    },
  });
}

/**
 * Setup 2FA using a temp token (for forced 2FA setup during login)
 */
export function useTwoFactorSetupWithTokenMutation() {
  return useMutation({
    mutationFn: async (tempToken: string) => {
      const response = await axios.post<{
        secret: string;
        qrCodeUri: string;
        backupCodes: string[];
      }>(
        `${import.meta.env.VITE_API_URL}/users/me/2fa/setup`,
        {},
        {
          headers: {
            'X-2FA-Setup-Token': tempToken,
          },
        }
      );
      return response.data;
    },
  });
}

export function useTwoFactorEnableMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TwoFactorEnableRequest) => {
      const response = await apiClient.users.enableTwoFactor(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TWO_FACTOR_STATUS_KEY });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
}

/**
 * Enable 2FA using a temp token (for forced 2FA setup during login)
 */
export function useTwoFactorEnableWithTokenMutation() {
  return useMutation({
    mutationFn: async ({
      tempToken,
      code,
    }: {
      tempToken: string;
      code: string;
    }) => {
      const response = await axios.post<{
        enabled: boolean;
        backupCodesRemaining: number;
      }>(
        `${import.meta.env.VITE_API_URL}/users/me/2fa/enable`,
        { code },
        {
          headers: {
            'X-2FA-Setup-Token': tempToken,
          },
        }
      );
      return response.data;
    },
  });
}

export function useTwoFactorDisableMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TwoFactorDisableRequest) => {
      const response = await apiClient.users.disableTwoFactor(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TWO_FACTOR_STATUS_KEY });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
}

export function useRegenerateBackupCodesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.users.regenerateBackupCodes();
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TWO_FACTOR_STATUS_KEY });
    },
  });
}
