import { NavLink, Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';
import { User } from 'lucide-react';

export function SettingsLayout() {
  const { t } = useTranslation();

  const navItems = [
    {
      to: '/settings/me',
      label: t('settings.nav.profile'),
      icon: User,
    },
  ];

  return (
    <div className="flex gap-8">
      {/* Sidebar */}
      <nav className="w-56 shrink-0">
        <div className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}







