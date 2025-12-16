import {
  Card,
  Loader,
  Button,
  Alert,
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
  const { hasOrganizations, isLoading: isLoadingUser } = useCurrentOrganization();
  const { data: apps, isLoading, isError } = useMobileAppsQuery();
  const deleteAppMutation = useDeleteMobileAppMutation();
  const { showError } = useShowBackendError();
  const { canCreateApp, canDeleteApp } = usePermissions();

  const handleDeleteApp = (appId: string, appName: string) => {
    modals.openConfirmModal({
      title: t('apps.delete.title'),
      children: (
        <p className="text-sm">
          {t('apps.delete.confirmation', { name: appName })}
        </p>
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
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!hasOrganizations) {
    return (
      <div>
        <div className="flex flex-col gap-4">
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
            className="self-start"
          >
            {t('dashboard.create_organization')}
          </Button>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <Alert
          icon={<AlertCircle size={16} />}
          title={t('common.error')}
          color="red"
        >
          {t('apps.error_loading')}
        </Alert>
      </div>
    );
  }

  const appsList = apps || [];

  return (
    <div>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {t('apps.title')}
            </h1>
            <p className="text-lg text-gray-500">
              {t('apps.subtitle', { count: appsList.length })}
            </p>
          </div>
          {canCreateApp && (
            <Button
              leftSection={<Plus size={18} />}
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
              onClick={() => setCreateModalOpened(true)}
            >
              {t('apps.create_button')}
            </Button>
          )}
        </div>

        {/* Apps Grid */}
        {appsList.length === 0 ? (
          <Card withBorder p="xl" radius="md">
            <div className="flex justify-center">
              <div className="flex flex-col items-center gap-4">
                <Package size={48} strokeWidth={1.5} className="text-gray-400" />
                <p className="text-lg text-gray-500">
                  {t('apps.no_apps')}
                </p>
                {canCreateApp && (
                  <Button
                    leftSection={<Plus size={18} />}
                    onClick={() => setCreateModalOpened(true)}
                  >
                    {t('apps.create_first_app')}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {appsList.map((app) => (
              <Card
                key={app.id}
                withBorder
                radius="md"
                padding="lg"
                className="relative cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/apps/${app.bundleId}`)}
              >
                <div className="flex flex-col gap-4">
                  {/* Card Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex gap-2 items-center mb-1">
                        <Package size={20} strokeWidth={2} />
                        <p className="font-semibold text-lg leading-tight">
                          {app.name}
                        </p>
                      </div>
                      <Badge variant="light" color="blue" size="sm">
                        {app.bundleId}
                      </Badge>
                    </div>
                    
                    {canDeleteApp && (
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
                  </div>

                  {/* Description */}
                  {app.description && (
                    <p className="text-sm text-gray-500 min-h-[40px]">
                      {app.description}
                    </p>
                  )}

                  {/* Metadata */}
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      {t('apps.created_at', {
                        date: new Date(app.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }),
                      })}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <CreateAppModal
        opened={createModalOpened}
        onClose={() => setCreateModalOpened(false)}
      />
    </div>
  );
}
