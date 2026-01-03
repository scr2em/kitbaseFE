import { Outlet, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Activity, BarChart3 } from 'lucide-react';
import { FeatureTabNavigation, type TabItem } from '../../../shared/components/FeatureTabNavigation';

export function EventsLayout() {
  const { t } = useTranslation();
  const { projectKey, environmentId } = useParams<{ projectKey: string; environmentId: string }>();

  const basePath = `/projects/${projectKey}/${environmentId}/events`;

  const tabs: TabItem[] = [
    {
      id: 'list',
      label: t('events.tabs.events'),
      path: 'list',
      icon: <Activity size={16} />,
    },
    {
      id: 'aggregated',
      label: t('events.tabs.aggregated'),
      path: 'analytics',
      icon: <BarChart3 size={16} />,
    },
  ];

  return (
    <div>
      <FeatureTabNavigation tabs={tabs} basePath={basePath} />
      <Outlet />
    </div>
  );
}
