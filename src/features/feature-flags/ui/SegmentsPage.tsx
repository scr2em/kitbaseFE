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
import { AlertCircle, Plus, MoreVertical, Trash2, Edit, Users } from 'lucide-react';
import { useParams } from 'react-router';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import {
  useFeatureFlagSegmentsInfiniteQuery,
  useDeleteFeatureFlagSegmentMutation,
} from '../../../shared/api/queries/feature-flag-segments';
import { useShowBackendError } from '../../../shared/hooks';
import type { FeatureFlagSegmentResponse } from '../../../generated-api';
import { CreateSegmentModal } from './CreateSegmentModal';
import { UpdateSegmentModal } from './UpdateSegmentModal';

export function SegmentsPage() {
  const { t } = useTranslation();
  const { projectKey, environmentId } = useParams<{ projectKey: string; environmentId: string }>();

  const [createModalOpened, setCreateModalOpened] = useState(false);
  const [updateModalData, setUpdateModalData] = useState<{
    opened: boolean;
    segment: FeatureFlagSegmentResponse | null;
  }>({ opened: false, segment: null });

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFeatureFlagSegmentsInfiniteQuery(projectKey || '', environmentId || '');

  const deleteSegmentMutation = useDeleteFeatureFlagSegmentMutation(projectKey || '', environmentId || '');
  const { showError } = useShowBackendError();

  const handleDeleteSegment = (segment: FeatureFlagSegmentResponse) => {
    modals.openConfirmModal({
      title: t('feature_flags.segments.delete.title'),
      children: (
        <p className="text-sm">
          {t('feature_flags.segments.delete.confirmation', { name: segment.name })}
        </p>
      ),
      labels: {
        confirm: t('feature_flags.segments.delete.confirm'),
        cancel: t('feature_flags.segments.delete.cancel'),
      },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteSegmentMutation.mutateAsync(segment.id);
          notifications.show({
            title: t('common.success'),
            message: t('feature_flags.segments.delete.success_message'),
            color: 'green',
          });
        } catch (error) {
          showError(error);
        }
      },
    });
  };

  const getOperatorLabel = (operator: string) => {
    const operatorMap: Record<string, string> = {
      eq: '=',
      neq: '≠',
      contains: t('feature_flags.operators.contains'),
      not_contains: t('feature_flags.operators.not_contains'),
      starts_with: t('feature_flags.operators.starts_with'),
      ends_with: t('feature_flags.operators.ends_with'),
      gt: '>',
      gte: '≥',
      lt: '<',
      lte: '≤',
      exists: t('feature_flags.operators.exists'),
      not_exists: t('feature_flags.operators.not_exists'),
      in: t('feature_flags.operators.in'),
      not_in: t('feature_flags.operators.not_in'),
    };
    return operatorMap[operator] || operator;
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
          {t('feature_flags.segments.error_loading')}
        </Alert>
      </div>
    );
  }

  const segments = data?.pages.flatMap((page) => page.data) || [];
  const totalElements = data?.pages[0]?.totalElements || 0;

  return (
    <div>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-1">
              {t('feature_flags.segments.title')}
            </h2>
            <p className="text-sm text-slate-500">
              {t('feature_flags.segments.subtitle', { count: totalElements })}
            </p>
          </div>
          <Button
            leftSection={<Plus size={16} />}
            size="sm"
            onClick={() => setCreateModalOpened(true)}
          >
            {t('feature_flags.segments.create_button')}
          </Button>
        </div>

        {/* Segments Table */}
        {segments.length === 0 ? (
          <Card withBorder p="xl" radius="md">
            <div className="flex justify-center">
              <div className="flex flex-col items-center gap-4">
                <Users size={48} strokeWidth={1.5} className="text-slate-400" />
                <p className="text-base text-slate-500">
                  {t('feature_flags.segments.no_segments')}
                </p>
                <Button
                  leftSection={<Plus size={16} />}
                  size="sm"
                  onClick={() => setCreateModalOpened(true)}
                >
                  {t('feature_flags.segments.create_first')}
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
                      <Table.Th>{t('feature_flags.segments.table.name')}</Table.Th>
                      <Table.Th>{t('feature_flags.segments.table.description')}</Table.Th>
                      <Table.Th>{t('feature_flags.segments.table.rules')}</Table.Th>
                      <Table.Th>{t('feature_flags.segments.table.created_at')}</Table.Th>
                      <Table.Th>{t('feature_flags.segments.table.actions')}</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {segments.map((segment) => (
                      <Table.Tr key={segment.id}>
                        <Table.Td>
                          <div className="flex gap-3 items-center">
                            <Users size={18} strokeWidth={2} className="text-slate-500" />
                            <p className="font-medium text-sm">{segment.name}</p>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <p className="text-sm text-slate-500 truncate max-w-[200px]">
                            {segment.description || '-'}
                          </p>
                        </Table.Td>
                        <Table.Td>
                          <div className="flex flex-wrap gap-1">
                            {segment.rules.slice(0, 2).map((rule, index) => (
                              <Badge key={index} size="xs" variant="light" color="gray">
                                {rule.field} {getOperatorLabel(rule.operator)}{' '}
                                {rule.value || ''}
                              </Badge>
                            ))}
                            {segment.rules.length > 2 && (
                              <Badge size="xs" variant="light" color="blue">
                                +{segment.rules.length - 2} {t('feature_flags.segments.more_rules')}
                              </Badge>
                            )}
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <p className="text-sm">
                            {new Date(segment.createdAt).toLocaleDateString('en-US', {
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
                                onClick={() => setUpdateModalData({ opened: true, segment })}
                              >
                                {t('feature_flags.segments.actions.edit')}
                              </Menu.Item>
                              <Menu.Item
                                color="red"
                                leftSection={<Trash2 size={16} />}
                                onClick={() => handleDeleteSegment(segment)}
                              >
                                {t('feature_flags.segments.actions.delete')}
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
                  {isFetchingNextPage
                    ? t('feature_flags.segments.loading_more')
                    : t('feature_flags.segments.load_more')}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <CreateSegmentModal
        opened={createModalOpened}
        onClose={() => setCreateModalOpened(false)}
        projectKey={projectKey || ''}
        environmentId={environmentId || ''}
      />

      {updateModalData.segment && (
        <UpdateSegmentModal
          opened={updateModalData.opened}
          onClose={() => setUpdateModalData({ opened: false, segment: null })}
          projectKey={projectKey || ''}
          environmentId={environmentId || ''}
          segment={updateModalData.segment}
        />
      )}
    </div>
  );
}
