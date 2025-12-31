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
import { AlertCircle, Plus, MoreVertical, Trash2, Edit, Layers } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import {
  useEnvironmentsInfiniteQuery,
  useDeleteEnvironmentMutation,
} from '../../../shared/api/queries/environments';
import { useShowBackendError } from '../../../shared/hooks';
import { CreateEnvironmentModal } from './CreateEnvironmentModal';
import { UpdateEnvironmentModal } from './UpdateEnvironmentModal';
import type { EnvironmentResponse } from '../../../generated-api';

export function EnvironmentsPage() {
  const { t } = useTranslation();
  const { projectKey } = useParams<{ projectKey: string }>();
  const [createModalOpened, setCreateModalOpened] = useState(false);
  const [updateModalData, setUpdateModalData] = useState<{
    opened: boolean;
    environment: EnvironmentResponse | null;
  }>({ opened: false, environment: null });

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useEnvironmentsInfiniteQuery(projectKey || '');

  const deleteEnvironmentMutation = useDeleteEnvironmentMutation(projectKey || '');
  const { showError } = useShowBackendError();

  const handleDeleteEnvironment = (environmentName: string) => {
    modals.openConfirmModal({
      title: t('environments.delete.title'),
      children: (
        <p className="text-sm">
          {t('environments.delete.confirmation', { name: environmentName })}
        </p>
      ),
      labels: { confirm: t('environments.delete.confirm'), cancel: t('environments.delete.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteEnvironmentMutation.mutateAsync(environmentName);
          notifications.show({
            title: t('common.success'),
            message: t('environments.delete.success_message'),
            color: 'green',
          });
        } catch (error) {
          showError(error);
        }
      },
    });
  };

  const handleUpdateEnvironment = (environment: EnvironmentResponse) => {
    setUpdateModalData({ opened: true, environment });
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
          {t('environments.error_loading')}
        </Alert>
      </div>
    );
  }

  const environments = data?.pages.flatMap((page) => page.data) || [];
  const totalElements = data?.pages[0]?.totalElements || 0;

  return (
    <div>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-1">
              {t('environments.title')}
            </h2>
            <p className="text-sm text-slate-500">
              {t('environments.subtitle', { count: totalElements })}
            </p>
          </div>
          <Button
            leftSection={<Plus size={16} />}
            size="sm"
            onClick={() => setCreateModalOpened(true)}
          >
            {t('environments.create_button')}
          </Button>
        </div>

        {/* Environments Table */}
        {environments.length === 0 ? (
          <Card withBorder p="xl" radius="md">
            <div className="flex justify-center">
              <div className="flex flex-col items-center gap-4">
                <Layers size={48} strokeWidth={1.5} className="text-slate-400" />
                <p className="text-base text-slate-500">
                  {t('environments.no_environments')}
                </p>
                <Button
                  leftSection={<Plus size={16} />}
                  size="sm"
                  onClick={() => setCreateModalOpened(true)}
                >
                  {t('environments.create_first_environment')}
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
                      <Table.Th>{t('environments.table.name')}</Table.Th>
                      <Table.Th>{t('environments.table.description')}</Table.Th>
                      <Table.Th>{t('environments.table.created_at')}</Table.Th>
                      <Table.Th>{t('environments.table.updated_at')}</Table.Th>
                      <Table.Th>{t('environments.table.actions')}</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {environments.map((environment) => (
                      <Table.Tr key={environment.name}>
                        <Table.Td>
                          <div className="flex gap-3 items-center">
                            <Layers size={18} strokeWidth={2} className="text-slate-500" />
                            <div>
                              <p className="font-medium text-sm">
                                {environment.name}
                              </p>
                           
                            </div>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <p className={`text-sm ${environment.description ? '' : 'text-slate-500'}`}>
                            {environment.description || t('environments.no_description')}
                          </p>
                        </Table.Td>
                        <Table.Td>
                          <p className="text-sm">
                            {new Date(environment.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </Table.Td>
                        <Table.Td>
                          <p className="text-sm">
                            {new Date(environment.updatedAt).toLocaleDateString('en-US', {
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
                                onClick={() => handleUpdateEnvironment(environment)}
                              >
                                {t('environments.update.menu_item')}
                              </Menu.Item>
                              <Menu.Item
                                color="red"
                                leftSection={<Trash2 size={16} />}
                                onClick={() => handleDeleteEnvironment(environment.name)}
                              >
                                {t('environments.delete.menu_item')}
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
                  {isFetchingNextPage ? t('environments.loading_more') : t('environments.load_more')}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {projectKey && (
        <CreateEnvironmentModal
          opened={createModalOpened}
          onClose={() => setCreateModalOpened(false)}
          projectKey={projectKey}
        />
      )}

      {updateModalData.environment && projectKey && (
        <UpdateEnvironmentModal
          opened={updateModalData.opened}
          onClose={() => setUpdateModalData({ opened: false, environment: null })}
          projectKey={projectKey}
          environment={updateModalData.environment}
        />
      )}
    </div>
  );
}






