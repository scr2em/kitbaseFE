import {
  Loader,
  Alert,
  Badge,
  Button,
  NavLink,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, useLocation, Outlet } from 'react-router';
import { AlertCircle, Package, ArrowLeft, Hammer, Key } from 'lucide-react';
import { useMobileAppQuery } from '../../../shared/api/queries';

export function AppDetailPage() {
  const { t } = useTranslation();
  const { bundleId } = useParams<{ bundleId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: app, isLoading, isError } = useMobileAppQuery(bundleId || '');

  const navigationItems = [
    {
      label: t('apps.detail.nav.bundles'),
      path: `/apps/${bundleId}/bundles`,
      icon: <Package size={18} />,
    },
    {
      label: t('apps.detail.nav.builds'),
      path: `/apps/${bundleId}/builds`,
      icon: <Hammer size={18} />,
    },
    // {
    //   label: t('apps.detail.nav.access'),
    //   path: `/apps/${bundleId}/access`,
    //   icon: <Lock size={18} />,
    // },
    {
      label: t('apps.detail.nav.api_keys'),
      path: `/apps/${bundleId}/api-keys`,
      icon: <Key size={18} />,
    },
  ];

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (isError || !app) {
    return (
      <div>
        <Alert
          icon={<AlertCircle size={16} />}
          title={t('common.error')}
          color="red"
        >
          {t('apps.detail.error_loading')}
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        {/* Header with Back Button */}
        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <Package size={24} strokeWidth={2} />
            <div>
              <div className="flex gap-3 items-center">
                <h2 className="text-2xl font-semibold">{app.name}</h2>
                <Badge variant="light" color="blue" size="sm">
                  {app.bundleId}
                </Badge>
              </div>
            </div>
          </div>
          <Button
            variant="subtle"
            size="sm"
            leftSection={<ArrowLeft size={16} />}
            onClick={() => navigate('/apps')}
          >
            {t('apps.detail.back_to_apps')}
          </Button>
        </div>

        {/* Main Content with Side Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-3 lg:col-span-2">
            <div className="flex flex-col gap-2">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.path}
                  label={item.label}
                  leftSection={item.icon}
                  active={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                  styles={{
                    root: {
                      borderRadius: 'var(--mantine-radius-md)',
                    },
                  }}
                />
              ))}
            </div>
          </div>
          
          <div className="md:col-span-9 lg:col-span-10">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
