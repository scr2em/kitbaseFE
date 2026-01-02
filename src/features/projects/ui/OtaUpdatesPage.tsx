import {
  Card,
  Loader,
  Button,
  Alert,
  Menu,
  ActionIcon,
  Table,
  ScrollArea,
  Badge,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Plus, MoreVertical, Trash2, Edit, Smartphone, Monitor, Apple } from 'lucide-react';
import { useParams, useNavigate } from 'react-router';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import {
  useOtaUpdatesInfiniteQuery,
  useDeleteOtaUpdateMutation,
} from '../../../shared/api/queries/ota-updates';
import { useShowBackendError } from '../../../shared/hooks';
import type { OtaUpdateResponse } from '../../../generated-api';

export function OtaUpdatesPage() {
  const { t } = useTranslation();
  const { projectKey, environmentId } = useParams<{ projectKey: string; environmentId: string }>();
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useOtaUpdatesInfiniteQuery(projectKey || '', environmentId);

  const deleteOtaUpdateMutation = useDeleteOtaUpdateMutation(projectKey || '');
  const { showError } = useShowBackendError();

  const handleDeleteOtaUpdate = (otaUpdate: OtaUpdateResponse) => {
    modals.openConfirmModal({
      title: t('ota_updates.delete.title'),
      children: (
        <p className="text-sm">
          {t('ota_updates.delete.confirmation', { name: otaUpdate.name })}
        </p>
      ),
      labels: { confirm: t('ota_updates.delete.confirm'), cancel: t('ota_updates.delete.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteOtaUpdateMutation.mutateAsync(otaUpdate.id);
          notifications.show({
            title: t('common.success'),
            message: t('ota_updates.delete.success_message'),
            color: 'green',
          });
        } catch (error) {
          showError(error);
        }
      },
    });
  };

  const handleEditOtaUpdate = (otaUpdate: OtaUpdateResponse) => {
    navigate(`/projects/${projectKey}/${environmentId}/ota-updates/${otaUpdate.id}/edit`);
  };

  const handleCreateOtaUpdate = () => {
    navigate(`/projects/${projectKey}/${environmentId}/ota-updates/create`);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'ios':
        return <Apple size={14} />;
      case 'android':
        return <Smartphone size={14} />;
      case 'both':
        return <Monitor size={14} />;
      default:
        return <Smartphone size={14} />;
    }
  };

  const getUpdateModeBadge = (mode: string) => {
    const colorMap: Record<string, string> = {
      force: 'red',
      silent: 'blue',
      prompt: 'yellow',
    };
    return (
      <Badge size="sm" variant="light" color={colorMap[mode] || 'gray'}>
        {t(`ota_updates.update_mode.${mode}`)}
      </Badge>
    );
  };

  const getPlatformBadge = (platform: string) => {
    const colorMap: Record<string, string> = {
      ios: 'grape',
      android: 'green',
      both: 'blue',
    };
    return (
      <Badge 
        size="sm" 
        variant="light" 
        color={colorMap[platform] || 'gray'}
        leftSection={getPlatformIcon(platform)}
      >
        {t(`ota_updates.platform.${platform}`)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader size="lg" />
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
          {t('ota_updates.error_loading')}
        </Alert>
      </div>
    );
  }

  const otaUpdates = data?.pages.flatMap((page) => page.data) || [];
  const totalElements = data?.pages[0]?.totalElements || 0;

  return (
    <div>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-1">
              {t('ota_updates.title')}
            </h2>
            <p className="text-sm text-slate-500">
              {t('ota_updates.subtitle', { count: totalElements })}
            </p>
          </div>
          <Button
            leftSection={<Plus size={16} />}
            size="sm"
            onClick={handleCreateOtaUpdate}
          >
            {t('ota_updates.create_button')}
          </Button>
        </div>

        {/* OTA Updates Table */}
        {otaUpdates.length === 0 ? (
          <Card withBorder p="xl" radius="md">
            <div className="flex justify-center">
              <div className="flex flex-col items-center gap-4">
                <Smartphone size={48} strokeWidth={1.5} className="text-slate-400" />
                <p className="text-base text-slate-500">
                  {t('ota_updates.no_updates')}
                </p>
                <Button
                  leftSection={<Plus size={16} />}
                  size="sm"
                  onClick={handleCreateOtaUpdate}
                >
                  {t('ota_updates.create_first')}
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <>
            <Card withBorder padding={0} radius="md">
              <ScrollArea>
                <Table highlightOnHover verticalSpacing="sm" horizontalSpacing="md">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>{t('ota_updates.table.name')}</Table.Th>
                      <Table.Th>{t('ota_updates.table.version')}</Table.Th>
                      <Table.Th>{t('ota_updates.table.platform')}</Table.Th>
                      <Table.Th>{t('ota_updates.table.update_mode')}</Table.Th>
                      <Table.Th>{t('ota_updates.table.min_version')}</Table.Th>
                      <Table.Th>{t('ota_updates.table.created_at')}</Table.Th>
                      <Table.Th>{t('ota_updates.table.actions')}</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {otaUpdates.map((otaUpdate) => (
                      <Table.Tr key={otaUpdate.id}>
                        <Table.Td>
                          <div className="flex gap-3 items-center">
                            <Smartphone size={18} strokeWidth={2} className="text-slate-500" />
                            <div>
                              <p className="font-medium text-sm">
                                {otaUpdate.name}
                              </p>
                            </div>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <Badge size="sm" variant="outline">
                            v{otaUpdate.version}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          {getPlatformBadge(otaUpdate.targetPlatform)}
                        </Table.Td>
                        <Table.Td>
                          {getUpdateModeBadge(otaUpdate.updateMode)}
                        </Table.Td>
                        <Table.Td>
                          <p className="text-sm text-slate-600">
                            ≥ {otaUpdate.minNativeVersion}
                          </p>
                        </Table.Td>
                        <Table.Td>
                          <p className="text-sm">
                            {new Date(otaUpdate.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </Table.Td>
                        <Table.Td>
                          <Menu shadow="md" width={200} position="bottom-end">
                            <Menu.Target>
                              <ActionIcon variant="subtle" color="gray">
                                <MoreVertical size={18} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item
                                leftSection={<Edit size={16} />}
                                onClick={() => handleEditOtaUpdate(otaUpdate)}
                              >
                                {t('ota_updates.actions.edit')}
                              </Menu.Item>
                              <Menu.Item
                                color="red"
                                leftSection={<Trash2 size={16} />}
                                onClick={() => handleDeleteOtaUpdate(otaUpdate)}
                              >
                                {t('ota_updates.actions.delete')}
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>
            </Card>

            {/* Load More Button */}
            {hasNextPage && (
              <div className="flex justify-center mt-4">
                <Button
                  onClick={() => fetchNextPage()}
                  loading={isFetchingNextPage}
                  variant="light"
                  size="sm"
                >
                  {isFetchingNextPage ? t('ota_updates.loading_more') : t('ota_updates.load_more')}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
