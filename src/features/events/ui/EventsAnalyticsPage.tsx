import {
  Card,
  Loader,
  Alert,
  Table,
  ScrollArea,
  TextInput,
  Select,
  Button,
  Progress,
  Tooltip,
  Popover,
} from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { DatePicker } from '@mantine/dates';
import { useTranslation } from 'react-i18next';
import { AlertCircle, BarChart3, X, Calendar, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useParams } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import {
  useEventStatsQuery,
  getEventStatsQueryKey,
  type EventStatsFilters,
} from '../../../shared/api/queries/events';

type GroupByOption = 'event' | 'channel' | 'user_id';

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

export function EventsAnalyticsPage() {
  const { t } = useTranslation();
  const { projectKey, environmentId } = useParams<{ projectKey: string; environmentId: string }>();
  const queryClient = useQueryClient();
  const [isRefetching, setIsRefetching] = useState(false);
  const [channelValue, setChannelValue] = useState('');
  const [debouncedChannel] = useDebouncedValue(channelValue, 300);
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([
    dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD'),
  ]);
  const [datePickerOpened, { open: openDatePicker, close: closeDatePicker }] = useDisclosure(false);
  const [groupBy, setGroupBy] = useState<GroupByOption>('event');

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

  const statsFilters: EventStatsFilters = {
    environmentId: environmentId || undefined,
    channel: debouncedChannel || undefined,
    from: dateRange[0] || undefined,
    to: dateRange[1] || undefined,
  };

  const handleChannelChange = (value: string) => {
    setChannelValue(value);
  };

  const handleDateRangeChange = (value: [string | null, string | null]) => {
    setDateRange(value);
    if (value[0] && value[1]) {
      closeDatePicker();
    }
  };

  const clearDateRange = () => {
    setDateRange([null, null]);
  };

  const clearFilters = () => {
    setChannelValue('');
    setDateRange([null, null]);
  };

  const hasActiveFilters = channelValue || dateRange[0] || dateRange[1];

  const handleRefetch = async () => {
    setIsRefetching(true);
    try {
      await queryClient.invalidateQueries({
        queryKey: getEventStatsQueryKey(projectKey || '', groupBy, statsFilters),
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

  const groupByOptions = [
    { value: 'event', label: t('events.aggregated.group_by.event') },
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
              {t('events.tabs.analytics')}
            </h2>
            <p className="text-sm text-slate-500">
              {t('events.aggregated.no_data_description')}
            </p>
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
          <Select
            placeholder={t('events.aggregated.group_by_label')}
            data={groupByOptions}
            value={groupBy}
            onChange={(value) => value && setGroupBy(value as GroupByOption)}
            className="w-48"
          />
          <TextInput
            placeholder={t('events.filters.channel_placeholder')}
            value={channelValue}
            onChange={(e) => handleChannelChange(e.currentTarget.value)}
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
        <AggregatedEventsTable
          projectKey={projectKey || ''}
          groupBy={groupBy}
          filters={statsFilters}
        />
      </div>
    </div>
  );
}








