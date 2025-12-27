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
import { AlertCircle, Plus, MoreVertical, Trash2, Eye, Webhook, Building, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import {
  useWebhooksInfiniteQuery,
  useDeleteWebhookMutation,
} from '../../../shared/api/queries/webhooks';
import { useShowBackendError, useCurrentOrganization, usePageTitle } from '../../../shared/hooks';

export function WebhooksPage() {
  const { t } = useTranslation();
  usePageTitle(t('webhooks.page_title'));
  const navigate = useNavigate();

  const { currentOrganization, isLoading: isLoadingUser } = useCurrentOrganization();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useWebhooksInfiniteQuery();

  const deleteWebhookMutation = useDeleteWebhookMutation();
  const { showError } = useShowBackendError();

  const handleDeleteWebhook = (webhookId: string, webhookName: string) => {
    modals.openConfirmModal({
      title: t('webhooks.delete.title'),
      children: (
        <p className="text-sm">
          {t('webhooks.delete.confirmation', { name: webhookName })}
        </p>
      ),
      labels: { confirm: t('webhooks.delete.confirm'), cancel: t('webhooks.delete.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteWebhookMutation.mutateAsync(webhookId);
          notifications.show({
            title: t('common.success'),
            message: t('webhooks.delete.success_message'),
            color: 'green',
          });
        } catch (error) {
          showError(error);
        }
      },
    });
  };

  const formatEventName = (event: string) => {
    return event.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (isLoadingUser || isLoading) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!currentOrganization) {
    return (
      <div>
        <div className="flex flex-col gap-4">
          <Alert
            icon={<AlertCircle size={16} />}
            title={t('webhooks.no_organization_title')}
            color="yellow"
          >
            {t('webhooks.no_organization_message')}
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
          {t('webhooks.error_loading')}
        </Alert>
      </div>
    );
  }

  const webhooks = data?.pages.flatMap((page) => page.data) || [];
  const totalElements = data?.pages[0]?.totalElements || 0;

  return (
    <div>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {t('webhooks.title')}
            </h1>
            <p className="text-lg text-gray-500">
              {t('webhooks.subtitle', { count: totalElements })}
            </p>
          </div>
          <Button
            leftSection={<Plus size={18} />}
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
            onClick={() => navigate('/organization/webhooks/create')}
          >
            {t('webhooks.create_button')}
          </Button>
        </div>

        {/* Webhooks Table */}
        {webhooks.length === 0 ? (
          <Card withBorder p="xl" radius="md">
            <div className="flex justify-center">
              <div className="flex flex-col items-center gap-4">
                <Webhook size={48} strokeWidth={1.5} className="text-gray-400" />
                <p className="text-lg text-gray-500">
                  {t('webhooks.no_webhooks')}
                </p>
                <Button
                  leftSection={<Plus size={18} />}
                  onClick={() => navigate('/organization/webhooks/create')}
                >
                  {t('webhooks.create_first_webhook')}
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <>
            <Card withBorder padding={0} radius="md">
              <ScrollArea>
                <Table highlightOnHover verticalSpacing="md" horizontalSpacing="lg">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>{t('webhooks.table.name')}</Table.Th>
                      <Table.Th>{t('webhooks.table.url')}</Table.Th>
                      <Table.Th>{t('webhooks.table.events')}</Table.Th>
                      <Table.Th>{t('webhooks.table.status')}</Table.Th>
                      <Table.Th>{t('webhooks.table.last_delivery')}</Table.Th>
                      <Table.Th>{t('webhooks.table.actions')}</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {webhooks.map((webhook) => (
                      <Table.Tr key={webhook.id}>
                        <Table.Td>
                          <div className="flex gap-3 items-center">
                            <Webhook size={20} strokeWidth={2} />
                            <div>
                              <p className="font-medium text-sm">
                                {webhook.name}
                              </p>
                            </div>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded max-w-[200px] truncate">
                              {webhook.url}
                            </code>
                            <ExternalLink size={14} className="text-gray-400 shrink-0" />
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <div className="flex flex-wrap gap-1">
                            {webhook.events.slice(0, 2).map((event) => (
                              <Badge key={event} variant="light" color="blue" size="xs">
                                {formatEventName(event)}
                              </Badge>
                            ))}
                            {webhook.events.length > 2 && (
                              <Badge variant="light" color="gray" size="xs">
                                +{webhook.events.length - 2}
                              </Badge>
                            )}
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <Badge
                            variant="light"
                            color={webhook.enabled ? 'green' : 'gray'}
                            size="sm"
                          >
                            {webhook.enabled
                              ? t('webhooks.status.active')
                              : t('webhooks.status.disabled')}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          {webhook.lastSuccessAt ? (
                            <div className="flex flex-col">
                              <Badge variant="light" color="green" size="xs">
                                {t('webhooks.delivery.success')}
                              </Badge>
                              <span className="text-xs text-gray-500 mt-1">
                                {new Date(webhook.lastSuccessAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          ) : webhook.lastFailureAt ? (
                            <div className="flex flex-col">
                              <Badge variant="light" color="red" size="xs">
                                {t('webhooks.delivery.failed')}
                              </Badge>
                              <span className="text-xs text-gray-500 mt-1">
                                {new Date(webhook.lastFailureAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">
                              {t('webhooks.delivery.never')}
                            </span>
                          )}
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
                                leftSection={<Eye size={16} />}
                                onClick={() => navigate(`/organization/webhooks/${webhook.id}`)}
                              >
                                {t('webhooks.view_details')}
                              </Menu.Item>
                              <Menu.Item
                                color="red"
                                leftSection={<Trash2 size={16} />}
                                onClick={() => handleDeleteWebhook(webhook.id, webhook.name)}
                              >
                                {t('webhooks.delete.menu_item')}
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
              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => fetchNextPage()}
                  loading={isFetchingNextPage}
                  variant="light"
                >
                  {isFetchingNextPage ? t('webhooks.loading_more') : t('webhooks.load_more')}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

