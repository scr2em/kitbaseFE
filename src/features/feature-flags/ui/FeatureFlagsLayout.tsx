import { Outlet, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Flag, Users, BarChart3 } from 'lucide-react';
import { FeatureTabNavigation, type TabItem } from '../../../shared/components/FeatureTabNavigation';

export function FeatureFlagsLayout() {
  const { t } = useTranslation();
  const { projectKey, environmentId } = useParams<{ projectKey: string; environmentId: string }>();

  const basePath = `/projects/${projectKey}/${environmentId}/feature-flags`;

  const tabs: TabItem[] = [
    {
      id: 'flags',
      label: t('feature_flags.tabs.flags'),
      path: 'flags',
      icon: <Flag size={16} />,
    },
    {
      id: 'segments',
      label: t('feature_flags.tabs.segments'),
      path: 'segments',
      icon: <Users size={16} />,
    },
    {
      id: 'analytics',
      label: t('feature_flags.tabs.analytics'),
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
