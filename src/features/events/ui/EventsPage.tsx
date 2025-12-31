import {
  Card,
  Loader,
  Alert,
  Table,
  ScrollArea,
  Badge,
  TextInput,
  Select,
  Button,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Activity, Search, X } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router';
import {
  useEventsInfiniteQuery,
  type EventsFilters,
} from '../../../shared/api/queries/events';
import { useEnvironmentsInfiniteQuery } from '../../../shared/api/queries/environments';

export function EventsPage() {
  const { t } = useTranslation();
  const { projectKey } = useParams<{ projectKey: string }>();
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState<EventsFilters>({});

  const {
    data: environmentsData,
  } = useEnvironmentsInfiniteQuery(projectKey || '');

  const environments = environmentsData?.pages.flatMap((page) => page.data) || [];

  const activeFilters: EventsFilters = {
    ...filters,
    event: searchValue || undefined,
  };

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useEventsInfiniteQuery(projectKey || '', activeFilters);

  const handleEnvironmentChange = (value: string | null) => {
    setFilters((prev) => ({
      ...prev,
      environment: value || undefined,
    }));
  };

  const handleChannelChange = (value: string | null) => {
    setFilters((prev) => ({
      ...prev,
      channel: value || undefined,
    }));
  };

  const clearFilters = () => {
    setSearchValue('');
    setFilters({});
  };

  const hasActiveFilters = searchValue || filters.environment || filters.channel;

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
          {t('events.error_loading')}
        </Alert>
      </div>
    );
  }

  const events = data?.pages.flatMap((page) => page.data) || [];
  const totalElements = data?.pages[0]?.totalElements || 0;

  // Extract unique channels from events for the filter dropdown
  const uniqueChannels = [...new Set(events.map((e) => e.channel).filter(Boolean))] as string[];

  return (
    <div>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-1">
              {t('events.title')}
            </h2>
            <p className="text-sm text-slate-500">
              {t('events.subtitle', { count: totalElements })}
            </p>
          </div>
          <div className="w-full sm:w-64">
            <TextInput
              placeholder={t('events.search_placeholder')}
              leftSection={<Search size={16} />}
              value={searchValue}
              onChange={(e) => setSearchValue(e.currentTarget.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <Select
            placeholder={t('events.filters.all_environments')}
            data={environments.map((env) => ({
              value: env.name,
              label: env.name,
            }))}
            value={filters.environment || null}
            onChange={handleEnvironmentChange}
            clearable
            className="w-48"
          />
          <Select
            placeholder={t('events.filters.all_channels')}
            data={uniqueChannels.map((channel) => ({
              value: channel,
              label: channel,
            }))}
            value={filters.channel || null}
            onChange={handleChannelChange}
            clearable
            className="w-48"
          />
          {hasActiveFilters && (
            <Button
              variant="subtle"
              size="sm"
              leftSection={<X size={14} />}
              onClick={clearFilters}
            >
              {t('events.filters.clear_filters')}
            </Button>
          )}
        </div>

        {/* Events Table */}
        {events.length === 0 ? (
          <Card withBorder p="xl" radius="md">
            <div className="flex justify-center">
              <div className="flex flex-col items-center gap-4">
                <Activity size={48} strokeWidth={1.5} className="text-slate-400" />
                <div className="text-center">
                  <p className="text-base text-slate-500">
                    {t('events.no_events')}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    {t('events.no_events_description')}
                  </p>
                </div>
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
                      <Table.Th>{t('events.table.event')}</Table.Th>
                      <Table.Th>{t('events.table.environment')}</Table.Th>
                      <Table.Th>{t('events.table.channel')}</Table.Th>
                      <Table.Th>{t('events.table.user_id')}</Table.Th>
                      <Table.Th>{t('events.table.timestamp')}</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {events.map((event) => (
                      <Table.Tr key={event.id}>
                        <Table.Td>
                          <div className="flex gap-2 items-center">
                            {event.icon && (
                              <span className="text-lg">{event.icon}</span>
                            )}
                            <div>
                              <p className="font-medium text-sm">
                                {event.event}
                              </p>
                              {event.description && (
                                <p className="text-xs text-slate-500 truncate max-w-xs">
                                  {event.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <Badge variant="light" color="blue" size="sm">
                            {event.environment}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          {event.channel ? (
                            <Badge variant="outline" color="gray" size="sm">
                              {event.channel}
                            </Badge>
                          ) : (
                            <span className="text-sm text-slate-400">
                              {t('events.no_channel')}
                            </span>
                          )}
                        </Table.Td>
                        <Table.Td>
                          <p className="text-sm font-mono text-slate-600">
                            {event.userId || t('events.no_user_id')}
                          </p>
                        </Table.Td>
                        <Table.Td>
                          <p className="text-sm text-slate-600">
                            {new Date(event.timestamp).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
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
                  {isFetchingNextPage ? t('events.loading_more') : t('events.load_more')}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

