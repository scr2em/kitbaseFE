import { useLocation, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Home } from 'lucide-react';
import { useProjectQuery } from '../api/queries';

interface BreadcrumbItem {
  label: string;
  path?: string;
  isCurrentPage?: boolean;
}

export function Breadcrumb() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { projectKey, webhookId, changelogId, eventId } = useParams();
  
  const { data: project } = useProjectQuery(projectKey || '');

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const path = location.pathname;
    const breadcrumbs: BreadcrumbItem[] = [];

    // Dashboard
    if (path === '/dashboard') {
      breadcrumbs.push({ label: t('navigation.dashboard'), isCurrentPage: true });
      return breadcrumbs;
    }

    // Projects list
    if (path === '/projects') {
      breadcrumbs.push({ label: t('navigation.projects'), isCurrentPage: true });
      return breadcrumbs;
    }

    // Project detail pages
    if (path.startsWith('/projects/') && projectKey) {
      breadcrumbs.push({ label: t('navigation.projects'), path: '/projects' });
      breadcrumbs.push({ label: project?.name || projectKey, path: `/projects/${projectKey}` });

      const subPath = path.replace(`/projects/${projectKey}`, '');
      
      if (subPath === '/bundles' || subPath === '') {
        breadcrumbs.push({ label: t('projects.detail.nav.bundles'), isCurrentPage: true });
      } else if (subPath === '/builds') {
        breadcrumbs.push({ label: t('projects.detail.nav.builds'), isCurrentPage: true });
      } else if (subPath === '/changelog') {
        breadcrumbs.push({ label: t('projects.detail.nav.changelog'), isCurrentPage: true });
      } else if (subPath === '/changelog/create') {
        breadcrumbs.push({ label: t('projects.detail.nav.changelog'), path: `/projects/${projectKey}/changelog` });
        breadcrumbs.push({ label: t('projects.detail.changelog.create.page_title'), isCurrentPage: true });
      } else if (subPath.startsWith('/changelog/') && changelogId) {
        breadcrumbs.push({ label: t('projects.detail.nav.changelog'), path: `/projects/${projectKey}/changelog` });
        breadcrumbs.push({ label: t('projects.detail.changelog.edit.page_title'), isCurrentPage: true });
      } else if (subPath === '/events') {
        breadcrumbs.push({ label: t('projects.detail.nav.events'), isCurrentPage: true });
      } else if (subPath.startsWith('/events/') && eventId) {
        breadcrumbs.push({ label: t('projects.detail.nav.events'), path: `/projects/${projectKey}/events` });
        breadcrumbs.push({ label: t('events.detail.page_title'), isCurrentPage: true });
      } else if (subPath === '/environments') {
        breadcrumbs.push({ label: t('projects.detail.nav.environments'), isCurrentPage: true });
      } else if (subPath === '/api-keys') {
        breadcrumbs.push({ label: t('projects.detail.nav.api_keys'), isCurrentPage: true });
      } else if (subPath === '/settings') {
        breadcrumbs.push({ label: t('projects.detail.nav.settings'), isCurrentPage: true });
      }

      return breadcrumbs;
    }

    // Organization pages
    if (path.startsWith('/organization')) {
      breadcrumbs.push({ label: t('navigation.organization'), path: '/organization' });

      if (path === '/organization/info' || path === '/organization') {
        breadcrumbs.push({ label: t('navigation.organization_menu.info'), isCurrentPage: true });
      } else if (path === '/organization/team') {
        breadcrumbs.push({ label: t('navigation.organization_menu.team'), isCurrentPage: true });
      } else if (path === '/organization/webhooks') {
        breadcrumbs.push({ label: t('navigation.organization_menu.webhooks'), isCurrentPage: true });
      } else if (path === '/organization/webhooks/create') {
        breadcrumbs.push({ label: t('navigation.organization_menu.webhooks'), path: '/organization/webhooks' });
        breadcrumbs.push({ label: t('webhooks.create.page_title'), isCurrentPage: true });
      } else if (path.startsWith('/organization/webhooks/') && webhookId) {
        breadcrumbs.push({ label: t('navigation.organization_menu.webhooks'), path: '/organization/webhooks' });
        breadcrumbs.push({ label: t('webhooks.detail.page_title'), isCurrentPage: true });
      }

      return breadcrumbs;
    }

    // Settings pages
    if (path.startsWith('/settings')) {
      breadcrumbs.push({ label: t('navigation.settings'), path: '/settings' });

      if (path === '/settings/me' || path === '/settings') {
        breadcrumbs.push({ label: t('settings.nav.profile'), isCurrentPage: true });
      }

      return breadcrumbs;
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center gap-1 text-sm" aria-label="Breadcrumb">
      <button
        onClick={() => navigate('/dashboard')}
        className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        aria-label={t('navigation.dashboard')}
      >
        <Home size={14} />
      </button>
      
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          <ChevronRight size={14} className="text-slate-300" />
          {item.isCurrentPage || !item.path ? (
            <span className="text-slate-900 font-medium px-1">
              {item.label}
            </span>
          ) : (
            <button
              onClick={() => navigate(item.path!)}
              className="text-slate-500 hover:text-slate-700 hover:underline px-1 transition-colors"
            >
              {item.label}
            </button>
          )}
        </div>
      ))}
    </nav>
  );
}

