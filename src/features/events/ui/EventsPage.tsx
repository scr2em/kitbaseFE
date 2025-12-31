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
  Pagination,
  SegmentedControl,
  Progress,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Activity, Search, X, List, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQueryState, parseAsStringLiteral, parseAsString } from 'nuqs';
import {
  useEventsQuery,
  useEventStatsQuery,
  type EventsFilters,
  type EventStatsFilters,
} from '../../../shared/api/queries/events';

const PAGE_SIZE = 20;

const VIEW_MODES = ['list', 'aggregated'] as const;
type ViewMode = (typeof VIEW_MODES)[number];
type GroupByOption = 'event' | 'environment' | 'channel' | 'user_id';

interface EventsTableProps {
  projectKey: string;
  filters: EventsFilters;
  currentPage: number;
  onPageChange: (page: number) => void;
  onUserIdClick: (userId: string) => void;
}

function EventsTable({ projectKey, filters, currentPage, onPageChange, onUserIdClick }: EventsTableProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
  } = useEventsQuery(projectKey, currentPage - 1, PAGE_SIZE, filters);

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
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
        {t('events.error_loading')}
      </Alert>
    );
  }

  const events = data?.data || [];
  const totalPages = data?.totalPages || 0;

  if (events.length === 0) {
    return (
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
    );
  }

  return (
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
                <Table.Tr 
                  key={event.id}
                  onClick={() => navigate(`/projects/${projectKey}/events/${event.id}`)}
                  className="cursor-pointer"
                >
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
                    {event.userId ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUserIdClick(event.userId!);
                        }}
                        className="text-sm font-mono text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                      >
                        {event.userId}
                      </button>
                    ) : (
                      <span className="text-sm text-slate-400">
                        {t('events.no_user_id')}
                      </span>
                    )}
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

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            total={totalPages}
            value={currentPage}
            onChange={onPageChange}
            withEdges
          />
        </div>
      )}
    </>
  );
}

interface AggregatedEventsTableProps {
  projectKey: string;
  groupBy: GroupByOption;
  filters: EventStatsFilters;
}

function AggregatedEventsTable({ projectKey, groupBy, filters }: AggregatedEventsTableProps) {
  const { t } = useTranslation();

  const {
    data,
    isLoading,
    isError,
  } = useEventStatsQuery(projectKey, groupBy, filters);

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
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
        {t('events.error_loading')}
      </Alert>
    );
  }

  const groups = data?.groups || [];
  const totalEvents = data?.totalEvents || 0;
  const uniqueUsers = data?.uniqueUsers || 0;

  if (groups.length === 0) {
    return (
      <Card withBorder p="xl" radius="md">
        <div className="flex justify-center">
          <div className="flex flex-col items-center gap-4">
            <BarChart3 size={48} strokeWidth={1.5} className="text-slate-400" />
            <div className="text-center">
              <p className="text-base text-slate-500">
                {t('events.aggregated.no_data')}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                {t('events.aggregated.no_data_description')}
              </p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card withBorder p="md" radius="md">
          <p className="text-sm text-slate-500">{t('events.aggregated.total_events')}</p>
          <p className="text-2xl font-semibold text-slate-900">{totalEvents.toLocaleString()}</p>
        </Card>
        <Card withBorder p="md" radius="md">
          <p className="text-sm text-slate-500">{t('events.aggregated.unique_users')}</p>
          <p className="text-2xl font-semibold text-slate-900">{uniqueUsers.toLocaleString()}</p>
        </Card>
      </div>

      {/* Aggregated Table */}
      <Card withBorder padding={0} radius="md">
        <ScrollArea>
          <Table highlightOnHover verticalSpacing="sm" horizontalSpacing="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t(`events.aggregated.group_by.${groupBy}`)}</Table.Th>
                <Table.Th className="w-32 text-right">{t('events.aggregated.count')}</Table.Th>
                <Table.Th className="w-48">{t('events.aggregated.percentage')}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {groups.map((group) => (
                <Table.Tr key={group.key}>
                  <Table.Td>
                    <p className="font-medium text-sm">
                      {group.key || t('events.aggregated.unknown')}
                    </p>
                  </Table.Td>
                  <Table.Td className="text-right">
                    <p className="text-sm font-mono text-slate-600">
                      {group.count.toLocaleString()}
                    </p>
                  </Table.Td>
                  <Table.Td>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={group.percentage} 
                        size="sm" 
                        className="flex-1"
                        color="blue"
                      />
                      <span className="text-xs text-slate-500 w-12 text-right">
                        {group.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Card>
    </div>
  );
}

export function EventsPage() {
  const { t } = useTranslation();
  const { projectKey } = useParams<{ projectKey: string }>();
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchValue, 300);
  const [channelValue, setChannelValue] = useState('');
  const [debouncedChannel] = useDebouncedValue(channelValue, 300);
  const [environmentValue, setEnvironmentValue] = useState('');
  const [debouncedEnvironment] = useDebouncedValue(environmentValue, 300);
  const [userIdValue, setUserIdValue] = useQueryState(
    'user_id',
    parseAsString.withDefault('')
  );
  const [debouncedUserId] = useDebouncedValue(userIdValue, 300);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useQueryState(
    'view',
    parseAsStringLiteral(VIEW_MODES).withDefault('list')
  );
  const [groupBy, setGroupBy] = useState<GroupByOption>('event');

  const activeFilters: EventsFilters = {
    event: debouncedSearch || undefined,
    channel: debouncedChannel || undefined,
    environment: debouncedEnvironment || undefined,
    user_id: debouncedUserId || undefined,
  };

  const statsFilters: EventStatsFilters = {
    environment: debouncedEnvironment || undefined,
    channel: debouncedChannel || undefined,
  };

  const handleEnvironmentChange = (value: string) => {
    setEnvironmentValue(value);
    setCurrentPage(1);
  };

  const handleChannelChange = (value: string) => {
    setChannelValue(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleUserIdChange = (value: string) => {
    setUserIdValue(value || null);
    setCurrentPage(1);
  };

  const handleUserIdClick = (userId: string) => {
    setUserIdValue(userId);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchValue('');
    setChannelValue('');
    setEnvironmentValue('');
    setUserIdValue(null);
    setCurrentPage(1);
  };

  const hasActiveFilters = searchValue || environmentValue || channelValue || userIdValue;

  const groupByOptions = [
    { value: 'event', label: t('events.aggregated.group_by.event') },
    { value: 'environment', label: t('events.aggregated.group_by.environment') },
    { value: 'channel', label: t('events.aggregated.group_by.channel') },
    { value: 'user_id', label: t('events.aggregated.group_by.user_id') },
  ];

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
              {t('events.subtitle_simple')}
            </p>
          </div>
          <SegmentedControl
            value={viewMode}
            onChange={(value) => setViewMode(value as ViewMode)}
            data={[
              { 
                value: 'list', 
                label: (
                  <div className="flex items-center gap-1.5">
                    <List size={14} />
                    <span>{t('events.view.list')}</span>
                  </div>
                ),
              },
              { 
                value: 'aggregated', 
                label: (
                  <div className="flex items-center gap-1.5">
                    <BarChart3 size={14} />
                    <span>{t('events.view.aggregated')}</span>
                  </div>
                ),
              },
            ]}
            size="sm"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          {viewMode === 'aggregated' && (
            <Select
              placeholder={t('events.aggregated.group_by_label')}
              data={groupByOptions}
              value={groupBy}
              onChange={(value) => value && setGroupBy(value as GroupByOption)}
              className="w-48"
            />
          )}
          {viewMode === 'list' && (
            <TextInput
              placeholder={t('events.search_placeholder')}
              leftSection={<Search size={16} />}
              value={searchValue}
              onChange={(e) => handleSearchChange(e.currentTarget.value)}
              className="w-48"
            />
          )}
          <TextInput
            placeholder={t('events.filters.environment_placeholder')}
            value={environmentValue}
            onChange={(e) => handleEnvironmentChange(e.currentTarget.value)}
            className="w-48"
          />
          <TextInput
            placeholder={t('events.filters.channel_placeholder')}
            value={channelValue}
            onChange={(e) => handleChannelChange(e.currentTarget.value)}
            className="w-48"
          />
          <TextInput
            placeholder={t('events.filters.user_id_placeholder')}
            value={userIdValue}
            onChange={(e) => handleUserIdChange(e.currentTarget.value)}
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

        {/* Content */}
        {viewMode === 'list' ? (
          <EventsTable 
            projectKey={projectKey || ''} 
            filters={activeFilters} 
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onUserIdClick={handleUserIdClick}
          />
        ) : (
          <AggregatedEventsTable
            projectKey={projectKey || ''}
            groupBy={groupBy}
            filters={statsFilters}
          />
        )}
      </div>
    </div>
  );
}
