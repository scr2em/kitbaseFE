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
import { AlertCircle, RefreshCw, Search, Filter, X } from 'lucide-react';
import { useState } from 'react';
import { useAuditLogsQuery } from '../../../shared/api/queries/audit-logs';
import { usePageTitle } from '../../../shared/hooks';
import type { AuditLogResponse } from '../../../generated-api';

// Helper to render a simple field
function MetadataField({ label, value }: { label: string; value?: string | number | boolean | null }) {
  if (value === undefined || value === null) return null;
  const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value);
  return (
    <div>
      <span className="text-xs text-gray-500">{label}</span>
      <p className="text-sm font-medium">{displayValue}</p>
    </div>
  );
}

// Helper to render a diff between before/after
function MetadataDiff({ label, before, after }: { label: string; before?: string; after?: string }) {
  if (before === after) return null;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-20">{label}:</span>
      {before && <span className="text-sm text-red-500 line-through">{before}</span>}
      {before && after && <span className="text-gray-400">→</span>}
      {after && <span className="text-sm text-green-600 font-medium">{after}</span>}
    </div>
  );
}

// API Key Created
function ApiKeyCreatedMetadata({ metadata }: { metadata: { after?: { name?: string; keyPrefix?: string; projectId?: string; environmentId?: string } } }) {
  const { after } = metadata;
  if (!after) return null;
  return (
    <div className="grid grid-cols-2 gap-3">
      <MetadataField label="Name" value={after.name} />
      <MetadataField label="Key Prefix" value={after.keyPrefix} />
    </div>
  );
}

// API Key Deleted
function ApiKeyDeletedMetadata({ metadata }: { metadata: { before?: { name?: string; keyPrefix?: string } } }) {
  const { before } = metadata;
  if (!before) return null;
  return (
    <div className="grid grid-cols-2 gap-3">
      <MetadataField label="Name" value={before.name} />
      <MetadataField label="Key Prefix" value={before.keyPrefix} />
    </div>
  );
}

// Member Role Updated
function MemberRoleUpdatedMetadata({ metadata }: { metadata: { before?: { roleName?: string }; after?: { roleName?: string } } }) {
  return (
    <div className="flex flex-col gap-2">
      <MetadataDiff label="Role" before={metadata.before?.roleName} after={metadata.after?.roleName} />
    </div>
  );
}

// Member Removed
function MemberRemovedMetadata({ metadata }: { metadata: { before?: { email?: string; roleName?: string } } }) {
  const { before } = metadata;
  if (!before) return null;
  return (
    <div className="grid grid-cols-2 gap-3">
      <MetadataField label="Email" value={before.email} />
      <MetadataField label="Role" value={before.roleName} />
    </div>
  );
}

// Environment Created
function EnvironmentCreatedMetadata({ metadata }: { metadata: { after?: { name?: string; description?: string } } }) {
  const { after } = metadata;
  if (!after) return null;
  return (
    <div className="grid grid-cols-2 gap-3">
      <MetadataField label="Name" value={after.name} />
      <MetadataField label="Description" value={after.description} />
    </div>
  );
}

// Environment Updated
function EnvironmentUpdatedMetadata({ metadata }: { metadata: { before?: { name?: string; description?: string }; after?: { name?: string; description?: string } } }) {
  return (
    <div className="flex flex-col gap-2">
      <MetadataDiff label="Name" before={metadata.before?.name} after={metadata.after?.name} />
      <MetadataDiff label="Description" before={metadata.before?.description} after={metadata.after?.description} />
    </div>
  );
}

// Environment Deleted
function EnvironmentDeletedMetadata({ metadata }: { metadata: { before?: { name?: string; description?: string } } }) {
  const { before } = metadata;
  if (!before) return null;
  return (
    <div className="grid grid-cols-2 gap-3">
      <MetadataField label="Name" value={before.name} />
      <MetadataField label="Description" value={before.description} />
    </div>
  );
}

// Feature Flag Created
function FeatureFlagCreatedMetadata({ metadata }: { metadata: { after?: { flagKey?: string; name?: string; valueType?: string; enabled?: boolean } } }) {
  const { after } = metadata;
  if (!after) return null;
  return (
    <div className="grid grid-cols-2 gap-3">
      <MetadataField label="Flag Key" value={after.flagKey} />
      <MetadataField label="Name" value={after.name} />
      <MetadataField label="Value Type" value={after.valueType} />
      <MetadataField label="Enabled" value={after.enabled} />
    </div>
  );
}

// Feature Flag Updated
function FeatureFlagUpdatedMetadata({ metadata }: { metadata: { before?: { name?: string; enabled?: boolean }; after?: { name?: string; enabled?: boolean } } }) {
  return (
    <div className="flex flex-col gap-2">
      <MetadataDiff label="Name" before={metadata.before?.name} after={metadata.after?.name} />
      <MetadataDiff label="Enabled" before={metadata.before?.enabled?.toString()} after={metadata.after?.enabled?.toString()} />
    </div>
  );
}

// Feature Flag Rules Updated
function FeatureFlagRulesUpdatedMetadata({ metadata }: { metadata: { before?: { ruleCount?: number }; after?: { ruleCount?: number } } }) {
  return (
    <div className="flex flex-col gap-2">
      <MetadataDiff label="Rule Count" before={metadata.before?.ruleCount?.toString()} after={metadata.after?.ruleCount?.toString()} />
    </div>
  );
}

// Segment Created
function SegmentCreatedMetadata({ metadata }: { metadata: { after?: { name?: string; key?: string; description?: string } } }) {
  const { after } = metadata;
  if (!after) return null;
  return (
    <div className="grid grid-cols-2 gap-3">
      <MetadataField label="Name" value={after.name} />
      <MetadataField label="Key" value={after.key} />
      <MetadataField label="Description" value={after.description} />
    </div>
  );
}

// Segment Updated
function SegmentUpdatedMetadata({ metadata }: { metadata: { before?: { name?: string; matchType?: string }; after?: { name?: string; matchType?: string } } }) {
  return (
    <div className="flex flex-col gap-2">
      <MetadataDiff label="Name" before={metadata.before?.name} after={metadata.after?.name} />
      <MetadataDiff label="Match Type" before={metadata.before?.matchType} after={metadata.after?.matchType} />
    </div>
  );
}

// Segment Deleted
function SegmentDeletedMetadata({ metadata }: { metadata: { before?: { name?: string; key?: string } } }) {
  const { before } = metadata;
  if (!before) return null;
  return (
    <div className="grid grid-cols-2 gap-3">
      <MetadataField label="Name" value={before.name} />
      <MetadataField label="Key" value={before.key} />
    </div>
  );
}

// Webhook Created
function WebhookCreatedMetadata({ metadata }: { metadata: { after?: { name?: string; url?: string; enabled?: boolean; events?: string[] } } }) {
  const { after } = metadata;
  if (!after) return null;
  return (
    <div className="grid grid-cols-2 gap-3">
      <MetadataField label="Name" value={after.name} />
      <MetadataField label="URL" value={after.url} />
      <MetadataField label="Enabled" value={after.enabled} />
      <MetadataField label="Events" value={after.events?.join(', ')} />
    </div>
  );
}

// Webhook Updated
function WebhookUpdatedMetadata({ metadata }: { metadata: { before?: { name?: string; url?: string; enabled?: boolean }; after?: { name?: string; url?: string; enabled?: boolean } } }) {
  return (
    <div className="flex flex-col gap-2">
      <MetadataDiff label="Name" before={metadata.before?.name} after={metadata.after?.name} />
      <MetadataDiff label="URL" before={metadata.before?.url} after={metadata.after?.url} />
      <MetadataDiff label="Enabled" before={metadata.before?.enabled?.toString()} after={metadata.after?.enabled?.toString()} />
    </div>
  );
}

// Webhook Deleted
function WebhookDeletedMetadata({ metadata }: { metadata: { before?: { name?: string; url?: string } } }) {
  const { before } = metadata;
  if (!before) return null;
  return (
    <div className="grid grid-cols-2 gap-3">
      <MetadataField label="Name" value={before.name} />
      <MetadataField label="URL" value={before.url} />
    </div>
  );
}

// Changelog Created
function ChangelogCreatedMetadata({ metadata }: { metadata: { after?: { version?: string; title?: string; status?: string } } }) {
  const { after } = metadata;
  if (!after) return null;
  return (
    <div className="grid grid-cols-2 gap-3">
      <MetadataField label="Version" value={after.version} />
      <MetadataField label="Title" value={after.title} />
      <MetadataField label="Status" value={after.status} />
    </div>
  );
}

// Changelog Updated
function ChangelogUpdatedMetadata({ metadata }: { metadata: { before?: { version?: string; status?: string }; after?: { version?: string; status?: string } } }) {
  return (
    <div className="flex flex-col gap-2">
      <MetadataDiff label="Version" before={metadata.before?.version} after={metadata.after?.version} />
      <MetadataDiff label="Status" before={metadata.before?.status} after={metadata.after?.status} />
    </div>
  );
}

// Changelog Deleted
function ChangelogDeletedMetadata({ metadata }: { metadata: { before?: { version?: string; title?: string } } }) {
  const { before } = metadata;
  if (!before) return null;
  return (
    <div className="grid grid-cols-2 gap-3">
      <MetadataField label="Version" value={before.version} />
      <MetadataField label="Title" value={before.title} />
    </div>
  );
}

// Invitation Accepted
function InvitationAcceptedMetadata({ metadata }: { metadata: { after?: { email?: string; roleName?: string } } }) {
  const { after } = metadata;
  if (!after) return null;
  return (
    <div className="grid grid-cols-2 gap-3">
      <MetadataField label="Email" value={after.email} />
      <MetadataField label="Role" value={after.roleName} />
    </div>
  );
}

// Invitation Revoked/Canceled
function InvitationRevokedMetadata({ metadata }: { metadata: { before?: { email?: string; roleName?: string } } }) {
  const { before } = metadata;
  if (!before) return null;
  return (
    <div className="grid grid-cols-2 gap-3">
      <MetadataField label="Email" value={before.email} />
      <MetadataField label="Role" value={before.roleName} />
    </div>
  );
}

// Organization Updated
function OrganizationUpdatedMetadata({ metadata }: { metadata: { before?: { name?: string }; after?: { name?: string } } }) {
  return (
    <div className="flex flex-col gap-2">
      <MetadataDiff label="Name" before={metadata.before?.name} after={metadata.after?.name} />
    </div>
  );
}

// OTA Update Deployed
function OtaUpdateDeployedMetadata({ metadata }: { metadata: { after?: { nativeVersion?: string; updateStrategy?: string; rolloutPercentage?: number } } }) {
  const { after } = metadata;
  if (!after) return null;
  return (
    <div className="grid grid-cols-2 gap-3">
      <MetadataField label="Native Version" value={after.nativeVersion} />
      <MetadataField label="Update Strategy" value={after.updateStrategy} />
      <MetadataField label="Rollout %" value={after.rolloutPercentage} />
    </div>
  );
}

// User Login
function UserLoginMetadata({ metadata }: { metadata: { after?: { email?: string; ipAddress?: string; success?: boolean; failureReason?: string } } }) {
  const { after } = metadata;
  if (!after) return null;
  return (
    <div className="grid grid-cols-2 gap-3">
      <MetadataField label="Email" value={after.email} />
      <MetadataField label="IP Address" value={after.ipAddress} />
      {after.failureReason && <MetadataField label="Failure Reason" value={after.failureReason} />}
    </div>
  );
}

// Password Changed
function PasswordChangedMetadata({ metadata }: { metadata: { after?: { email?: string; changeType?: string } } }) {
  const { after } = metadata;
  if (!after) return null;
  return (
    <div className="grid grid-cols-2 gap-3">
      <MetadataField label="Email" value={after.email} />
      <MetadataField label="Change Type" value={after.changeType} />
    </div>
  );
}

// Main switch component
function ActionMetadataDisplay({ log }: { log: AuditLogResponse }) {
  if (!('metadata' in log) || !log.metadata) {
    return null;
  }

  const metadata = log.metadata as Record<string, unknown>;

  switch (log.action) {
    case 'API_KEY_CREATED':
      return <ApiKeyCreatedMetadata metadata={metadata} />;
    case 'API_KEY_DELETED':
      return <ApiKeyDeletedMetadata metadata={metadata} />;
    case 'MEMBER_ROLE_UPDATED':
      return <MemberRoleUpdatedMetadata metadata={metadata} />;
    case 'MEMBER_REMOVED':
      return <MemberRemovedMetadata metadata={metadata} />;
    case 'ENVIRONMENT_CREATED':
      return <EnvironmentCreatedMetadata metadata={metadata} />;
    case 'ENVIRONMENT_UPDATED':
      return <EnvironmentUpdatedMetadata metadata={metadata} />;
    case 'ENVIRONMENT_DELETED':
      return <EnvironmentDeletedMetadata metadata={metadata} />;
    case 'FEATURE_FLAG_CREATED':
      return <FeatureFlagCreatedMetadata metadata={metadata} />;
    case 'FEATURE_FLAG_UPDATED':
      return <FeatureFlagUpdatedMetadata metadata={metadata} />;
    case 'FEATURE_FLAG_RULES_UPDATED':
      return <FeatureFlagRulesUpdatedMetadata metadata={metadata} />;
    case 'SEGMENT_CREATED':
      return <SegmentCreatedMetadata metadata={metadata} />;
    case 'SEGMENT_UPDATED':
      return <SegmentUpdatedMetadata metadata={metadata} />;
    case 'SEGMENT_DELETED':
      return <SegmentDeletedMetadata metadata={metadata} />;
    case 'WEBHOOK_CREATED':
      return <WebhookCreatedMetadata metadata={metadata} />;
    case 'WEBHOOK_UPDATED':
      return <WebhookUpdatedMetadata metadata={metadata} />;
    case 'WEBHOOK_DELETED':
      return <WebhookDeletedMetadata metadata={metadata} />;
    case 'CHANGELOG_CREATED':
      return <ChangelogCreatedMetadata metadata={metadata} />;
    case 'CHANGELOG_UPDATED':
      return <ChangelogUpdatedMetadata metadata={metadata} />;
    case 'CHANGELOG_DELETED':
      return <ChangelogDeletedMetadata metadata={metadata} />;
    case 'INVITATION_ACCEPTED':
      return <InvitationAcceptedMetadata metadata={metadata} />;
    case 'INVITATION_REVOKED':
    case 'INVITATION_CANCELED':
      return <InvitationRevokedMetadata metadata={metadata} />;
    case 'ORGANIZATION_UPDATED':
      return <OrganizationUpdatedMetadata metadata={metadata} />;
    case 'OTA_UPDATE_DEPLOYED':
      return <OtaUpdateDeployedMetadata metadata={metadata} />;
    case 'USER_LOGIN_SUCCESS':
    case 'USER_LOGIN_FAILED':
      return <UserLoginMetadata metadata={metadata} />;
    case 'PASSWORD_CHANGED':
      return <PasswordChangedMetadata metadata={metadata} />;
    default:
      return null;
  }
}

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

  const getActionBadgeColor = (action: string) => {
    if (action.includes('CREATE') || action.includes('UPLOAD')) return 'green';
    if (action.includes('DELETE') || action.includes('REMOVE')) return 'red';
    if (action.includes('UPDATE') || action.includes('EDIT')) return 'blue';
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
            <Table highlightOnHover verticalSpacing="xs" horizontalSpacing="md">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>{t('audit_trail.table.action')}</Table.Th>
                  <Table.Th>{t('audit_trail.table.resource')}</Table.Th>
                  <Table.Th>{t('audit_trail.table.timestamp')}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {allLogs.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={3}>
                      <div className="text-center py-8 text-gray-500">
                        {t('audit_trail.no_logs')}
                      </div>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  allLogs.map((log) => (
                    <Table.Tr 
                      key={log.id} 
                      className="cursor-pointer"
                      onClick={() => setDetailModal({ opened: true, log })}
                    >
                      <Table.Td>
                        <Badge
                          color={getActionBadgeColor(log.action)}
                          variant="light"
                          size="sm"
                        >
                          {formatAction(log.action)}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <div className="flex items-center gap-2">
                          {log.resourceType && (
                            <Badge variant="outline" size="xs" color="gray">
                              {log.resourceType}
                            </Badge>
                          )}
                          <span className="text-sm">
                            {log.resourceName || log.resourceId || '-'}
                          </span>
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <span className="text-sm text-gray-500">
                          {new Date(log.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </Table.Td>
                    </Table.Tr>
                  ))
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
              <div className="col-span-2 border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                <ActionMetadataDisplay log={detailModal.log} />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
