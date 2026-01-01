import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';

interface BackendErrorDetails {
  path?: string;
  [key: string]: unknown;
}

interface BackendErrorResponse {
  error: {
    code: string;
    message: string;
    details?: BackendErrorDetails;
    stackTrace?: string | null;
  };
  timestamp: string;
}

interface AxiosLikeError {
  response?: {
    data?: BackendErrorResponse;
    status?: number;
  };
  message?: string;
}

export function useShowBackendError() {
  const { t } = useTranslation();

  const showError = (error: unknown) => {
    const axiosError = error as AxiosLikeError;
    
    const backendError = axiosError?.response?.data?.error;
    const errorMessage = backendError?.message || axiosError?.message || t('common.error_generic');
    const errorCode = backendError?.code;

    notifications.show({
      title: errorCode ? t('common.error_with_code', { code: errorCode }) : t('common.error'),
      message: errorMessage,
      color: 'red',
    });
  };

  return { showError };
}

