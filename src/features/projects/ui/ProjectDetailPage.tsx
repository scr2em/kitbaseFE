import {
  Loader,
  Alert,
  Badge,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, useLocation, Outlet } from 'react-router';
import { 
  AlertCircle, 
  Package, 
  ArrowLeft, 
  Hammer, 
  Key, 
  FileText,
  Layers,
  Activity,
  Settings,
} from 'lucide-react';
import { useProjectQuery } from '../../../shared/api/queries';

export function ProjectDetailPage() {
  const { t } = useTranslation();
  const { projectKey } = useParams<{ projectKey: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: project, isLoading, isError } = useProjectQuery(projectKey || '');

  const navigationItems = [
    {
      label: t('projects.detail.nav.bundles'),
      path: `/projects/${projectKey}/bundles`,
      icon: <Package size={18} />,
    },
    {
      label: t('projects.detail.nav.builds'),
      path: `/projects/${projectKey}/builds`,
      icon: <Hammer size={18} />,
    },
    {
      label: t('projects.detail.nav.changelog'),
      path: `/projects/${projectKey}/changelog`,
      icon: <FileText size={18} />,
    },
    {
      label: t('projects.detail.nav.events'),
      path: `/projects/${projectKey}/events`,
      icon: <Activity size={18} />,
    },
    {
      label: t('projects.detail.nav.api_keys'),
      path: `/projects/${projectKey}/api-keys`,
      icon: <Key size={18} />,
    },
    {
      label: t('projects.detail.nav.environments'),
      path: `/projects/${projectKey}/environments`,
      icon: <Layers size={18} />,
    },
    {
      label: t('projects.detail.nav.settings'),
      path: `/projects/${projectKey}/settings`,
      icon: <Settings size={18} />,
    },
  ];

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div>
        <Alert
          icon={<AlertCircle size={16} />}
          title={t('common.error')}
          color="red"
        >
          {t('projects.detail.error_loading')}
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Simple Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/projects')}
            className="p-1.5 -ml-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
            <Package size={18} className="text-white" strokeWidth={2} />
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-slate-900">{project.name}</h1>
            <Badge variant="light" color="gray" size="sm" className="font-mono">
              {project.projectKey}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content with Side Navigation - Intercom Style */}
      <div className="flex flex-col lg:flex-row gap-0 flex-1 -mx-6 -mb-6">
        {/* Side Navigation */}
        <aside className="lg:w-56 xl:w-64 shrink-0 bg-slate-50 border-r border-slate-200 min-h-[calc(100vh-180px)]">
          <nav className="sticky top-4 py-4">
            <div className="px-3 mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3">
                {t('navigation.settings')}
              </span>
            </div>
            <div className="flex flex-col gap-0.5 px-3">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`
                      relative flex items-center gap-3 px-3 py-2.5 text-left transition-all w-full rounded-md
                      ${isActive 
                        ? 'bg-white text-slate-900 font-medium' 
                        : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
                      }
                    `}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-500 rounded-r-full" />
                    )}
                    <span className={`transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'}`}>
                      {item.icon}
                    </span>
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </aside>
        
        {/* Content Area */}
        <main className="flex-1 px-6 py-4 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

