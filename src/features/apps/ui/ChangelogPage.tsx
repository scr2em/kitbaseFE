import {
  Button,
  Table,
  ActionIcon,
  Menu,
  Alert,
  Loader,
  Paper,
  Pagination,
  Badge,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router';
import { useState } from 'react';
import { MoreVertical, Trash2, AlertCircle, FileText, Edit } from 'lucide-react';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  useChangelogsQuery,
  useDeleteChangelogMutation,
} from '../../../shared/api/queries/changelog';
import { useShowBackendError } from '../../../shared/hooks';
import type { Changelog } from '../model/changelog-schema';

export function ChangelogPage() {
  const { t } = useTranslation();
  const { bundleId } = useParams<{ bundleId: string }>();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { showError } = useShowBackendError();

  const pageSize = 10;
  const { data, isLoading, isError } = useChangelogsQuery(
    bundleId || '',
    currentPage - 1,
    pageSize
  );
  const deleteChangelogMutation = useDeleteChangelogMutation();

  const changelogs = data?.data || [];
  const totalPages = data?.totalPages || 0;

  const handleDelete = (changelog: Changelog) => {
    modals.openConfirmModal({
      title: t('apps.detail.changelog.delete.title'),
      children: (
        <p className="text-sm">
          {t('apps.detail.changelog.delete.confirmation', { version: changelog.version })}
        </p>
      ),
      labels: {
        confirm: t('apps.detail.changelog.delete.confirm'),
        cancel: t('apps.detail.changelog.delete.cancel'),
      },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteChangelogMutation.mutateAsync({
            bundleId: bundleId || '',
            id: changelog.id,
          });

          if (changelogs.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }

          notifications.show({
            title: t('common.success'),
            message: t('apps.detail.changelog.delete.success_message'),
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
    });
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
        {t('apps.detail.changelog.error_loading')}
      </Alert>
    );
  }

  const hasChangelogs = changelogs.length > 0;

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold">{t('apps.detail.changelog.title')}</h3>
            <p className="text-sm text-gray-500">
              {t('apps.detail.changelog.subtitle')}
            </p>
          </div>
          <Button
            leftSection={<FileText size={16} />}
            onClick={() => navigate(`/apps/${bundleId}/changelog/create`)}
          >
            {t('apps.detail.changelog.create_button')}
          </Button>
        </div>

        {!hasChangelogs ? (
          <Paper p="xl" withBorder className="text-center">
            <div className="flex flex-col gap-4 items-center">
              <FileText size={48} strokeWidth={1.5} className="opacity-50" />
              <div>
                <p className="text-lg font-medium">
                  {t('apps.detail.changelog.no_changelogs')}
                </p>
                <p className="text-sm text-gray-500">
                  {t('apps.detail.changelog.create_first')}
                </p>
              </div>
            </div>
          </Paper>
        ) : (
          <Paper withBorder>
            <Table.ScrollContainer minWidth={500}>
              <Table highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>{t('apps.detail.changelog.table.version')}</Table.Th>
                    <Table.Th>{t('apps.detail.changelog.table.status')}</Table.Th>
                    <Table.Th>{t('apps.detail.changelog.table.updated_at')}</Table.Th>
                    <Table.Th>{t('apps.detail.changelog.table.actions')}</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {changelogs.map((changelog) => (
                    <Table.Tr key={changelog.id}>
                      <Table.Td>
                        <p className="font-mono font-medium">{changelog.version}</p>
                      </Table.Td>
                      <Table.Td>
                        <Badge 
                          color={changelog.is_published ? 'green' : 'gray'} 
                          variant="light"
                          size="sm"
                        >
                          {changelog.is_published 
                            ? t('apps.detail.changelog.status.published') 
                            : t('apps.detail.changelog.status.draft')}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <p className="text-sm">{formatDate(changelog.updatedAt)}</p>
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
                              leftSection={<Edit size={16} />}
                              onClick={() => navigate(`/apps/${bundleId}/changelog/${changelog.id}/edit`)}
                            >
                              {t('apps.detail.changelog.edit.menu_item')}
                            </Menu.Item>
                            <Menu.Item
                              color="red"
                              leftSection={<Trash2 size={16} />}
                              onClick={() => handleDelete(changelog)}
                            >
                              {t('apps.detail.changelog.delete.menu_item')}
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
