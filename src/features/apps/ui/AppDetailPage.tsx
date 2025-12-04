import {
  Box,
  Title,
  Stack,
  Center,
  Loader,
  Alert,
  Group,
  Badge,
  Button,
  NavLink,
  Grid,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, useLocation, Outlet } from 'react-router';
import { AlertCircle, Package, ArrowLeft, Hammer, Key } from 'lucide-react';
import { useMobileAppQuery } from '../../../shared/api/queries';

export function AppDetailPage() {
  const { t } = useTranslation();
  const { bundleId } = useParams<{ bundleId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: app, isLoading, isError } = useMobileAppQuery(bundleId || '');

  const navigationItems = [
    {
      label: t('apps.detail.nav.bundles'),
      path: `/apps/${bundleId}/bundles`,
      icon: <Package size={18} />,
    },
    {
      label: t('apps.detail.nav.builds'),
      path: `/apps/${bundleId}/builds`,
      icon: <Hammer size={18} />,
    },
    // {
    //   label: t('apps.detail.nav.access'),
    //   path: `/apps/${bundleId}/access`,
    //   icon: <Lock size={18} />,
    // },
    {
      label: t('apps.detail.nav.api_keys'),
      path: `/apps/${bundleId}/api-keys`,
      icon: <Key size={18} />,
    },
  ];

  if (isLoading) {
    return (
      <Center h="calc(100vh - 120px)">
        <Loader size="lg" />
      </Center>
    );
  }

  if (isError || !app) {
    return (
      <Box>
        <Alert
          icon={<AlertCircle size={16} />}
          title={t('common.error')}
          color="red"
        >
          {t('apps.detail.error_loading')}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Stack gap="md">
        {/* Header with Back Button */}
        <Group justify="space-between" align="center">
          <Group gap="sm" align="center">
            <Package size={24} strokeWidth={2} />
            <Box>
              <Group gap="sm" align="center">
                <Title order={2}>{app.name}</Title>
                <Badge variant="light" color="blue" size="sm">
                  {app.bundleId}
                </Badge>
              </Group>
            </Box>
          </Group>
          <Button
            variant="subtle"
            size="sm"
            leftSection={<ArrowLeft size={16} />}
            onClick={() => navigate('/apps')}
          >
            {t('apps.detail.back_to_apps')}
          </Button>
        </Group>

        {/* Main Content with Side Navigation */}
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 2.5 }}>
            <Stack gap="xs">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.path}
                  label={item.label}
                  leftSection={item.icon}
                  active={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                  styles={{
                    root: {
                      borderRadius: 'var(--mantine-radius-md)',
                    },
                  }}
                />
              ))}
            </Stack>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 9.5 }}>
            <Outlet />
          </Grid.Col>
        </Grid>
      </Stack>
    </Box>
  );
}

