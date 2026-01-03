import {
  Badge,
  Card,
  Loader,
  Button,
  Table,
  Alert,
  ScrollArea,
  ActionIcon,
  Modal,
  TextInput,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useTranslation } from 'react-i18next';
import { AlertCircle, RefreshCw, Search, Filter, X, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useAuditLogsQuery } from '../../../shared/api/queries/audit-logs';
import { usePageTitle } from '../../../shared/hooks';
import type { AuditLogResponse } from '../../../generated-api';

interface FiltersState {
  action?: string;
  resourceType?: string;
  userId?: string;
  startDate?: string | null;
  endDate?: string | null;
}

export function AuditTrailPage() {
  const { t } = useTranslation();
  usePageTitle(t('audit_trail.page_title'));
  
  const [filters, setFilters] = useState<FiltersState>({});
  const [showFilters, setShowFilters] = useState(false);
  const [detailModal, setDetailModal] = useState<{
    opened: boolean;
    log: AuditLogResponse | null;
  }>({ opened: false, log: null });
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const queryFilters = {
    action: filters.action || undefined,
    resourceType: filters.resourceType || undefined,
    userId: filters.userId || undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useAuditLogsQuery(queryFilters);

  const toggleRowExpand = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getActionBadgeColor = (action: string) => {
    if (action.includes('CREATE') || action.includes('UPLOAD')) return 'green';
    if (action.includes('DELETE') || action.includes('REMOVE')) return 'red';
    if (action.includes('UPDATE') || action.includes('EDIT')) return 'blue';
    return 'gray';
  };

  const getStatusBadgeColor = (status?: number) => {
    if (!status) return 'gray';
    if (status >= 200 && status < 300) return 'green';
    if (status >= 400 && status < 500) return 'yellow';
    if (status >= 500) return 'red';
    return 'gray';
  };

  const formatAction = (action: string) => {
    return action.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined && v !== null && v !== '');

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
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
          {t('audit_trail.error_loading')}
        </Alert>
      </div>
    );
  }

  const allLogs = data?.pages.flatMap((page) => page.data) || [];
  const totalLogs = data?.pages[0]?.totalElements || 0;

  return (
    <div>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {t('audit_trail.title')}
            </h1>
            <p className="text-lg text-gray-500">
              {t('audit_trail.subtitle', { count: totalLogs })}
            </p>
          </div>
          <div className="flex gap-2">
            <ActionIcon
              variant="subtle"
              size="lg"
              onClick={() => refetch()}
              loading={isFetching && !isLoading}
              aria-label={t('audit_trail.refetch')}
            >
              <RefreshCw size={18} />
            </ActionIcon>
            <Button
              leftSection={<Filter size={18} />}
              variant={showFilters ? 'filled' : 'light'}
              onClick={() => setShowFilters(!showFilters)}
            >
              {t('audit_trail.filters.toggle')}
            </Button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card withBorder padding="md" radius="md">
            <div className="flex flex-wrap gap-4 items-end">
              <TextInput
                label={t('audit_trail.filters.action_label')}
                placeholder={t('audit_trail.filters.action_placeholder')}
                value={filters.action || ''}
                onChange={(e) => setFilters((prev) => ({ ...prev, action: e.target.value }))}
                leftSection={<Search size={16} />}
                className="w-48"
              />
              <TextInput
                label={t('audit_trail.filters.resource_type_label')}
                placeholder={t('audit_trail.filters.resource_type_placeholder')}
                value={filters.resourceType || ''}
                onChange={(e) => setFilters((prev) => ({ ...prev, resourceType: e.target.value }))}
                className="w-48"
              />
              <TextInput
                label={t('audit_trail.filters.user_id_label')}
                placeholder={t('audit_trail.filters.user_id_placeholder')}
                value={filters.userId || ''}
                onChange={(e) => setFilters((prev) => ({ ...prev, userId: e.target.value }))}
                className="w-48"
              />
              <DatePickerInput
                label={t('audit_trail.filters.start_date_label')}
                placeholder={t('audit_trail.filters.date_placeholder')}
                value={filters.startDate ? new Date(filters.startDate) : null}
                onChange={(date) => setFilters((prev) => ({ ...prev, startDate: date ? new Date(date as unknown as string).toISOString() : null }))}
                clearable
                className="w-44"
              />
              <DatePickerInput
                label={t('audit_trail.filters.end_date_label')}
                placeholder={t('audit_trail.filters.date_placeholder')}
                value={filters.endDate ? new Date(filters.endDate) : null}
                onChange={(date) => setFilters((prev) => ({ ...prev, endDate: date ? new Date(date as unknown as string).toISOString() : null }))}
                clearable
                className="w-44"
              />
              {hasActiveFilters && (
                <Button
                  variant="subtle"
                  color="gray"
                  leftSection={<X size={16} />}
                  onClick={clearFilters}
                >
                  {t('audit_trail.filters.clear')}
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Audit Logs Table */}
        <Card withBorder padding={0} radius="md">
          <ScrollArea>
            <Table highlightOnHover verticalSpacing="md" horizontalSpacing="lg">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="w-8"></Table.Th>
                  <Table.Th>{t('audit_trail.table.action')}</Table.Th>
                  <Table.Th>{t('audit_trail.table.resource')}</Table.Th>
                  <Table.Th>{t('audit_trail.table.method')}</Table.Th>
                  <Table.Th>{t('audit_trail.table.status')}</Table.Th>
                  <Table.Th>{t('audit_trail.table.timestamp')}</Table.Th>
                  <Table.Th>{t('audit_trail.table.actions')}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {allLogs.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={7}>
                      <div className="text-center py-8 text-gray-500">
                        {t('audit_trail.no_logs')}
                      </div>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  allLogs.map((log) => {
                    const isExpanded = expandedRows.has(log.id);
                    return (
                      <>
                        <Table.Tr key={log.id}>
                          <Table.Td>
                            <ActionIcon
                              variant="subtle"
                              color="gray"
                              size="sm"
                              onClick={() => toggleRowExpand(log.id)}
                            >
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </ActionIcon>
                          </Table.Td>
                          <Table.Td>
                            <Badge
                              color={getActionBadgeColor(log.action)}
                              variant="light"
                            >
                              {formatAction(log.action)}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <div className="flex flex-col">
                              {log.resourceType && (
                                <span className="text-xs text-gray-500">
                                  {log.resourceType}
                                </span>
                              )}
                              <span className="text-sm font-medium">
                                {log.resourceName || log.resourceId || '-'}
                              </span>
                            </div>
                          </Table.Td>
                          <Table.Td>
                            {log.httpMethod && (
                              <Badge
                                color={
                                  log.httpMethod === 'GET' ? 'blue' :
                                  log.httpMethod === 'POST' ? 'green' :
                                  log.httpMethod === 'PUT' || log.httpMethod === 'PATCH' ? 'yellow' :
                                  log.httpMethod === 'DELETE' ? 'red' : 'gray'
                                }
                                variant="outline"
                                size="sm"
                              >
                                {log.httpMethod}
                              </Badge>
                            )}
                          </Table.Td>
                          <Table.Td>
                            {log.responseStatus && (
                              <Badge
                                color={getStatusBadgeColor(log.responseStatus)}
                                variant="dot"
                              >
                                {log.responseStatus}
                              </Badge>
                            )}
                          </Table.Td>
                          <Table.Td>
                            <span className="text-sm">
                              {new Date(log.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </Table.Td>
                          <Table.Td>
                            <ActionIcon
                              variant="subtle"
                              color="gray"
                              onClick={() => setDetailModal({ opened: true, log })}
                            >
                              <Eye size={18} />
                            </ActionIcon>
                          </Table.Td>
                        </Table.Tr>
                        {isExpanded && (
                          <Table.Tr key={`${log.id}-details`}>
                            <Table.Td colSpan={7}>
                              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                  {log.endpoint && (
                                    <div>
                                      <span className="text-gray-500 block">{t('audit_trail.detail.endpoint')}</span>
                                      <code className="text-xs">{log.endpoint}</code>
                                    </div>
                                  )}
                                  {log.ipAddress && (
                                    <div>
                                      <span className="text-gray-500 block">{t('audit_trail.detail.ip_address')}</span>
                                      <span>{log.ipAddress}</span>
                                    </div>
                                  )}
                                  {log.userId && (
                                    <div>
                                      <span className="text-gray-500 block">{t('audit_trail.detail.user_id')}</span>
                                      <span className="font-mono text-xs">{log.userId}</span>
                                    </div>
                                  )}
                                  {log.errorMessage && (
                                    <div className="col-span-full">
                                      <span className="text-gray-500 block">{t('audit_trail.detail.error_message')}</span>
                                      <span className="text-red-500">{log.errorMessage}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Table.Td>
                          </Table.Tr>
                        )}
                      </>
                    );
                  })
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>

          {/* Load More Button */}
          {hasNextPage && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex justify-center">
                <Button
                  onClick={() => fetchNextPage()}
                  loading={isFetchingNextPage}
                  variant="subtle"
                >
                  {isFetchingNextPage
                    ? t('audit_trail.loading_more')
                    : t('audit_trail.load_more')}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Detail Modal */}
      <Modal
        opened={detailModal.opened}
        onClose={() => setDetailModal({ opened: false, log: null })}
        title={t('audit_trail.detail.modal_title')}
        size="lg"
        centered
      >
        {detailModal.log && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500 block mb-1">{t('audit_trail.detail.action')}</span>
                <Badge color={getActionBadgeColor(detailModal.log.action)} variant="light">
                  {formatAction(detailModal.log.action)}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-gray-500 block mb-1">{t('audit_trail.detail.timestamp')}</span>
                <span className="text-sm">
                  {new Date(detailModal.log.createdAt).toLocaleString()}
                </span>
              </div>
              {detailModal.log.resourceType && (
                <div>
                  <span className="text-sm text-gray-500 block mb-1">{t('audit_trail.detail.resource_type')}</span>
                  <span className="text-sm">{detailModal.log.resourceType}</span>
                </div>
              )}
              {detailModal.log.resourceName && (
                <div>
                  <span className="text-sm text-gray-500 block mb-1">{t('audit_trail.detail.resource_name')}</span>
                  <span className="text-sm">{detailModal.log.resourceName}</span>
                </div>
              )}
              {detailModal.log.resourceId && (
                <div>
                  <span className="text-sm text-gray-500 block mb-1">{t('audit_trail.detail.resource_id')}</span>
                  <code className="text-xs">{detailModal.log.resourceId}</code>
                </div>
              )}
              {detailModal.log.userId && (
                <div>
                  <span className="text-sm text-gray-500 block mb-1">{t('audit_trail.detail.user_id')}</span>
                  <code className="text-xs">{detailModal.log.userId}</code>
                </div>
              )}
              {detailModal.log.httpMethod && (
                <div>
                  <span className="text-sm text-gray-500 block mb-1">{t('audit_trail.detail.http_method')}</span>
                  <Badge
                    color={
                      detailModal.log.httpMethod === 'GET' ? 'blue' :
                      detailModal.log.httpMethod === 'POST' ? 'green' :
                      detailModal.log.httpMethod === 'PUT' || detailModal.log.httpMethod === 'PATCH' ? 'yellow' :
                      detailModal.log.httpMethod === 'DELETE' ? 'red' : 'gray'
                    }
                    variant="outline"
                    size="sm"
                  >
                    {detailModal.log.httpMethod}
                  </Badge>
                </div>
              )}
              {detailModal.log.responseStatus && (
                <div>
                  <span className="text-sm text-gray-500 block mb-1">{t('audit_trail.detail.response_status')}</span>
                  <Badge
                    color={getStatusBadgeColor(detailModal.log.responseStatus)}
                    variant="dot"
                  >
                    {detailModal.log.responseStatus}
                  </Badge>
                </div>
              )}
              {detailModal.log.endpoint && (
                <div className="col-span-2">
                  <span className="text-sm text-gray-500 block mb-1">{t('audit_trail.detail.endpoint')}</span>
                  <code className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded block overflow-x-auto">
                    {detailModal.log.endpoint}
                  </code>
                </div>
              )}
              {detailModal.log.ipAddress && (
                <div>
                  <span className="text-sm text-gray-500 block mb-1">{t('audit_trail.detail.ip_address')}</span>
                  <span className="text-sm">{detailModal.log.ipAddress}</span>
                </div>
              )}
              {detailModal.log.userAgent && (
                <div className="col-span-2">
                  <span className="text-sm text-gray-500 block mb-1">{t('audit_trail.detail.user_agent')}</span>
                  <span className="text-xs text-gray-600">{detailModal.log.userAgent}</span>
                </div>
              )}
              {detailModal.log.errorMessage && (
                <div className="col-span-2">
                  <span className="text-sm text-gray-500 block mb-1">{t('audit_trail.detail.error_message')}</span>
                  <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded p-2">
                    <span className="text-sm text-red-600 dark:text-red-400">{detailModal.log.errorMessage}</span>
                  </div>
                </div>
              )}
              {detailModal.log.metadata && (
                <div className="col-span-2">
                  <span className="text-sm text-gray-500 block mb-1">{t('audit_trail.detail.metadata')}</span>
                  <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                    {JSON.stringify(JSON.parse(detailModal.log.metadata), null, 2)}
                  </pre>
                </div>
              )}
              {detailModal.log.requestBody && (
                <div className="col-span-2">
                  <span className="text-sm text-gray-500 block mb-1">{t('audit_trail.detail.request_body')}</span>
                  <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto max-h-48">
                    {(() => {
                      try {
                        return JSON.stringify(JSON.parse(detailModal.log.requestBody), null, 2);
                      } catch {
                        return detailModal.log.requestBody;
                      }
                    })()}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
