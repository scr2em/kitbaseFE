import {
  Table,
  ActionIcon,
  Menu,
  Alert,
  Loader,
  Paper,
  Pagination,
  Badge,
  Tooltip,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useState } from 'react';
import { MoreVertical, Trash2, AlertCircle, Package } from 'lucide-react';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useBuildsQuery, useDeleteBuildMutation } from '../../../shared/api/queries';
import { useShowBackendError } from '../../../shared/hooks';
import type { BuildResponse } from '../../../generated-api';

export function ProjectBuildsPage() {
  const { t } = useTranslation();
  const { projectKey } = useParams<{ projectKey: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const { showError } = useShowBackendError();

  const pageSize = 10;
  const { data, isLoading, isError } = useBuildsQuery(
    projectKey || '',
    currentPage - 1, // API uses 0-based pagination
    pageSize
  );
  const deleteBuildMutation = useDeleteBuildMutation();

  const builds = data?.data || [];
  const totalPages = data?.totalPages || 0;

  const handleDeleteBuild = (buildId: string) => {
    modals.openConfirmModal({
      title: t('projects.detail.builds.delete.title'),
      children: (
        <p className="text-sm">
          {t('projects.detail.builds.delete.confirmation')}
        </p>
      ),
      labels: {
        confirm: t('projects.detail.builds.delete.confirm'),
        cancel: t('projects.detail.builds.delete.cancel'),
      },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteBuildMutation.mutateAsync({
            buildId,
          });
          
          // If we deleted the last item on the current page and it's not page 1, go back one page
          if (builds.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
          
          notifications.show({
            title: t('common.success'),
            message: t('projects.detail.builds.delete.success_message'),
            color: 'green',
          });
        } catch (error) {
          showError(error);
        }
      },
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '-';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const truncateHash = (hash?: string) => {
    if (!hash) return '-';
    return hash.substring(0, 7);
  };

  if (isLoading) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        icon={<AlertCircle size={16} />}
        title={t('common.error')}
        color="red"
      >
        {t('projects.detail.builds.error_loading')}
      </Alert>
    );
  }

  const hasBuilds = builds.length > 0;

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-xl font-semibold">{t('projects.detail.builds.title')}</h3>
          <p className="text-sm text-gray-500">
            {t('projects.detail.builds.subtitle')}
          </p>
        </div>

        {!hasBuilds ? (
          <Paper p="xl" withBorder className="text-center">
            <div className="flex flex-col gap-4 items-center">
              <Package size={48} strokeWidth={1.5} className="opacity-50" />
              <div>
                <p className="text-lg font-medium">
                  {t('projects.detail.builds.no_builds')}
                </p>
                <p className="text-sm text-gray-500">
                  {t('projects.detail.builds.create_first_build')}
                </p>
              </div>
            </div>
          </Paper>
        ) : (
          <Paper withBorder>
            <Table.ScrollContainer minWidth={800}>
              <Table highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>{t('projects.detail.builds.table.commit')}</Table.Th>
                    <Table.Th>{t('projects.detail.builds.table.branch')}</Table.Th>
                    <Table.Th>{t('projects.detail.builds.table.version')}</Table.Th>
                    <Table.Th>{t('projects.detail.builds.table.size')}</Table.Th>
                    <Table.Th>{t('projects.detail.builds.table.uploaded_at')}</Table.Th>
                    <Table.Th>{t('projects.detail.builds.table.actions')}</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {builds?.map((build: BuildResponse) => (
                    <Table.Tr key={build.id}>
                      <Table.Td>
                        <Tooltip label={build.commitHash} withArrow>
                          <div>
                            <p className="font-mono text-sm font-medium">
                              {truncateHash(build.commitHash)}
                            </p>
                            {build.commitMessage && (
                              <p className="text-xs text-gray-500 line-clamp-1">
                                {build.commitMessage}
                              </p>
                            )}
                          </div>
                        </Tooltip>
                      </Table.Td>
                      <Table.Td>
                        <Badge variant="light" size="sm">
                          {build.branchName}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <p className="text-sm">{build.nativeVersion}</p>
                      </Table.Td>
                      <Table.Td>
                        <p className="text-sm">{formatSize(build.buildSize)}</p>
                      </Table.Td>
                      <Table.Td>
                        <p className="text-sm">{formatDate(build.createdAt)}</p>
                      </Table.Td>
                      <Table.Td>
                        <Menu shadow="md" width={200}>
                          <Menu.Target>
                            <ActionIcon variant="subtle" color="gray">
                              <MoreVertical size={16} />
                            </ActionIcon>
                          </Menu.Target>

                          <Menu.Dropdown>
                            <Menu.Item
                              color="red"
                              leftSection={<Trash2 size={16} />}
                              onClick={() => handleDeleteBuild(build.id)}
                            >
                              {t('projects.detail.builds.delete.menu_item')}
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Paper>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              total={totalPages}
              value={currentPage}
              onChange={setCurrentPage}
              withEdges
            />
          </div>
        )}
      </div>
    </div>
  );
}










