import { Card, Loader, Alert, SegmentedControl } from '@mantine/core';
import { DatePickerInput, type DatesRangeValue } from '@mantine/dates';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useState } from 'react';
import dayjs from 'dayjs';
import {
  AlertCircle,
  Activity,
  Users,
  HardDrive,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { useProjectAnalyticsQuery } from '../../../shared/api/queries/projects';

type DatePreset = '7d' | '30d' | '90d' | 'custom';
type DateRange = DatesRangeValue;

const PRESET_DAYS: Record<Exclude<DatePreset, 'custom'>, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

function getDateRangeForPreset(preset: Exclude<DatePreset, 'custom'>): { fromStr: string; toStr: string } {
  const days = PRESET_DAYS[preset];
  return {
    fromStr: dayjs().subtract(days, 'day').startOf('day').toISOString(),
    toStr: dayjs().endOf('day').toISOString(),
  };
}

// Get initial date range for default preset
const initialDateRange = getDateRangeForPreset('30d');

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function StatCard({ icon, label, value, description, trend }: StatCardProps) {
  return (
    <Card withBorder padding="lg" radius="md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            {icon}
          </div>
          <div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-2xl font-semibold text-slate-900 mt-0.5">{value}</p>
            {description && (
              <p className="text-xs text-slate-400 mt-1">{description}</p>
            )}
          </div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trend.isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
            <TrendingUp size={14} className={trend.isPositive ? '' : 'rotate-180'} />
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
    </Card>
  );
}

export function ProjectAnalyticsPage() {
  const { t } = useTranslation();
  const { projectKey } = useParams<{ projectKey: string }>();

  const [datePreset, setDatePreset] = useState<DatePreset>('30d');
  const [customDateRange, setCustomDateRange] = useState<DateRange>([null, null]);
  // Store the computed date range strings in state to keep them stable
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
        fromStr: dayjs(value[0]).startOf('day').toISOString(),
        toStr: dayjs(value[1]).endOf('day').toISOString(),
      });
    }
  };

  const { fromStr, toStr } = dateRangeStrings;
  const from = dayjs(fromStr);
  const to = dayjs(toStr);

  const { data, isLoading, isError } = useProjectAnalyticsQuery(
    projectKey || '',
    fromStr,
    toStr
  );

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
        {t('project.analytics.error_loading')}
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            {t('project.analytics.title')}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {t('project.analytics.subtitle')}
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-3">
          <SegmentedControl
            value={datePreset}
            onChange={handlePresetChange}
            data={[
              { label: t('project.analytics.date_presets.7d'), value: '7d' },
              { label: t('project.analytics.date_presets.30d'), value: '30d' },
              { label: t('project.analytics.date_presets.90d'), value: '90d' },
              { label: t('project.analytics.date_presets.custom'), value: 'custom' },
            ]}
            size="xs"
          />
        </div>
      </div>

      {/* Custom Date Range Picker */}
      {datePreset === 'custom' && (
        <Card withBorder padding="md" radius="md">
          <div className="flex items-center gap-4">
            <Calendar size={18} className="text-slate-400" />
            <DatePickerInput
              type="range"
              placeholder={t('project.analytics.select_date_range')}
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
          icon={<Activity size={20} />}
          label={t('project.analytics.stats.total_events')}
          value={formatNumber(data?.events?.totalEvents ?? 0)}
          description={t('project.analytics.stats.events_in_period')}
        />
        <StatCard
          icon={<Users size={20} />}
          label={t('project.analytics.stats.unique_users')}
          value={formatNumber(data?.events?.uniqueUsers ?? 0)}
          description={t('project.analytics.stats.users_in_period')}
        />
        <StatCard
          icon={<HardDrive size={20} />}
          label={t('project.analytics.stats.build_storage')}
          value={formatBytes(data?.totalBuildSizeBytes ?? 0)}
          description={t('project.analytics.stats.total_storage')}
        />
      </div>

      {/* Summary Card */}
      <Card withBorder padding="lg" radius="md">
        <h3 className="text-base font-semibold text-slate-900 mb-4">
          {t('project.analytics.summary.title')}
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-sm text-slate-600">{t('project.analytics.summary.project_key')}</span>
            <span className="text-sm font-medium text-slate-900 font-mono">{data?.projectKey}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-sm text-slate-600">{t('project.analytics.summary.date_range')}</span>
            <span className="text-sm font-medium text-slate-900">
              {from.format('MMM D, YYYY')} - {to.format('MMM D, YYYY')}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-sm text-slate-600">{t('project.analytics.summary.avg_events_per_day')}</span>
            <span className="text-sm font-medium text-slate-900">
              {(() => {
                const days = Math.max(1, to.diff(from, 'day') + 1);
                return formatNumber(Math.round((data?.events?.totalEvents ?? 0) / days));
              })()}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-slate-600">{t('project.analytics.summary.events_per_user')}</span>
            <span className="text-sm font-medium text-slate-900">
              {data?.events?.uniqueUsers
                ? ((data.events.totalEvents ?? 0) / data.events.uniqueUsers).toFixed(1)
                : '0'}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

