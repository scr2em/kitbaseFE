import { Spotlight, type SpotlightActionData } from '@mantine/spotlight';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Building,
  Users,
  Webhook,
  Settings,
  Folder,
  Plus,
  UserPlus,
  Search,
} from 'lucide-react';
import { useProjectsQuery } from '../api/queries';

export function SpotlightSearch() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: projects } = useProjectsQuery();

  const navigationActions: SpotlightActionData[] = [
    {
      id: 'dashboard',
      label: t('search.actions.go_to_dashboard'),
      description: t('navigation.dashboard'),
      leftSection: <LayoutDashboard size={18} />,
      onClick: () => navigate('/dashboard'),
      keywords: ['home', 'dashboard', 'main'],
    },
    {
      id: 'projects',
      label: t('search.actions.go_to_projects'),
      description: t('navigation.projects'),
      leftSection: <Folder size={18} />,
      onClick: () => navigate('/projects'),
      keywords: ['projects', 'apps', 'applications'],
    },
    {
      id: 'organization',
      label: t('search.actions.go_to_organization'),
      description: t('navigation.organization'),
      leftSection: <Building size={18} />,
      onClick: () => navigate('/organization'),
      keywords: ['organization', 'company', 'workspace'],
    },
    {
      id: 'team',
      label: t('search.actions.go_to_team'),
      description: t('navigation.team'),
      leftSection: <Users size={18} />,
      onClick: () => navigate('/organization/team'),
      keywords: ['team', 'members', 'users', 'people'],
    },
    {
      id: 'webhooks',
      label: t('search.actions.go_to_webhooks'),
      description: t('navigation.webhooks'),
      leftSection: <Webhook size={18} />,
      onClick: () => navigate('/organization/webhooks'),
      keywords: ['webhooks', 'hooks', 'integrations'],
    },
    {
      id: 'settings',
      label: t('search.actions.go_to_settings'),
      description: t('navigation.settings'),
      leftSection: <Settings size={18} />,
      onClick: () => navigate('/settings'),
      keywords: ['settings', 'preferences', 'profile'],
    },
  ];

  const quickActions: SpotlightActionData[] = [
    {
      id: 'create-project',
      label: t('search.actions.create_project'),
      description: t('projects.create_button'),
      leftSection: <Plus size={18} className="text-blue-500" />,
      onClick: () => navigate('/projects'),
      keywords: ['create', 'new', 'project', 'add'],
    },
    {
      id: 'invite-member',
      label: t('search.actions.invite_member'),
      description: t('team.invite_member'),
      leftSection: <UserPlus size={18} className="text-green-500" />,
      onClick: () => navigate('/organization/team'),
      keywords: ['invite', 'add', 'member', 'user'],
    },
  ];

  const projectActions: SpotlightActionData[] = (projects || []).map((project) => ({
    id: `project-${project.id}`,
    label: project.name,
    description: project.projectKey,
    leftSection: <Folder size={18} className="text-slate-400" />,
    onClick: () => navigate(`/projects/${project.projectKey}`),
    keywords: [project.name.toLowerCase(), project.projectKey.toLowerCase()],
  }));

  const allActions = [
    ...navigationActions,
    ...quickActions,
    ...projectActions,
  ];

  return (
    <Spotlight
      actions={allActions}
      nothingFound={t('search.no_results')}
      highlightQuery
      searchProps={{
        leftSection: <Search size={18} className="text-slate-400" />,
        placeholder: t('search.hint'),
      }}
      shortcut={['mod + K', 'mod + P']}
      tagsToIgnore={['INPUT', 'TEXTAREA']}
    />
  );
}

