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
  Switch,
  Checkbox,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Plus, MoreVertical, Trash2, Edit, Flag, Eye } from 'lucide-react';
import { useParams, useNavigate } from 'react-router';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import {
  useFeatureFlagsInfiniteQuery,
  useDeleteFeatureFlagMutation,
  useUpdateFeatureFlagMutation,
} from '../../../shared/api/queries/feature-flags';
import { useShowBackendError } from '../../../shared/hooks';
import type { FeatureFlagResponse } from '../../../generated-api';
import { CreateFeatureFlagModal } from './CreateFeatureFlagModal';
import { UpdateFeatureFlagModal } from './UpdateFeatureFlagModal';

export function FlagListPage() {
  const { t } = useTranslation();
  const { projectKey, environmentId } = useParams<{ projectKey: string; environmentId: string }>();
  const navigate = useNavigate();

  const [createModalOpened, setCreateModalOpened] = useState(false);
  const [updateModalData, setUpdateModalData] = useState<{
    opened: boolean;
    flag: FeatureFlagResponse | null;
  }>({ opened: false, flag: null });

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFeatureFlagsInfiniteQuery(projectKey || '', environmentId || '');

  const deleteFeatureFlagMutation = useDeleteFeatureFlagMutation(projectKey || '', environmentId || '');
  const { showError } = useShowBackendError();

  const handleDeleteFlag = (flag: FeatureFlagResponse) => {
    let deleteAllEnvironments = false;
    modals.openConfirmModal({
      title: t('feature_flags.delete.title'),
      children: (
        <div className="flex flex-col gap-3">
          <p className="text-sm">
            {t('feature_flags.delete.confirmation', { name: flag.name })}
          </p>

          <Checkbox
            defaultChecked={false}
            label={t('feature_flags.delete.delete_all_environments_label')}
            description={t('feature_flags.delete.delete_all_environments_description')}
            onChange={(e) => {
              deleteAllEnvironments = e.currentTarget.checked;
            }}
          />
        </div>
      ),
      labels: { confirm: t('feature_flags.delete.confirm'), cancel: t('feature_flags.delete.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteFeatureFlagMutation.mutateAsync({
            flagKey: flag.flagKey,
            deleteAllEnvironments,
          });
          notifications.show({
            title: t('common.success'),
            message: t('feature_flags.delete.success_message'),
            color: 'green',
          });
        } catch (error) {
          showError(error);
        }
      },
    });
  };

  const handleViewFlag = (flag: FeatureFlagResponse) => {
    navigate(`/projects/${projectKey}/${environmentId}/feature-flags/flags/${flag.flagKey}`);
  };

  const getValueTypeBadge = (valueType: string) => {
    const colorMap: Record<string, string> = {
      boolean: 'blue',
      string: 'green',
      number: 'orange',
      json: 'violet',
    };
    return (
      <Badge size="sm" variant="light" color={colorMap[valueType] || 'gray'}>
        {t(`feature_flags.value_types.${valueType}`)}
      </Badge>
    );
  };

  const formatValue = (value: unknown, valueType: string) => {
    if (value === null || value === undefined) {
      return <span className="text-slate-400">{t('feature_flags.no_value')}</span>;
    }
    if (valueType === 'boolean') {
      return value ? t('common.true') : t('common.false');
    }
    if (valueType === 'json') {
      return (
        <span className="font-mono text-xs truncate max-w-[150px] block">
          {JSON.stringify(value)}
        </span>
      );
    }
    return String(value);
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
          {t('feature_flags.error_loading')}
        </Alert>
      </div>
    );
  }

  const featureFlags = data?.pages.flatMap((page) => page.data) || [];
  const totalElements = data?.pages[0]?.totalElements || 0;

  return (
    <div>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-1">
              {t('feature_flags.title')}
            </h2>
            <p className="text-sm text-slate-500">
              {t('feature_flags.subtitle', { count: totalElements })}
            </p>
          </div>
          <Button
            leftSection={<Plus size={16} />}
            size="sm"
            onClick={() => setCreateModalOpened(true)}
          >
            {t('feature_flags.create_button')}
          </Button>
        </div>

        {/* Feature Flags Table */}
        {featureFlags.length === 0 ? (
          <Card withBorder p="xl" radius="md">
            <div className="flex justify-center">
              <div className="flex flex-col items-center gap-4">
                <Flag size={48} strokeWidth={1.5} className="text-slate-400" />
                <p className="text-base text-slate-500">
                  {t('feature_flags.no_flags')}
                </p>
                <Button
                  leftSection={<Plus size={16} />}
                  size="sm"
                  onClick={() => setCreateModalOpened(true)}
                >
                  {t('feature_flags.create_first')}
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
                      <Table.Th>{t('feature_flags.table.key')}</Table.Th>
                      <Table.Th>{t('feature_flags.table.name')}</Table.Th>
                      <Table.Th>{t('feature_flags.table.type')}</Table.Th>
                      <Table.Th>{t('feature_flags.table.enabled')}</Table.Th>
                      <Table.Th>{t('feature_flags.table.value')}</Table.Th>
                      <Table.Th>{t('feature_flags.table.created_at')}</Table.Th>
                      <Table.Th>{t('feature_flags.table.actions')}</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {featureFlags.map((flag) => (
                      <Table.Tr key={flag.id} className="cursor-pointer" onClick={() => handleViewFlag(flag)}>
                        <Table.Td>
                          <div className="flex gap-3 items-center">
                            <Flag size={18} strokeWidth={2} className="text-slate-500" />
                            <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                              {flag.flagKey}
                            </code>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <p className="font-medium text-sm">{flag.name}</p>
                          {flag.description && (
                            <p className="text-xs text-slate-500 truncate max-w-[200px]">
                              {flag.description}
                            </p>
                          )}
                        </Table.Td>
                        <Table.Td>{getValueTypeBadge(flag.valueType)}</Table.Td>
                        <Table.Td onClick={(e) => e.stopPropagation()}>
                          <FlagToggle
                            flag={flag}
                            projectKey={projectKey || ''}
                            environmentId={environmentId || ''}
                          />
                        </Table.Td>
                        <Table.Td>
                          {formatValue(flag.value, flag.valueType)}
                        </Table.Td>
                        <Table.Td>
                          <p className="text-sm">
                            {new Date(flag.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </Table.Td>
                        <Table.Td onClick={(e) => e.stopPropagation()}>
                          <Menu shadow="md" width={200} position="bottom-end">
                            <Menu.Target>
                              <ActionIcon variant="subtle" color="gray">
                                <MoreVertical size={18} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item
                                leftSection={<Eye size={16} />}
                                onClick={() => handleViewFlag(flag)}
                              >
                                {t('feature_flags.actions.view')}
                              </Menu.Item>
                              <Menu.Item
                                leftSection={<Edit size={16} />}
                                onClick={() => setUpdateModalData({ opened: true, flag })}
                              >
                                {t('feature_flags.actions.edit')}
                              </Menu.Item>
                              <Menu.Item
                                color="red"
                                leftSection={<Trash2 size={16} />}
                                onClick={() => handleDeleteFlag(flag)}
                              >
                                {t('feature_flags.actions.delete')}
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
                  {isFetchingNextPage ? t('feature_flags.loading_more') : t('feature_flags.load_more')}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <CreateFeatureFlagModal
        opened={createModalOpened}
        onClose={() => setCreateModalOpened(false)}
        projectKey={projectKey || ''}
        environmentId={environmentId || ''}
      />

      {updateModalData.flag && (
        <UpdateFeatureFlagModal
          opened={updateModalData.opened}
          onClose={() => setUpdateModalData({ opened: false, flag: null })}
          projectKey={projectKey || ''}
          environmentId={environmentId || ''}
          flag={updateModalData.flag}
        />
      )}
    </div>
  );
}

// Inline toggle component for enabling/disabling flags directly in the table
function FlagToggle({
  flag,
  projectKey,
  environmentId,
}: {
  flag: FeatureFlagResponse;
  projectKey: string;
  environmentId: string;
}) {
  const updateMutation = useUpdateFeatureFlagMutation(projectKey, environmentId, flag.flagKey);
  const { showError } = useShowBackendError();
  const { t } = useTranslation();

  const handleToggle = async () => {
    try {
      await updateMutation.mutateAsync({ enabled: !flag.enabled });
      notifications.show({
        title: t('common.success'),
        message: flag.enabled
          ? t('feature_flags.disabled_success')
          : t('feature_flags.enabled_success'),
        color: 'green',
      });
    } catch (error) {
      showError(error);
    }
  };

  return (
    <Switch
      checked={flag.enabled}
      onChange={handleToggle}
      disabled={updateMutation.isPending}
      size="sm"
    />
  );
}
