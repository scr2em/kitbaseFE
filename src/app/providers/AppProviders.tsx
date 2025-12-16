import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router';
import { AuthProvider } from '../../shared/lib/auth/AuthContext';
import { theme } from '../../shared/theme';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function AppProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} >
        <ModalsProvider>
          <Notifications position="top-right" />
          <AuthProvider>
            <Outlet />
          </AuthProvider>
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}

