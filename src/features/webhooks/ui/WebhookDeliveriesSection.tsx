import {
  Card,
  Loader,
  Button,
  Badge,
  Table,
  ScrollArea,
  Modal,
  Code,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Check, X, Clock } from 'lucide-react';
import { useWebhookDeliveriesInfiniteQuery } from '../../../shared/api/queries/webhooks';
import type { WebhookDeliveryResponse } from '../../../generated-api';

interface WebhookDeliveriesSectionProps {
  webhookId: string;
}

const formatEventName = (event: string) => {
  return event
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function WebhookDeliveriesSection({ webhookId }: WebhookDeliveriesSectionProps) {
  const { t } = useTranslation();
  const [deliveryModalOpened, { open: openDeliveryModal, close: closeDeliveryModal }] =
    useDisclosure(false);
  const [selectedDelivery, setSelectedDelivery] = useState<WebhookDeliveryResponse | null>(null);

  const {
    data: deliveriesData,
    isLoading: isLoadingDeliveries,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useWebhookDeliveriesInfiniteQuery(webhookId);

  const deliveries = deliveriesData?.pages.flatMap((page) => page.data) || [];

  const handleViewDelivery = (delivery: WebhookDeliveryResponse) => {
    setSelectedDelivery(delivery);
    openDeliveryModal();
  };

  return (
    <>
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
                          <code
                            className={`text-xs px-2 py-1 rounded ${
                              delivery.statusCode >= 200 && delivery.statusCode < 300
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {delivery.statusCode}
                          </code>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </Table.Td>
                      <Table.Td>
                        {delivery.durationMs !== undefined ? (
                          <span className="text-sm">{delivery.durationMs}ms</span>
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
              <span className="text-sm font-medium">
                {t('webhooks.deliveries.modal.event_type')}
              </span>
              <Badge variant="light" color="blue" size="sm">
                {formatEventName(selectedDelivery.eventType)}
              </Badge>
            </div>

            {/* Status Code */}
            {selectedDelivery.statusCode && (
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                <span className="text-sm font-medium">
                  {t('webhooks.deliveries.modal.status_code')}
                </span>
                <code
                  className={`text-sm px-2 py-1 rounded ${
                    selectedDelivery.statusCode >= 200 && selectedDelivery.statusCode < 300
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {selectedDelivery.statusCode}
                </code>
              </div>
            )}

            {/* Duration */}
            {selectedDelivery.durationMs !== undefined && (
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                <span className="text-sm font-medium">
                  {t('webhooks.deliveries.modal.duration')}
                </span>
                <span className="text-sm">{selectedDelivery.durationMs}ms</span>
              </div>
            )}

            {/* Timestamp */}
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
              <span className="text-sm font-medium">
                {t('webhooks.deliveries.modal.timestamp')}
              </span>
              <span className="text-sm">{new Date(selectedDelivery.createdAt).toLocaleString()}</span>
            </div>

            {/* Error Message */}
            {selectedDelivery.errorMessage && (
              <div className="p-3 rounded-lg bg-red-50">
                <span className="text-sm font-medium text-red-700 block mb-2">
                  {t('webhooks.deliveries.modal.error')}
                </span>
                <p className="text-sm text-red-600">{selectedDelivery.errorMessage}</p>
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
    </>
  );
}

