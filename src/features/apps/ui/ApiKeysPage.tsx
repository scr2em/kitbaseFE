import {
  Button,
  Table,
  ActionIcon,
  Menu,
  Alert,
  Loader,
  Paper,
  Pagination,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useState } from 'react';
import { MoreVertical, Trash2, AlertCircle, Key } from 'lucide-react';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useApiKeysQuery, useCreateApiKeyMutation, useDeleteApiKeyMutation } from '../../../shared/api/queries';
import { useShowBackendError } from '../../../shared/hooks';
import { CreateApiKeyModal } from './CreateApiKeyModal';
import { ApiKeyCreatedModal } from './ApiKeyCreatedModal';

export function ApiKeysPage() {
  const { t } = useTranslation();
  const { bundleId } = useParams<{ bundleId: string }>();
  const [createModalOpened, setCreateModalOpened] = useState(false);
  const [createdKeyData, setCreatedKeyData] = useState<{ key: string; name: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { showError } = useShowBackendError();

  const pageSize = 10;
  const { data, isLoading, isError } = useApiKeysQuery(
    bundleId || '',
    currentPage - 1, // API uses 0-based pagination
    pageSize
  );
  const createApiKeyMutation = useCreateApiKeyMutation();
  const deleteApiKeyMutation = useDeleteApiKeyMutation();

  const apiKeys = data?.data || [];
  const totalPages = data?.totalPages || 0;

  const handleCreateKey = async (name: string) => {
    try {
      const result = await createApiKeyMutation.mutateAsync({
        bundleId: bundleId || '',
        name,
      });
      
      setCreateModalOpened(false);
      setCurrentPage(1); // Reset to first page after creating
      
      // Show the created key modal with the full key
      if (result.key) {
        setCreatedKeyData({ key: result.key, name: result.name });
      }
    } catch (error) {
      showError(error);
    }
  };

  const handleDeleteKey = (keyId: string, keyName: string) => {
    modals.openConfirmModal({
      title: t('apps.detail.api_keys.delete.title'),
      children: (
        <p className="text-sm">
          {t('apps.detail.api_keys.delete.confirmation', { name: keyName })}
        </p>
      ),
      labels: {
        confirm: t('apps.detail.api_keys.delete.confirm'),
        cancel: t('apps.detail.api_keys.delete.cancel'),
      },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteApiKeyMutation.mutateAsync({
            bundleId: bundleId || '',
            keyId,
          });
          
          // If we deleted the last item on the current page and it's not page 1, go back one page
          if (apiKeys.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
          
          notifications.show({
            title: t('common.success'),
            message: t('apps.detail.api_keys.delete.success_message'),
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
        {t('apps.detail.api_keys.error_loading')}
      </Alert>
    );
  }

  const hasKeys = apiKeys.length > 0;

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold">{t('apps.detail.api_keys.title')}</h3>
            <p className="text-sm text-gray-500">
              {t('apps.detail.api_keys.subtitle')}
            </p>
          </div>
          <Button
            leftSection={<Key size={16} />}
            onClick={() => setCreateModalOpened(true)}
          >
            {t('apps.detail.api_keys.create_button')}
          </Button>
        </div>

        {!hasKeys ? (
          <Paper p="xl" withBorder className="text-center">
            <div className="flex flex-col gap-4 items-center">
              <Key size={48} strokeWidth={1.5} className="opacity-50" />
              <div>
                <p className="text-lg font-medium">
                  {t('apps.detail.api_keys.no_keys')}
                </p>
                <p className="text-sm text-gray-500">
                  {t('apps.detail.api_keys.create_first_key')}
                </p>
              </div>
            </div>
          </Paper>
        ) : (
          <Paper withBorder>
            <Table.ScrollContainer minWidth={700}>
              <Table highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>{t('apps.detail.api_keys.table.name')}</Table.Th>
                    <Table.Th>{t('apps.detail.api_keys.table.key_prefix')}</Table.Th>
                    <Table.Th>{t('apps.detail.api_keys.table.created_at')}</Table.Th>
                    <Table.Th>{t('apps.detail.api_keys.table.last_used')}</Table.Th>
                    <Table.Th>{t('apps.detail.api_keys.table.actions')}</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {apiKeys?.map((key) => (
                    <Table.Tr key={key.id}>
                      <Table.Td>
                        <p className="font-medium">{key.name}</p>
                      </Table.Td>
                      <Table.Td>
                        <div className="flex gap-2 items-center">
                          <p className="font-mono text-sm">
                            {key.keyPrefix}
                          </p>
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <p className="text-sm">{formatDate(key.createdAt)}</p>
                      </Table.Td>
                      <Table.Td>
                        <p className={`text-sm ${key.lastUsedAt ? '' : 'text-gray-500'}`}>
                          {key.lastUsedAt
                            ? formatDate(key.lastUsedAt)
                            : t('apps.detail.api_keys.table.never_used')}
                        </p>
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
                              onClick={() => handleDeleteKey(key.id, key.name)}
                            >
                              {t('apps.detail.api_keys.delete.menu_item')}
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

      {createModalOpened && (
        <CreateApiKeyModal
          opened={true}
          onClose={() => setCreateModalOpened(false)}
          onSubmit={handleCreateKey}
          isLoading={createApiKeyMutation.isPending}
        />
      )}
      {createdKeyData && (
        <ApiKeyCreatedModal
          opened={true}
          onClose={() => setCreatedKeyData(null)}
          apiKey={createdKeyData?.key || ''}
          keyName={createdKeyData?.name || ''}
        />
      )}
    </div>
  );
}
