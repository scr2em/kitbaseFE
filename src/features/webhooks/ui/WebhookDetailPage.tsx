import {
  Card,
  Loader,
  Button,
  Alert,
  Badge,
  Switch,
  Checkbox,
  Table,
  ScrollArea,
  Modal,
  Code,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import {
  ArrowLeft,
  Webhook,
  AlertCircle,
  Trash2,
  Check,
  X,
  Clock,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import {
  useWebhookQuery,
  useUpdateWebhookMutation,
  useDeleteWebhookMutation,
  useWebhookDeliveriesInfiniteQuery,
} from '../../../shared/api/queries/webhooks';
import { useShowBackendError } from '../../../shared/hooks';
import { updateWebhookSchema, webhookEventTypes, type UpdateWebhookFormData } from '../model/schema';
import { ControlledTextInput } from '../../../shared/controlled-form-fields';
import type { WebhookDeliveryResponse } from '../../../generated-api';

export function WebhookDetailPage() {
  const { t } = useTranslation();
  const { webhookId } = useParams<{ webhookId: string }>();
  const navigate = useNavigate();
  const [deliveryModalOpened, { open: openDeliveryModal, close: closeDeliveryModal }] = useDisclosure(false);
  const [selectedDelivery, setSelectedDelivery] = useState<WebhookDeliveryResponse | null>(null);

  const { data: webhook, isLoading, isError } = useWebhookQuery(webhookId || '');
  const updateWebhookMutation = useUpdateWebhookMutation(webhookId || '');
  const deleteWebhookMutation = useDeleteWebhookMutation();
  const { showError } = useShowBackendError();

  const {
    data: deliveriesData,
    isLoading: isLoadingDeliveries,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useWebhookDeliveriesInfiniteQuery(webhookId || '');

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<UpdateWebhookFormData>({
    resolver: zodResolver(updateWebhookSchema),
    values: webhook ? {
      name: webhook.name,
      url: webhook.url,
      secret: '',
      events: webhook.events,
      enabled: webhook.enabled,
    } : undefined,
  });

  const selectedEvents = watch('events') || [];
  const isEnabled = watch('enabled');

  const handleEventToggle = (event: typeof webhookEventTypes[number]) => {
    const currentEvents = selectedEvents || [];
    if (currentEvents.includes(event)) {
      setValue('events', currentEvents.filter((e) => e !== event), { shouldDirty: true });
    } else {
      setValue('events', [...currentEvents, event], { shouldDirty: true });
    }
  };

  const formatEventName = (event: string) => {
    return event.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const onSubmit = async (data: UpdateWebhookFormData) => {
    try {
      await updateWebhookMutation.mutateAsync({
        name: data.name,
        url: data.url,
        secret: data.secret || undefined,
        events: data.events,
        enabled: data.enabled,
      });
      notifications.show({
        title: t('common.success'),
        message: t('webhooks.update.success_message'),
        color: 'green',
      });
      reset(data);
    } catch (error) {
      showError(error);
    }
  };

  const handleDelete = () => {
    if (!webhook) return;
    
    modals.openConfirmModal({
      title: t('webhooks.delete.title'),
      children: (
        <p className="text-sm">
          {t('webhooks.delete.confirmation', { name: webhook.name })}
        </p>
      ),
      labels: { confirm: t('webhooks.delete.confirm'), cancel: t('webhooks.delete.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteWebhookMutation.mutateAsync(webhook.id);
          notifications.show({
            title: t('common.success'),
            message: t('webhooks.delete.success_message'),
            color: 'green',
          });
          navigate('/webhooks');
        } catch (error) {
          showError(error);
        }
      },
    });
  };

  const handleViewDelivery = (delivery: WebhookDeliveryResponse) => {
    setSelectedDelivery(delivery);
    openDeliveryModal();
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (isError || !webhook) {
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

  const deliveries = deliveriesData?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/webhooks')}
            className="p-1.5 -ml-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
            <Webhook size={18} className="text-white" strokeWidth={2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-slate-900">
                {webhook.name}
              </h1>
              <Badge
                variant="light"
                color={webhook.enabled ? 'green' : 'gray'}
                size="sm"
              >
                {webhook.enabled
                  ? t('webhooks.status.active')
                  : t('webhooks.status.disabled')}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                {webhook.url}
              </code>
            </p>
          </div>
        </div>
        <Button
          variant="subtle"
          color="red"
          leftSection={<Trash2 size={16} />}
          onClick={handleDelete}
        >
          {t('webhooks.delete.menu_item')}
        </Button>
      </div>

      {/* Update Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card withBorder radius="md" className="p-6">
          <h2 className="text-lg font-semibold mb-4">{t('webhooks.update.section_title')}</h2>
          <div className="flex flex-col gap-6">
            {/* Name */}
            <ControlledTextInput
              control={control}
              name="name"
              label={t('webhooks.create.name_label')}
              placeholder={t('webhooks.create.name_placeholder')}
            />

            {/* URL */}
            <ControlledTextInput
              control={control}
              name="url"
              label={t('webhooks.create.url_label')}
              placeholder={t('webhooks.create.url_placeholder')}
              description={t('webhooks.create.url_description')}
            />

            {/* Secret */}
            <ControlledTextInput
              control={control}
              name="secret"
              label={t('webhooks.update.secret_label')}
              placeholder={t('webhooks.update.secret_placeholder')}
              description={t('webhooks.update.secret_description')}
            />

            {/* Events */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('webhooks.create.events_label')}
              </label>
              <p className="text-sm text-gray-500 mb-3">
                {t('webhooks.create.events_description')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {webhookEventTypes.map((event) => (
                  <div
                    key={event}
                    className={`
                      p-4 rounded-lg border cursor-pointer transition-all
                      ${selectedEvents?.includes(event)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                      }
                    `}
                    onClick={() => handleEventToggle(event)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedEvents?.includes(event) || false}
                        onChange={() => handleEventToggle(event)}
                        readOnly
                      />
                      <div>
                        <p className="font-medium text-sm">
                          {formatEventName(event)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {t(`webhooks.events.${event}`)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enabled Switch */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
              <div>
                <p className="font-medium text-sm">
                  {t('webhooks.create.enabled_label')}
                </p>
                <p className="text-xs text-gray-500">
                  {t('webhooks.create.enabled_description')}
                </p>
              </div>
              <Switch
                checked={isEnabled}
                onChange={(event) => setValue('enabled', event.currentTarget.checked, { shouldDirty: true })}
                size="md"
              />
            </div>

            {/* Actions */}
            {isDirty && (
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button
                  variant="subtle"
                  onClick={() => reset()}
                >
                  {t('webhooks.update.cancel_button')}
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  variant="gradient"
                  gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
                >
                  {t('webhooks.update.submit_button')}
                </Button>
              </div>
            )}
          </div>
        </Card>
      </form>

      {/* Deliveries Section */}
      <Card withBorder radius="md" className="p-6">
        <h2 className="text-lg font-semibold mb-4">{t('webhooks.deliveries.title')}</h2>
        <p className="text-sm text-gray-500 mb-4">{t('webhooks.deliveries.subtitle')}</p>

        {isLoadingDeliveries ? (
          <div className="flex justify-center py-8">
            <Loader size="md" />
          </div>
        ) : deliveries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock size={32} className="mx-auto mb-2 text-gray-300" />
            <p>{t('webhooks.deliveries.no_deliveries')}</p>
          </div>
        ) : (
          <>
            <ScrollArea>
              <Table highlightOnHover verticalSpacing="md" horizontalSpacing="lg">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>{t('webhooks.deliveries.table.status')}</Table.Th>
                    <Table.Th>{t('webhooks.deliveries.table.event')}</Table.Th>
                    <Table.Th>{t('webhooks.deliveries.table.status_code')}</Table.Th>
                    <Table.Th>{t('webhooks.deliveries.table.duration')}</Table.Th>
                    <Table.Th>{t('webhooks.deliveries.table.timestamp')}</Table.Th>
                    <Table.Th>{t('webhooks.deliveries.table.actions')}</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {deliveries.map((delivery) => (
                    <Table.Tr key={delivery.id}>
                      <Table.Td>
                        <Badge
                          variant="light"
                          color={delivery.success ? 'green' : 'red'}
                          size="sm"
                          leftSection={delivery.success ? <Check size={12} /> : <X size={12} />}
                        >
                          {delivery.success
                            ? t('webhooks.deliveries.status.success')
                            : t('webhooks.deliveries.status.failed')}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge variant="light" color="blue" size="xs">
                          {formatEventName(delivery.eventType)}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        {delivery.statusCode ? (
                          <code className={`text-xs px-2 py-1 rounded ${
                            delivery.statusCode >= 200 && delivery.statusCode < 300
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {delivery.statusCode}
                          </code>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </Table.Td>
                      <Table.Td>
                        {delivery.durationMs !== undefined ? (
                          <span className="text-sm">
                            {delivery.durationMs}ms
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <span className="text-sm text-gray-600">
                          {new Date(delivery.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </span>
                      </Table.Td>
                      <Table.Td>
                        <Button
                          variant="subtle"
                          size="xs"
                          onClick={() => handleViewDelivery(delivery)}
                        >
                          {t('webhooks.deliveries.view_details')}
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>

            {/* Load More Button */}
            {hasNextPage && (
              <div className="flex justify-center mt-4">
                <Button
                  onClick={() => fetchNextPage()}
                  loading={isFetchingNextPage}
                  variant="light"
                  size="sm"
                >
                  {isFetchingNextPage ? t('webhooks.loading_more') : t('webhooks.load_more')}
                </Button>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Delivery Details Modal */}
      <Modal
        opened={deliveryModalOpened}
        onClose={closeDeliveryModal}
        title={t('webhooks.deliveries.modal_title')}
        size="lg"
      >
        {selectedDelivery && (
          <div className="flex flex-col gap-4">
            {/* Status */}
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
              <span className="text-sm font-medium">{t('webhooks.deliveries.modal.status')}</span>
              <Badge
                variant="light"
                color={selectedDelivery.success ? 'green' : 'red'}
                size="md"
              >
                {selectedDelivery.success
                  ? t('webhooks.deliveries.status.success')
                  : t('webhooks.deliveries.status.failed')}
              </Badge>
            </div>

            {/* Event Type */}
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
              <span className="text-sm font-medium">{t('webhooks.deliveries.modal.event_type')}</span>
              <Badge variant="light" color="blue" size="sm">
                {formatEventName(selectedDelivery.eventType)}
              </Badge>
            </div>

            {/* Status Code */}
            {selectedDelivery.statusCode && (
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                <span className="text-sm font-medium">{t('webhooks.deliveries.modal.status_code')}</span>
                <code className={`text-sm px-2 py-1 rounded ${
                  selectedDelivery.statusCode >= 200 && selectedDelivery.statusCode < 300
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {selectedDelivery.statusCode}
                </code>
              </div>
            )}

            {/* Duration */}
            {selectedDelivery.durationMs !== undefined && (
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                <span className="text-sm font-medium">{t('webhooks.deliveries.modal.duration')}</span>
                <span className="text-sm">{selectedDelivery.durationMs}ms</span>
              </div>
            )}

            {/* Timestamp */}
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
              <span className="text-sm font-medium">{t('webhooks.deliveries.modal.timestamp')}</span>
              <span className="text-sm">
                {new Date(selectedDelivery.createdAt).toLocaleString()}
              </span>
            </div>

            {/* Error Message */}
            {selectedDelivery.errorMessage && (
              <div className="p-3 rounded-lg bg-red-50">
                <span className="text-sm font-medium text-red-700 block mb-2">
                  {t('webhooks.deliveries.modal.error')}
                </span>
                <p className="text-sm text-red-600">
                  {selectedDelivery.errorMessage}
                </p>
              </div>
            )}

            {/* Request Payload */}
            {selectedDelivery.requestPayload && (
              <div>
                <span className="text-sm font-medium block mb-2">
                  {t('webhooks.deliveries.modal.request_payload')}
                </span>
                <Code block className="text-xs max-h-48 overflow-auto">
                  {JSON.stringify(selectedDelivery.requestPayload, null, 2)}
                </Code>
              </div>
            )}

            {/* Response Body */}
            {selectedDelivery.responseBody && (
              <div>
                <span className="text-sm font-medium block mb-2">
                  {t('webhooks.deliveries.modal.response_body')}
                </span>
                <Code block className="text-xs max-h-48 overflow-auto">
                  {selectedDelivery.responseBody}
                </Code>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

