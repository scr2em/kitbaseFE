import {
  Card,
  Loader,
  Alert,
  Table,
  ScrollArea,
  Badge,
  TextInput,
  Button,
  Pagination,
  Tooltip,
  Popover,
} from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { DatePicker } from '@mantine/dates';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Activity, Search, X, Calendar, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useParams, useNavigate } from 'react-router';
import { useQueryState, parseAsString } from 'nuqs';
import { useQueryClient } from '@tanstack/react-query';
import {
  useEventsQuery,
  getEventsQueryKey,
  type EventsFilters,
} from '../../../shared/api/queries/events';
import { CodeSnippet } from '../../../shared/components/CodeSnippet';
import { getEventTrackingSnippets } from '../../../shared/lib/sdk-snippets';

const PAGE_SIZE = 20;

interface EventsTableProps {
  projectKey: string;
  environmentId: string;
  filters: EventsFilters;
  currentPage: number;
  onPageChange: (page: number) => void;
  onUserIdClick: (userId: string) => void;
}

function EventsTable({ projectKey, environmentId, filters, currentPage, onPageChange, onUserIdClick }: EventsTableProps) {
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
        <div className="flex flex-col gap-6">
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
          
          {/* SDK Quick Start */}
          <div className="border-t border-slate-200 pt-6">
            <div className="flex flex-col gap-3">
              <div className="text-center">
                <p className="text-sm font-medium text-slate-700">
                  {t('code_snippet.track_events_title')}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {t('code_snippet.track_events_description')}
                </p>
              </div>
              <CodeSnippet tabs={getEventTrackingSnippets()} />
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
                <Table.Th>{t('events.table.channel')}</Table.Th>
                <Table.Th>{t('events.table.user_id')}</Table.Th>
                <Table.Th>{t('events.table.timestamp')}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {events.map((event) => (
                <Table.Tr 
                  key={event.id}
                  onClick={() => navigate(`/projects/${projectKey}/${environmentId}/events/list/${event.id}`)}
                  className="cursor-pointer hover:bg-slate-50"
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

export function EventListPage() {
  const { t } = useTranslation();
  const { projectKey, environmentId } = useParams<{ projectKey: string; environmentId: string }>();
  const queryClient = useQueryClient();
  const [isRefetching, setIsRefetching] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchValue, 300);
  const [channelValue, setChannelValue] = useState('');
  const [debouncedChannel] = useDebouncedValue(channelValue, 300);
  const [userIdValue, setUserIdValue] = useQueryState(
    'user_id',
    parseAsString.withDefault('')
  );
  const [debouncedUserId] = useDebouncedValue(userIdValue, 300);
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([
    dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD'),
  ]);
  const [datePickerOpened, { open: openDatePicker, close: closeDatePicker }] = useDisclosure(false);
  const [currentPage, setCurrentPage] = useState(1);

  const datePresets: Array<{ value: [string, string]; label: string }> = [
    {
      value: [dayjs().startOf('day').format('YYYY-MM-DD'), dayjs().endOf('day').format('YYYY-MM-DD')],
      label: t('events.filters.date_presets.today'),
    },
    {
      value: [dayjs().subtract(1, 'day').startOf('day').format('YYYY-MM-DD'), dayjs().subtract(1, 'day').endOf('day').format('YYYY-MM-DD')],
      label: t('events.filters.date_presets.yesterday'),
    },
    {
      value: [dayjs().subtract(7, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
      label: t('events.filters.date_presets.last_7_days'),
    },
    {
      value: [dayjs().subtract(30, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
      label: t('events.filters.date_presets.last_30_days'),
    },
    {
      value: [dayjs().startOf('month').format('YYYY-MM-DD'), dayjs().endOf('month').format('YYYY-MM-DD')],
      label: t('events.filters.date_presets.this_month'),
    },
    {
      value: [dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'), dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')],
      label: t('events.filters.date_presets.last_month'),
    },
    {
      value: [dayjs().startOf('year').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
      label: t('events.filters.date_presets.this_year'),
    },
  ];

  const activeFilters: EventsFilters = {
    environmentId: environmentId || undefined,
    event: debouncedSearch || undefined,
    channel: debouncedChannel || undefined,
    user_id: debouncedUserId || undefined,
    from: dateRange[0] || undefined,
    to: dateRange[1] || undefined,
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

  const handleDateRangeChange = (value: [string | null, string | null]) => {
    setDateRange(value);
    setCurrentPage(1);
    if (value[0] && value[1]) {
      closeDatePicker();
    }
  };

  const clearDateRange = () => {
    setDateRange([null, null]);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchValue('');
    setChannelValue('');
    setUserIdValue(null);
    setDateRange([null, null]);
    setCurrentPage(1);
  };

  const hasActiveFilters = searchValue || channelValue || userIdValue || dateRange[0] || dateRange[1];

  const handleRefetch = async () => {
    setIsRefetching(true);
    try {
      await queryClient.invalidateQueries({
        queryKey: getEventsQueryKey(projectKey || '', currentPage - 1, PAGE_SIZE, activeFilters),
      });
    } finally {
      setIsRefetching(false);
    }
  };

  const formatDateRangeDisplay = () => {
    if (!dateRange[0] && !dateRange[1]) return null;
    
    const fromDate = dateRange[0] ? dayjs(dateRange[0]).format('MMM D, YYYY') : '';
    const toDate = dateRange[1] ? dayjs(dateRange[1]).format('MMM D, YYYY') : '';
    
    if (fromDate && toDate) {
      return `${fromDate} - ${toDate}`;
    }
    return fromDate || toDate;
  };

  return (
    <div>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {t('events.title')}
            </h2>
          </div>
          <Tooltip label={t('events.refetch')} position="bottom">
            <Button
              variant="default"
              size="sm"
              onClick={handleRefetch}
              loading={isRefetching}
            >
              <RefreshCw size={16} />
            </Button>
          </Tooltip>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <TextInput
            placeholder={t('events.search_placeholder')}
            leftSection={<Search size={16} />}
            value={searchValue}
            onChange={(e) => handleSearchChange(e.currentTarget.value)}
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
          <Popover
            opened={datePickerOpened}
            onChange={(opened) => opened ? openDatePicker() : closeDatePicker()}
            position="bottom-start"
            shadow="md"
          >
            <Popover.Target>
              <Button
                variant={dateRange[0] || dateRange[1] ? 'light' : 'default'}
                leftSection={<Calendar size={16} />}
                rightSection={dateRange[0] || dateRange[1] ? (
                  <X 
                    size={14} 
                    className="cursor-pointer hover:text-red-500" 
                    onClick={(e) => {
                      e.stopPropagation();
                      clearDateRange();
                    }}
                  />
                ) : null}
                onClick={openDatePicker}
              >
                {formatDateRangeDisplay() || t('events.filters.date_range_placeholder')}
              </Button>
            </Popover.Target>
            <Popover.Dropdown p={0}>
              <DatePicker
                type="range"
                value={dateRange}
                onChange={handleDateRangeChange}
                presets={datePresets}
                numberOfColumns={2}
              />
            </Popover.Dropdown>
          </Popover>
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
        <EventsTable 
          projectKey={projectKey || ''} 
          environmentId={environmentId || ''}
          filters={activeFilters} 
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onUserIdClick={handleUserIdClick}
        />
      </div>
    </div>
  );
}
