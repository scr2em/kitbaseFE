import { NavLink, ScrollArea } from '@mantine/core';
import { Outlet, useNavigate, useLocation, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Package,
  Hammer,
  FileText,
  Activity,
  Layers,
  Key,
  ArrowLeft,
  List,
  BarChart3,
  Settings,
  Plus,
} from 'lucide-react';
import { useProjectQuery } from '../api/queries';

interface SecondaryNavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export function ProjectLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { projectKey } = useParams<{ projectKey: string }>();
  const { data: project } = useProjectQuery(projectKey || '');

  // Primary navigation items (project features)
  const primaryNavItems = [
    {
      id: 'bundles',
      icon: Package,
      label: t('projects.detail.nav.bundles'),
      path: `/projects/${projectKey}/bundles`,
    },
    {
      id: 'builds',
      icon: Hammer,
      label: t('projects.detail.nav.builds'),
      path: `/projects/${projectKey}/builds`,
    },
    {
      id: 'changelog',
      icon: FileText,
      label: t('projects.detail.nav.changelog'),
      path: `/projects/${projectKey}/changelog`,
      hasSecondary: true,
    },
    {
      id: 'events',
      icon: Activity,
      label: t('projects.detail.nav.events'),
      path: `/projects/${projectKey}/events`,
      hasSecondary: true,
    },
    {
      id: 'environments',
      icon: Layers,
      label: t('projects.detail.nav.environments'),
      path: `/projects/${projectKey}/environments`,
    },
    {
      id: 'api-keys',
      icon: Key,
      label: t('projects.detail.nav.api_keys'),
      path: `/projects/${projectKey}/api-keys`,
    },
  ];

  // Secondary navigation for Events
  const eventsSecondaryNav: SecondaryNavItem[] = [
    {
      label: t('projects.detail.nav.events_sub.all'),
      path: `/projects/${projectKey}/events`,
      icon: <List size={16} />,
    },
    {
      label: t('projects.detail.nav.events_sub.analytics'),
      path: `/projects/${projectKey}/events/analytics`,
      icon: <BarChart3 size={16} />,
    },
    {
      label: t('projects.detail.nav.events_sub.settings'),
      path: `/projects/${projectKey}/events/settings`,
      icon: <Settings size={16} />,
    },
  ];

  // Secondary navigation for Changelog
  const changelogSecondaryNav: SecondaryNavItem[] = [
    {
      label: t('projects.detail.nav.changelog_sub.all'),
      path: `/projects/${projectKey}/changelog`,
      icon: <List size={16} />,
    },
    {
      label: t('projects.detail.nav.changelog_sub.create'),
      path: `/projects/${projectKey}/changelog/create`,
      icon: <Plus size={16} />,
    },
  ];

  // Determine which feature is active
  const currentPath = location.pathname;
  const isInEvents = currentPath.includes(`/projects/${projectKey}/events`);
  const isInChangelog = currentPath.includes(`/projects/${projectKey}/changelog`);

  // Get secondary nav items based on active feature
  const getSecondaryNav = (): SecondaryNavItem[] | null => {
    if (isInEvents) return eventsSecondaryNav;
    if (isInChangelog) return changelogSecondaryNav;
    return null;
  };

  const secondaryNav = getSecondaryNav();

  // Check if a nav item is active
  const isNavItemActive = (item: typeof primaryNavItems[0]) => {
    if (item.hasSecondary) {
      return currentPath.startsWith(item.path);
    }
    return currentPath === item.path;
  };

  const isSecondaryNavActive = (path: string) => {
    // For the main "All" items, match exact path or detail pages (like event/:id)
    if (path === `/projects/${projectKey}/events`) {
      // Active for /events and /events/:eventId but not /events/analytics or /events/settings
      return currentPath === path || (currentPath.startsWith(path + '/') && !currentPath.includes('/analytics') && !currentPath.includes('/settings'));
    }
    if (path === `/projects/${projectKey}/changelog`) {
      // Active for /changelog and /changelog/:id/edit but not /changelog/create
      return currentPath === path || (currentPath.includes('/edit'));
    }
    return currentPath.startsWith(path);
  };

  return (
    <div className="flex h-[calc(100vh-60px)]">
      {/* Primary Sidebar - Project Features */}
      <aside className="w-56 shrink-0 bg-slate-50 border-r border-slate-200 flex flex-col">
        <ScrollArea className="flex-1">
          <div className="p-3">
            {/* Back to Projects */}
            <button
              onClick={() => navigate('/projects')}
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors w-full mb-2"
            >
              <ArrowLeft size={16} />
              <span>{t('projects.detail.back_to_projects')}</span>
            </button>

            {/* Project Header */}
            <div className="px-3 py-3 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shrink-0">
                  <Package size={18} className="text-white" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 truncate">
                    {project?.name || projectKey}
                  </p>
                  <p className="text-xs text-slate-500 font-mono truncate">
                    {projectKey}
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Navigation */}
            <div className="space-y-1">
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = isNavItemActive(item);

                return (
                  <NavLink
                    key={item.id}
                    label={item.label}
                    leftSection={<Icon size={18} />}
                    active={isActive}
                    onClick={() => navigate(item.path)}
                    style={{ borderRadius: 'var(--mantine-radius-md)' }}
                    styles={{
                      root: {
                        '&[dataActive]': {
                          backgroundColor: 'white',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        },
                      },
                    }}
                  />
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </aside>

      {/* Secondary Sidebar - Feature Sub-navigation */}
      {secondaryNav && (
        <aside className="w-48 shrink-0 bg-white border-r border-slate-200">
          <div className="p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 mb-3">
              {isInEvents ? t('projects.detail.nav.events') : t('projects.detail.nav.changelog')}
            </p>
            <div className="space-y-1">
              {secondaryNav.map((item) => {
                const isActive = isSecondaryNavActive(item.path);

                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`
                      flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-all w-full text-left
                      ${isActive
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }
                    `}
                  >
                    <span className={isActive ? 'text-blue-500' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      )}

      {/* Content Area */}
      <main className="flex-1 min-w-0 overflow-auto p-6 bg-white">
        <Outlet />
      </main>
    </div>
  );
}

