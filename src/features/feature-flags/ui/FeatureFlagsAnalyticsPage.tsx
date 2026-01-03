import { Card } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { BarChart3 } from 'lucide-react';

export function FeatureFlagsAnalyticsPage() {
  const { t } = useTranslation();

  return (
    <Card withBorder p="xl" radius="md">
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
          <BarChart3 size={32} className="text-slate-400" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium text-slate-900 mb-1">
            {t('feature_flags.tabs.analytics')}
          </h3>
          <p className="text-sm text-slate-500">
            {t('common.coming_soon')}
          </p>
        </div>
      </div>
    </Card>
  );
}
