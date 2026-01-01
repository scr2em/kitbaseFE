import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import { AuthProvider } from '../../shared/lib/auth/AuthContext';
import { theme } from '../../shared/theme';
import { SpotlightSearch } from '../../shared/components/SpotlightSearch';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/spotlight/styles.css';

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
      <NuqsAdapter>
        <MantineProvider theme={theme} >
          <ModalsProvider>
            <Notifications position="top-right" />
            <AuthProvider>
              <SpotlightSearch />
              <Outlet />
            </AuthProvider>
          </ModalsProvider>
        </MantineProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  );
}

