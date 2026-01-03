import { Card, Loader, Alert, SegmentedControl, ActionIcon, Tooltip } from '@mantine/core';
import { DatePickerInput, type DatesRangeValue } from '@mantine/dates';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import dayjs from 'dayjs';
import {
  AlertCircle,
  Zap,
  Users,
  Layers,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { useFeatureFlagUsageQuery } from '../../../shared/api/queries/feature-flags';
import { useParams } from 'react-router';

type DatePreset = '7d' | '30d' | '90d' | 'custom';
type DateRange = DatesRangeValue;

const PRESET_DAYS: Record<Exclude<DatePreset, 'custom'>, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
};

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

function getDateRangeForPreset(preset: Exclude<DatePreset, 'custom'>): { fromStr: string; toStr: string } {
  const days = PRESET_DAYS[preset];
  return {
    fromStr: dayjs().subtract(days, 'day').format('YYYY-MM-DD'),
    toStr: dayjs().format('YYYY-MM-DD'),
  };
}

const initialDateRange = getDateRangeForPreset('30d');

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  description?: string;
  colorClass?: string;
}

function StatCard({ icon, label, value, description, colorClass = 'bg-blue-50 text-blue-600' }: StatCardProps) {
  return (
    <Card withBorder padding="lg" radius="md">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClass}`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">{value}</p>
          {description && (
            <p className="text-xs text-slate-400 mt-1">{description}</p>
          )}
        </div>
      </div>
    </Card>
  );
}

export function FeatureFlagsAnalyticsPage() {
  const { t } = useTranslation();
  const { projectKey } = useParams<{ projectKey: string }>();
  
  const [datePreset, setDatePreset] = useState<DatePreset>('30d');
  const [customDateRange, setCustomDateRange] = useState<DateRange>([null, null]);
  const [dateRangeStrings, setDateRangeStrings] = useState(initialDateRange);

  const handlePresetChange = (value: string) => {
    const preset = value as DatePreset;
    setDatePreset(preset);
    if (preset !== 'custom') {
      setDateRangeStrings(getDateRangeForPreset(preset));
    }
  };

  const handleCustomDateChange = (value: DateRange) => {
    setCustomDateRange(value);
    if (value[0] && value[1]) {
      setDateRangeStrings({
        fromStr: dayjs(value[0]).format('YYYY-MM-DD'),
        toStr: dayjs(value[1]).format('YYYY-MM-DD'),
      });
    }
  };

  const { fromStr, toStr } = dateRangeStrings;

  const { data, isLoading, isError, refetch, isFetching } = useFeatureFlagUsageQuery({projectKey: projectKey || '', fromDate: fromStr, toDate: toStr});

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert icon={<AlertCircle size={16} />} title={t('common.error')} color="red">
        {t('feature_flags.analytics.error_loading')}
      </Alert>
    );
  }

  const fromDisplay = dayjs(fromStr);
  const toDisplay = dayjs(toStr);
  const periodDays = Math.max(1, toDisplay.diff(fromDisplay, 'day') + 1);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            {t('feature_flags.analytics.title')}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {t('feature_flags.analytics.subtitle')}
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-3">
          <SegmentedControl
            value={datePreset}
            onChange={handlePresetChange}
            data={[
              { label: t('feature_flags.analytics.date_presets.7d'), value: '7d' },
              { label: t('feature_flags.analytics.date_presets.30d'), value: '30d' },
              { label: t('feature_flags.analytics.date_presets.90d'), value: '90d' },
              { label: t('feature_flags.analytics.date_presets.custom'), value: 'custom' },
            ]}
            size="xs"
          />
          <Tooltip label={t('common.refresh')}>
            <ActionIcon
              variant="light"
              onClick={() => refetch()}
              loading={isFetching}
              aria-label={t('common.refresh')}
            >
              <RefreshCw size={16} />
            </ActionIcon>
          </Tooltip>
        </div>
      </div>

      {/* Custom Date Range Picker */}
      {datePreset === 'custom' && (
        <Card withBorder padding="md" radius="md">
          <div className="flex items-center gap-4">
            <Calendar size={18} className="text-slate-400" />
            <DatePickerInput
              type="range"
              placeholder={t('feature_flags.analytics.select_date_range')}
              value={customDateRange}
              onChange={handleCustomDateChange}
              maxDate={new Date()}
              size="sm"
              className="flex-1"
            />
          </div>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<Zap size={22} />}
          label={t('feature_flags.analytics.stats.evaluations')}
          value={formatNumber(data?.evaluationCount ?? 0)}
          description={t('feature_flags.analytics.stats.evaluations_desc')}
          colorClass="bg-amber-50 text-amber-600"
        />
        <StatCard
          icon={<Layers size={22} />}
          label={t('feature_flags.analytics.stats.snapshots')}
          value={formatNumber(data?.snapshotCount ?? 0)}
          description={t('feature_flags.analytics.stats.snapshots_desc')}
          colorClass="bg-violet-50 text-violet-600"
        />
        <StatCard
          icon={<Users size={22} />}
          label={t('feature_flags.analytics.stats.mau')}
          value={formatNumber(data?.mauCount ?? 0)}
          description={t('feature_flags.analytics.stats.mau_desc')}
          colorClass="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Summary Card */}
      <Card withBorder padding="lg" radius="md">
        <h3 className="text-base font-semibold text-slate-900 mb-4">
          {t('feature_flags.analytics.summary.title')}
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-sm text-slate-600">{t('feature_flags.analytics.summary.date_range')}</span>
            <span className="text-sm font-medium text-slate-900">
              {fromDisplay.format('MMM D, YYYY')} - {toDisplay.format('MMM D, YYYY')}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-sm text-slate-600">{t('feature_flags.analytics.summary.total_requests')}</span>
            <span className="text-sm font-medium text-slate-900">
              {formatNumber((data?.evaluationCount ?? 0) + (data?.snapshotCount ?? 0))}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-sm text-slate-600">{t('feature_flags.analytics.summary.avg_daily_evaluations')}</span>
            <span className="text-sm font-medium text-slate-900">
              {formatNumber(Math.round((data?.evaluationCount ?? 0) / periodDays))}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-slate-600">{t('feature_flags.analytics.summary.evaluations_per_user')}</span>
            <span className="text-sm font-medium text-slate-900">
              {data?.mauCount
                ? ((data.evaluationCount ?? 0) / data.mauCount).toFixed(1)
                : '0'}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
