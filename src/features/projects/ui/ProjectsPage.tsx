import {
  Card,
  Button,
  Alert,
  Menu,
  ActionIcon,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Plus, MoreVertical, Trash2, Building, Pencil, BookOpen, ArrowUpRight, Layers } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import {
  useProjectsQuery,
  useDeleteProjectMutation,
} from '../../../shared/api/queries';
import { useShowBackendError, usePermissions, useCurrentOrganization, usePageTitle } from '../../../shared/hooks';
import { CreateProjectModal } from './CreateProjectModal';
import { EditProjectModal } from './EditProjectModal';
import { EmptyState } from '../../../shared/components/EmptyState';
import { SkeletonProjectsGrid } from '../../../shared/components/Skeleton';
import type { ProjectResponse, ProjectType } from '../../../generated-api';

const PROJECT_TYPE_COLORS: Record<ProjectType, string> = {
  react: 'bg-sky-500',
  angular: 'bg-red-500',
  vue: 'bg-emerald-500',
  nextjs: 'bg-neutral-900 dark:bg-white',
  ionic: 'bg-blue-500',
  flutter: 'bg-cyan-400',
  others: 'bg-slate-400',
};

export function ProjectsPage() {
  const { t } = useTranslation();
  usePageTitle(t('projects.page_title'));
  const navigate = useNavigate();
  const [createModalOpened, setCreateModalOpened] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectResponse | null>(null);
  const { hasOrganizations, isLoading: isLoadingUser } = useCurrentOrganization();
  const { data: projects, isLoading, isError } = useProjectsQuery();
  const deleteProjectMutation = useDeleteProjectMutation();
  const { showError } = useShowBackendError();
  const { canCreateProject, canDeleteProject, canUpdateProject } = usePermissions();

  const handleDeleteProject = (projectKey: string, projectName: string) => {
    modals.openConfirmModal({
      title: t('projects.delete.title'),
      children: (
        <p className="text-sm">
          {t('projects.delete.confirmation', { name: projectName })}
        </p>
      ),
      labels: { confirm: t('projects.delete.confirm'), cancel: t('projects.delete.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteProjectMutation.mutateAsync(projectKey);
          notifications.show({
            title: t('common.success'),
            message: t('projects.delete.success_message'),
            color: 'green',
          });
        } catch (error) {
          showError(error);
        }
      },
    });
  };

  if (isLoadingUser || isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-7 w-28 bg-neutral-200 dark:bg-neutral-800 rounded-md animate-pulse mb-2" />
            <div className="h-4 w-40 bg-neutral-100 dark:bg-neutral-800/50 rounded-md animate-pulse" />
          </div>
          <div className="h-9 w-32 bg-neutral-200 dark:bg-neutral-800 rounded-md animate-pulse" />
        </div>
        <SkeletonProjectsGrid count={6} />
      </div>
    );
  }

  if (!hasOrganizations) {
    return (
      <div>
        <div className="flex flex-col gap-4">
          <Alert
            icon={<AlertCircle size={16} />}
            title={t('projects.no_organization_title')}
            color="yellow"
          >
            {t('projects.no_organization_message')}
          </Alert>
          <Button
            leftSection={<Building size={16} />}
            variant="light"
            size="md"
            onClick={() => navigate('/create-organization')}
            className="self-start"
          >
            {t('dashboard.create_organization')}
          </Button>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <Alert
          icon={<AlertCircle size={16} />}
          title={t('common.error')}
          color="red"
        >
          {t('projects.error_loading')}
        </Alert>
      </div>
    );
  }

  const projectsList = projects || [];

  return (
    <div>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-1">
              {t('projects.title')}
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {t('projects.subtitle', { count: projectsList.length })}
            </p>
          </div>
          {canCreateProject && (
            <Button
              leftSection={<Plus size={16} />}
              color="dark"
              radius="md"
              onClick={() => setCreateModalOpened(true)}
            >
              {t('projects.create_button')}
            </Button>
          )}
        </div>

        {/* Projects Grid */}
        {projectsList.length === 0 ? (
          <Card withBorder p="xl" radius="md">
            <EmptyState
              icon={Layers}
              title={t('projects.empty.title')}
              description={t('projects.empty.description')}
              illustration="projects"
              primaryAction={canCreateProject ? {
                label: t('projects.create_first_project'),
                onClick: () => setCreateModalOpened(true),
                icon: <Plus size={18} />,
              } : undefined}
              secondaryAction={{
                label: t('projects.empty.learn_more'),
                onClick: () => window.open('https://docs.kitbase.app/projects', '_blank'),
                icon: <BookOpen size={18} />,
                variant: 'subtle',
              }}
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projectsList.map((project) => (
              <div
                key={project.id}
                className="group relative bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 cursor-pointer transition-all duration-200 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-neutral-900/50 hover:-translate-y-0.5"
                onClick={() => navigate(`/projects/${project.projectKey}`)}
              >
                {/* Top Row: Type indicator + Menu */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${PROJECT_TYPE_COLORS[project.projectType]}`} />
                    <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      {t(`projects.project_types.${project.projectType}`)}
                    </span>
                  </div>
                  
                  {(canUpdateProject || canDeleteProject) && (
                    <Menu shadow="md" width={180} position="bottom-end">
                      <Menu.Target>
                        <ActionIcon 
                          variant="subtle" 
                          color="gray"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        {canUpdateProject && (
                          <Menu.Item
                            leftSection={<Pencil size={14} />}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingProject(project);
                            }}
                          >
                            {t('projects.edit.menu_item')}
                          </Menu.Item>
                        )}
                        {canDeleteProject && (
                          <Menu.Item
                            color="red"
                            leftSection={<Trash2 size={14} />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(project.projectKey, project.name);
                            }}
                          >
                            {t('projects.delete.menu_item')}
                          </Menu.Item>
                        )}
                      </Menu.Dropdown>
                    </Menu>
                  )}
                </div>

                {/* Project Name */}
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight mb-1.5 flex items-center gap-2">
                  {project.name}
                  <ArrowUpRight 
                    size={16} 
                    className="text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" 
                  />
                </h3>

                {/* Project Key */}
                <p className="text-sm font-mono text-neutral-500 dark:text-neutral-400 mb-3">
                  {project.projectKey}
                </p>

                {/* Description */}
                {project.description && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                )}

                {/* Footer */}
                <div className="pt-4 mt-auto border-t border-neutral-100 dark:border-neutral-800">
                  <p className="text-xs text-neutral-400 dark:text-neutral-500">
                    {new Date(project.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateProjectModal
        opened={createModalOpened}
        onClose={() => setCreateModalOpened(false)}
      />

      {editingProject && (
        <EditProjectModal
          opened={true}
          onClose={() => setEditingProject(null)}
          project={editingProject}
        />
      )}
    </div>
  );
}
