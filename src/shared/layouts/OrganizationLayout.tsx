import { NavLink } from '@mantine/core';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Building, Users, Webhook } from 'lucide-react';
import { usePermissions } from '../hooks';

export function OrganizationLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const permissions = usePermissions();

  const organizationNavItems = [
    {
      icon: Building,
      label: t('navigation.organization_menu.info'),
      path: '/organization/info',
      permission: null,
    },
    {
      icon: Users,
      label: t('navigation.organization_menu.team'),
      path: '/organization/team',
      permission: permissions.canViewMember,
    },
    {
      icon: Webhook,
      label: t('navigation.organization_menu.webhooks'),
      path: '/organization/webhooks',
      permission: permissions.canViewWebhook,
    },
  ];

  const visibleNavItems = organizationNavItems.filter(
    (item) => item.permission === null || item.permission
  );

  return (
    <div className="flex gap-6 h-full">
      {/* Secondary Sidebar */}
      <div className="w-56 flex-shrink-0">
        <div className="sticky top-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-3 mb-3">
            {t('navigation.organization')}
          </p>
          <div className="flex flex-col gap-1">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                location.pathname.startsWith(item.path + '/');

              return (
                <NavLink
                  key={item.path}
                  label={item.label}
                  leftSection={<Icon size={18} />}
                  active={isActive}
                  onClick={() => navigate(item.path)}
                  style={{ borderRadius: 'var(--mantine-radius-md)' }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}








