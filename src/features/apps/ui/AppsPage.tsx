import {
  Box,
  Title,
  Text,
  Stack,
  Card,
  Center,
  Loader,
  Button,
  Alert,
  SimpleGrid,
  Group,
  Badge,
  Menu,
  ActionIcon,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Plus, MoreVertical, Trash2, Package, Building } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import {
  useMobileAppsQuery,
  useDeleteMobileAppMutation,
} from '../../../shared/api/queries';
import { useShowBackendError, usePermissions, useCurrentOrganization } from '../../../shared/hooks';
import { CreateAppModal } from './CreateAppModal';

export function AppsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [createModalOpened, setCreateModalOpened] = useState(false);
  const { currentOrganization, hasOrganizations, isLoading: isLoadingUser } = useCurrentOrganization();
  const organizationId = currentOrganization?.organization?.id || '';
  const { data: apps, isLoading, isError } = useMobileAppsQuery(organizationId);
  const deleteAppMutation = useDeleteMobileAppMutation(organizationId);
  const { showError } = useShowBackendError();
  const { canCreateMobileApp, canDeleteMobileApp } = usePermissions();

  const handleDeleteApp = (appId: string, appName: string) => {
    modals.openConfirmModal({
      title: t('apps.delete.title'),
      children: (
        <Text size="sm">
          {t('apps.delete.confirmation', { name: appName })}
        </Text>
      ),
      labels: { confirm: t('apps.delete.confirm'), cancel: t('apps.delete.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteAppMutation.mutateAsync(appId);
          notifications.show({
            title: t('common.success'),
            message: t('apps.delete.success_message'),
            color: 'green',
          });
        } catch (error) {
          showError(error);
        }
      },
    });
  };

  if (isLoadingUser || isLoading) {
    return (
      <Center h="calc(100vh - 120px)">
        <Loader size="lg" />
      </Center>
    );
  }

  if (!hasOrganizations) {
    return (
      <Box>
        <Stack gap="md">
          <Alert
            icon={<AlertCircle size={16} />}
            title={t('apps.no_organization_title')}
            color="yellow"
          >
            {t('apps.no_organization_message')}
          </Alert>
          <Button
            leftSection={<Building size={16} />}
            variant="light"
            size="md"
            onClick={() => navigate('/create-organization')}
            style={{ alignSelf: 'flex-start' }}
          >
            {t('dashboard.create_organization')}
          </Button>
        </Stack>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box>
        <Alert
          icon={<AlertCircle size={16} />}
          title={t('common.error')}
          color="red"
        >
          {t('apps.error_loading')}
        </Alert>
      </Box>
    );
  }

  const appsList = apps || [];

  return (
    <Box>
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <Box>
            <Title order={1} mb="xs">
              {t('apps.title')}
            </Title>
            <Text c="dimmed" size="lg">
              {t('apps.subtitle', { count: appsList.length })}
            </Text>
          </Box>
          {canCreateMobileApp && (
            <Button
              leftSection={<Plus size={18} />}
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
              onClick={() => setCreateModalOpened(true)}
            >
              {t('apps.create_button')}
            </Button>
          )}
        </Group>

        {/* Apps Grid */}
        {appsList.length === 0 ? (
          <Card withBorder p="xl" radius="md">
            <Center>
              <Stack align="center" gap="md">
                <Package size={48} strokeWidth={1.5} color="var(--mantine-color-dimmed)" />
                <Text c="dimmed" size="lg">
                  {t('apps.no_apps')}
                </Text>
                {canCreateMobileApp && (
                  <Button
                    leftSection={<Plus size={18} />}
                    onClick={() => setCreateModalOpened(true)}
                  >
                    {t('apps.create_first_app')}
                  </Button>
                )}
              </Stack>
            </Center>
          </Card>
        ) : (
          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 3 }}
            spacing="lg"
          >
            {appsList.map((app) => (
              <Card
                key={app.id}
                withBorder
                radius="md"
                padding="lg"
                style={{ position: 'relative', cursor: 'pointer' }}
                onClick={() => navigate(`/apps/${app.bundleId}`)}
              >
                <Stack gap="md">
                  {/* Card Header */}
                  <Group justify="space-between" align="flex-start">
                    <Box style={{ flex: 1 }}>
                      <Group gap="xs" mb={4}>
                        <Package size={20} strokeWidth={2} />
                        <Text fw={600} size="lg" style={{ lineHeight: 1.2 }}>
                          {app.name}
                        </Text>
                      </Group>
                      <Badge variant="light" color="blue" size="sm">
                        {app.bundleId}
                      </Badge>
                    </Box>
                    
                    {canDeleteMobileApp && (
                      <Menu shadow="md" width={200} position="bottom-end">
                        <Menu.Target>
                          <ActionIcon 
                            variant="subtle" 
                            color="gray"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical size={18} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            color="red"
                            leftSection={<Trash2 size={16} />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteApp(app.id, app.name);
                            }}
                          >
                            {t('apps.delete.menu_item')}
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    )}
                  </Group>

                  {/* Description */}
                  {app.description && (
                    <Text size="sm" c="dimmed" style={{ minHeight: '40px' }}>
                      {app.description}
                    </Text>
                  )}

                  {/* Metadata */}
                  <Box pt="xs" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
                    <Text size="xs" c="dimmed">
                      {t('apps.created_at', {
                        date: new Date(app.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }),
                      })}
                    </Text>
                  </Box>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Stack>

      <CreateAppModal
        opened={createModalOpened}
        onClose={() => setCreateModalOpened(false)}
      />
    </Box>
  );
}

