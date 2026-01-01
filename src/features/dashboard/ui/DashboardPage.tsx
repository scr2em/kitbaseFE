import {
  Card,
  Button,
  ThemeIcon,
  Progress,
  Checkbox,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import {
  Folder,
  Users,
  Activity,
  ArrowRight,
  Package,
  Plus,
  UserPlus,
  Key,
  Rocket,
  CheckCircle2,
  Building,
  Webhook,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useCurrentUserQuery } from '../../../shared/api/queries/user';
import { useProjectsQuery } from '../../../shared/api/queries/projects';
import { useOrganizationMembersQuery } from '../../../shared/api/queries/organization';
import { useCurrentOrganization, usePageTitle } from '../../../shared/hooks';
import { SkeletonDashboard } from '../../../shared/components/Skeleton';

interface OnboardingStep {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  action: () => void;
  actionLabel: string;
}

export function DashboardPage() {
  const { t } = useTranslation();
  usePageTitle(t('dashboard.page_title'));
  const { data: user, isLoading: isLoadingUser } = useCurrentUserQuery();
  const { currentOrganization, hasOrganizations } = useCurrentOrganization();
  const { data: projects, isLoading: isLoadingProjects } = useProjectsQuery();
  const { data: membersData, isLoading: isLoadingMembers } = useOrganizationMembersQuery();
  const navigate = useNavigate();

  const isLoading = isLoadingUser || isLoadingProjects || isLoadingMembers;

  const projectsList = projects || [];
  const totalMembers = membersData?.pages[0]?.total || 0;

  // Calculate onboarding progress
  const hasCreatedProject = projectsList.length > 0;
  const hasTeamMembers = totalMembers > 1;

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'create-org',
      label: t('dashboard.onboarding.create_organization'),
      description: t('dashboard.onboarding.create_organization_desc'),
      icon: <Building size={18} />,
      completed: Boolean(hasOrganizations),
      action: () => navigate('/create-organization'),
      actionLabel: t('dashboard.onboarding.create_organization_action'),
    },
    {
      id: 'create-project',
      label: t('dashboard.onboarding.create_project'),
      description: t('dashboard.onboarding.create_project_desc'),
      icon: <Folder size={18} />,
      completed: hasCreatedProject,
      action: () => navigate('/projects'),
      actionLabel: t('dashboard.onboarding.create_project_action'),
    },
    {
      id: 'invite-team',
      label: t('dashboard.onboarding.invite_team'),
      description: t('dashboard.onboarding.invite_team_desc'),
      icon: <UserPlus size={18} />,
      completed: hasTeamMembers,
      action: () => navigate('/organization/team'),
      actionLabel: t('dashboard.onboarding.invite_team_action'),
    },
    {
      id: 'setup-webhook',
      label: t('dashboard.onboarding.setup_webhook'),
      description: t('dashboard.onboarding.setup_webhook_desc'),
      icon: <Webhook size={18} />,
      completed: false, // Can be enhanced with actual webhook check
      action: () => navigate('/organization/webhooks'),
      actionLabel: t('dashboard.onboarding.setup_webhook_action'),
    },
  ];

  const completedSteps = onboardingSteps.filter((step) => step.completed).length;
  const onboardingProgress = (completedSteps / onboardingSteps.length) * 100;
  const isOnboardingComplete = completedSteps === onboardingSteps.length;

  if (isLoading) {
    return <SkeletonDashboard hasOrganization={hasOrganizations} />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t('dashboard.welcome', { name: user.firstName })}
          </h1>
          <p className="text-slate-500 mt-1">
            {t('dashboard.welcome_subtitle')}
          </p>
        </div>
        {hasOrganizations && (
          <Button
            leftSection={<Plus size={18} />}
            onClick={() => navigate('/projects')}
          >
            {t('dashboard.new_project')}
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      {hasOrganizations && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card withBorder padding="lg" radius="md" className="group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide">
                  {t('dashboard.stats.active_projects')}
                </p>
                <p className="text-2xl font-bold mt-1 text-slate-900">
                  {projectsList.length}
                </p>
              </div>
              <ThemeIcon
                size={44}
                radius="md"
                variant="light"
                color="blue"
                className="group-hover:scale-110 transition-transform"
              >
                <Folder size={22} />
              </ThemeIcon>
            </div>
            <button
              onClick={() => navigate('/projects')}
              className="mt-3 text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              {t('dashboard.stats.view_all')}
              <ArrowRight size={12} />
            </button>
          </Card>

          <Card withBorder padding="lg" radius="md" className="group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide">
                  {t('dashboard.stats.team_members')}
                </p>
                <p className="text-2xl font-bold mt-1 text-slate-900">
                  {totalMembers}
                </p>
              </div>
              <ThemeIcon
                size={44}
                radius="md"
                variant="light"
                color="teal"
                className="group-hover:scale-110 transition-transform"
              >
                <Users size={22} />
              </ThemeIcon>
            </div>
            <button
              onClick={() => navigate('/organization/team')}
              className="mt-3 text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
            >
              {t('dashboard.stats.manage_team')}
              <ArrowRight size={12} />
            </button>
          </Card>

          <Card withBorder padding="lg" radius="md" className="group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide">
                  {t('dashboard.stats.organization')}
                </p>
                <p className="text-lg font-bold mt-1 text-slate-900 truncate max-w-[140px]">
                  {currentOrganization?.organization.name}
                </p>
              </div>
              <ThemeIcon
                size={44}
                radius="md"
                variant="light"
                color="violet"
                className="group-hover:scale-110 transition-transform"
              >
                <Building size={22} />
              </ThemeIcon>
            </div>
            <button
              onClick={() => navigate('/organization')}
              className="mt-3 text-xs text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1"
            >
              {t('dashboard.stats.view_org')}
              <ArrowRight size={12} />
            </button>
          </Card>

          <Card withBorder padding="lg" radius="md" className="group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide">
                  {t('dashboard.stats.your_role')}
                </p>
                <p className="text-lg font-bold mt-1 text-slate-900">
                  {currentOrganization?.role.name || 'Member'}
                </p>
              </div>
              <ThemeIcon
                size={44}
                radius="md"
                variant="light"
                color="orange"
                className="group-hover:scale-110 transition-transform"
              >
                <Key size={22} />
              </ThemeIcon>
            </div>
            <button
              onClick={() => navigate('/settings')}
              className="mt-3 text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
            >
              {t('dashboard.stats.view_settings')}
              <ArrowRight size={12} />
            </button>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        {hasOrganizations && (
          <div className="lg:col-span-2">
            <Card withBorder padding="lg" radius="md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  {t('dashboard.recent_projects')}
                </h2>
                <Button
                  variant="subtle"
                  size="xs"
                  rightSection={<ArrowRight size={14} />}
                  onClick={() => navigate('/projects')}
                >
                  {t('dashboard.view_all_projects')}
                </Button>
              </div>

              {projectsList.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                    <Package size={32} className="text-slate-400" />
                  </div>
                  <p className="text-slate-500 mb-4">{t('dashboard.no_projects_yet')}</p>
                  <Button
                    leftSection={<Plus size={16} />}
                    onClick={() => navigate('/projects')}
                  >
                    {t('dashboard.create_first_project')}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {projectsList.slice(0, 4).map((project) => (
                    <button
                      key={project.id}
                      onClick={() => navigate(`/projects/${project.projectKey}`)}
                      className="p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-left group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shrink-0">
                          <Package size={18} className="text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                            {project.name}
                          </p>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">
                            {project.projectKey}
                          </p>
                        </div>
                        <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors shrink-0 mt-1" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Onboarding / Getting Started */}
        <div className={hasOrganizations ? 'lg:col-span-1' : 'lg:col-span-3'}>
          <Card withBorder padding="lg" radius="md">
            <div className="flex items-center gap-3 mb-4">
              {isOnboardingComplete ? (
                <ThemeIcon size={40} radius="md" color="green" variant="light">
                  <CheckCircle2 size={20} />
                </ThemeIcon>
              ) : (
                <ThemeIcon size={40} radius="md" color="blue" variant="light">
                  <Rocket size={20} />
                </ThemeIcon>
              )}
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-900">
                  {isOnboardingComplete
                    ? t('dashboard.onboarding.complete_title')
                    : t('dashboard.onboarding.title')}
                </h2>
                <p className="text-sm text-slate-500">
                  {t('dashboard.onboarding.progress', {
                    completed: completedSteps,
                    total: onboardingSteps.length,
                  })}
                </p>
              </div>
            </div>

            <Progress
              value={onboardingProgress}
              size="sm"
              radius="xl"
              color={isOnboardingComplete ? 'green' : 'blue'}
              className="mb-4"
            />

            <div className="space-y-3">
              {onboardingSteps.map((step) => (
                <div
                  key={step.id}
                  className={`p-3 rounded-lg border transition-all ${
                    step.completed
                      ? 'border-green-200 bg-green-50/50'
                      : 'border-slate-200 hover:border-blue-200 hover:bg-blue-50/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={step.completed}
                      readOnly
                      color={step.completed ? 'green' : 'blue'}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          step.completed ? 'text-green-700 line-through' : 'text-slate-900'
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {step.description}
                      </p>
                      {!step.completed && (
                        <Button
                          variant="subtle"
                          size="xs"
                          className="mt-2 -ml-2"
                          onClick={step.action}
                        >
                          {step.actionLabel}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      {hasOrganizations && (
        <Card withBorder padding="lg" radius="md">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            {t('dashboard.quick_actions')}
          </h2>
          <div className="flex flex-wrap gap-3">
            <Button
              leftSection={<Plus size={18} />}
              variant="light"
              onClick={() => navigate('/projects')}
            >
              {t('dashboard.actions.new_project')}
            </Button>
            <Button
              leftSection={<UserPlus size={18} />}
              variant="light"
              color="teal"
              onClick={() => navigate('/organization/team')}
            >
              {t('dashboard.actions.invite_member')}
            </Button>
            <Button
              leftSection={<Activity size={18} />}
              variant="light"
              color="violet"
              onClick={() => {
                if (projectsList.length > 0) {
                  navigate(`/projects/${projectsList[0]?.projectKey}/events`);
                }
              }}
              disabled={projectsList.length === 0}
            >
              {t('dashboard.actions.view_events')}
            </Button>
            <Button
              leftSection={<Webhook size={18} />}
              variant="light"
              color="orange"
              onClick={() => navigate('/organization/webhooks')}
            >
              {t('dashboard.actions.manage_webhooks')}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
