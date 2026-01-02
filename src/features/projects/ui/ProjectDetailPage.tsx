import {
  Loader,
  Alert,
  Badge,
  Menu,
  Button,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, useLocation, Outlet } from 'react-router';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { 
  AlertCircle, 
  Package, 
  ArrowLeft, 
  Hammer, 
  Key, 
  FileText,
  Activity,
  Settings,
  Smartphone,
  ChevronDown,
  Check,
  Edit,
  Trash2,
  Plus,
  Layers,
} from 'lucide-react';
import { useProjectQuery } from '../../../shared/api/queries';
import { 
  useEnvironmentsInfiniteQuery,
  useDeleteEnvironmentMutation,
} from '../../../shared/api/queries/environments';
import { useShowBackendError } from '../../../shared/hooks';
import { UpdateEnvironmentModal } from '../../environments/ui/UpdateEnvironmentModal';
import { CreateEnvironmentModal } from '../../environments/ui/CreateEnvironmentModal';
import type { EnvironmentResponse } from '../../../generated-api';

export function ProjectDetailPage() {
  const { t } = useTranslation();
  const { projectKey, environmentId } = useParams<{ projectKey: string; environmentId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: project, isLoading, isError } = useProjectQuery(projectKey || '');
  const { data: environmentsData, isLoading: isLoadingEnvironments } = useEnvironmentsInfiniteQuery(projectKey || '');
  const deleteEnvironmentMutation = useDeleteEnvironmentMutation(projectKey || '');
  const { showError } = useShowBackendError();

  const [updateModalData, setUpdateModalData] = useState<{
    opened: boolean;
    environment: EnvironmentResponse | null;
  }>({ opened: false, environment: null });
  const [createModalOpened, setCreateModalOpened] = useState(false);

  const environments = environmentsData?.pages.flatMap((page) => page.data) || [];
  const currentEnvironment = environments.find((env) => env.id === environmentId);
  
  // Check if we're on the settings page (no environmentId)
  const isSettingsPage = !environmentId || location.pathname.endsWith('/settings');
  
  // For navigation, use the first environment if we don't have one selected
  const navEnvironmentId = environmentId || environments[0]?.id;

  const navigationItems = [
    {
      label: t('projects.detail.nav.ota_updates'),
      path: navEnvironmentId ? `/projects/${projectKey}/${navEnvironmentId}/ota-updates` : '#',
      icon: <Smartphone size={18} />,
      requiresEnvironment: true,
    },
    {
      label: t('projects.detail.nav.builds'),
      path: navEnvironmentId ? `/projects/${projectKey}/${navEnvironmentId}/builds` : '#',
      icon: <Hammer size={18} />,
      requiresEnvironment: true,
    },
    {
      label: t('projects.detail.nav.changelog'),
      path: navEnvironmentId ? `/projects/${projectKey}/${navEnvironmentId}/changelog` : '#',
      icon: <FileText size={18} />,
      requiresEnvironment: true,
    },
    {
      label: t('projects.detail.nav.events'),
      path: navEnvironmentId ? `/projects/${projectKey}/${navEnvironmentId}/events` : '#',
      icon: <Activity size={18} />,
      requiresEnvironment: true,
    },
    {
      label: t('projects.detail.nav.api_keys'),
      path: navEnvironmentId ? `/projects/${projectKey}/${navEnvironmentId}/api-keys` : '#',
      icon: <Key size={18} />,
      requiresEnvironment: true,
    },
    {
      label: t('projects.detail.nav.settings'),
      path: `/projects/${projectKey}/settings`,
      icon: <Settings size={18} />,
      requiresEnvironment: false,
    },
  ];

  const handleSwitchEnvironment = (envId: string) => {
    // Get current path segment after environmentId
    const pathParts = location.pathname.split('/');
    const envIndex = pathParts.findIndex((part) => part === environmentId);
    const pathAfterEnv = envIndex !== -1 ? pathParts.slice(envIndex + 1).join('/') : 'ota-updates';
    
    navigate(`/projects/${projectKey}/${envId}/${pathAfterEnv || 'ota-updates'}`);
  };

  const handleEditEnvironment = () => {
    if (currentEnvironment) {
      setUpdateModalData({ opened: true, environment: currentEnvironment });
    }
  };

  const handleDeleteEnvironment = () => {
    if (!currentEnvironment) return;

    modals.openConfirmModal({
      title: t('environments.delete.title'),
      children: (
        <p className="text-sm">
          {t('environments.delete.confirmation', { name: currentEnvironment.name })}
        </p>
      ),
      labels: { confirm: t('environments.delete.confirm'), cancel: t('environments.delete.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteEnvironmentMutation.mutateAsync(currentEnvironment.id);
          notifications.show({
            title: t('common.success'),
            message: t('environments.delete.success_message'),
            color: 'green',
          });
          
          // Navigate to another environment or redirect to project root
          const remainingEnvironments = environments.filter((env) => env.id !== currentEnvironment.id);
          if (remainingEnvironments.length > 0) {
            navigate(`/projects/${projectKey}/${remainingEnvironments[0].id}/ota-updates`);
          } else {
            navigate(`/projects/${projectKey}`);
          }
        } catch (error) {
          showError(error);
        }
      },
    });
  };

  if (isLoading || isLoadingEnvironments) {
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
      {/* Header */}
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

        {/* Environment Selector Dropdown - only show when on environment-scoped pages */}
        {!isSettingsPage && environments.length > 0 && (
          <Menu shadow="md" width={260} position="bottom-end">
            <Menu.Target>
              <Button
                variant="light"
                rightSection={<ChevronDown size={16} />}
                leftSection={<Layers size={16} />}
              >
                {currentEnvironment?.name || t('environments.badge')}
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>{t('projects.environment_selector.switch_environment')}</Menu.Label>
              {environments.map((env) => (
                <Menu.Item
                  key={env.id}
                  leftSection={env.id === environmentId ? <Check size={16} /> : <div className="w-4" />}
                  onClick={() => handleSwitchEnvironment(env.id)}
                >
                  <span className={env.id === environmentId ? 'font-medium' : ''}>
                    {env.name}
                  </span>
                </Menu.Item>
              ))}
              
              <Menu.Divider />
              
              <Menu.Item
                leftSection={<Plus size={16} />}
                onClick={() => setCreateModalOpened(true)}
              >
                {t('projects.environment_selector.create_environment')}
              </Menu.Item>
              
              {currentEnvironment && (
                <>
                  <Menu.Item
                    leftSection={<Edit size={16} />}
                    onClick={handleEditEnvironment}
                  >
                    {t('projects.environment_selector.edit_environment')}
                  </Menu.Item>
                  <Menu.Item
                    color="red"
                    leftSection={<Trash2 size={16} />}
                    onClick={handleDeleteEnvironment}
                  >
                    {t('projects.environment_selector.delete_environment')}
                  </Menu.Item>
                </>
              )}
            </Menu.Dropdown>
          </Menu>
        )}
      </div>

      {/* Main Content with Side Navigation */}
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
                const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                const isDisabled = item.requiresEnvironment && !navEnvironmentId;
                
                return (
                  <button
                    key={item.path}
                    onClick={() => !isDisabled && navigate(item.path)}
                    disabled={isDisabled}
                    className={`
                      relative flex items-center gap-3 px-3 py-2.5 text-left transition-all w-full rounded-md
                      ${isDisabled 
                        ? 'text-slate-300 cursor-not-allowed'
                        : isActive 
                          ? 'bg-white text-slate-900 font-medium' 
                          : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
                      }
                    `}
                  >
                    {isActive && !isDisabled && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-500 rounded-r-full" />
                    )}
                    <span className={`transition-colors ${isDisabled ? 'text-slate-300' : isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'}`}>
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

      {/* Environment Modals */}
      {updateModalData.environment && projectKey && (
        <UpdateEnvironmentModal
          opened={updateModalData.opened}
          onClose={() => setUpdateModalData({ opened: false, environment: null })}
          projectKey={projectKey}
          environment={updateModalData.environment}
        />
      )}

      {projectKey && (
        <CreateEnvironmentModal
          opened={createModalOpened}
          onClose={() => setCreateModalOpened(false)}
          projectKey={projectKey}
        />
      )}
    </div>
  );
}
