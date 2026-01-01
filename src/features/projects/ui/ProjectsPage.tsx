import {
  Card,
  Button,
  Alert,
  Badge,
  Menu,
  ActionIcon,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Plus, MoreVertical, Trash2, Package, Building, Pencil, BookOpen } from 'lucide-react';
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
import type { ProjectResponse } from '../../../generated-api';

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
        <div className="flex justify-between items-start">
          <div>
            <div className="h-8 w-32 bg-slate-200 rounded animate-pulse mb-2" />
            <div className="h-5 w-48 bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-slate-200 rounded animate-pulse" />
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
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {t('projects.title')}
            </h1>
            <p className="text-lg text-gray-500">
              {t('projects.subtitle', { count: projectsList.length })}
            </p>
          </div>
          {canCreateProject && (
            <Button
              leftSection={<Plus size={18} />}
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
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
              icon={Package}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsList.map((project) => (
              <Card
                key={project.id}
                withBorder
                radius="md"
                padding="lg"
                className="relative cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/projects/${project.projectKey}`)}
              >
                <div className="flex flex-col gap-4">
                  {/* Card Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex gap-2 items-center mb-1">
                        <Package size={20} strokeWidth={2} />
                        <p className="font-semibold text-lg leading-tight">
                          {project.name}
                        </p>
                      </div>
                      <Badge variant="light" color="blue" size="sm">
                        {project.projectKey}
                      </Badge>
                    </div>
                    
                    {(canUpdateProject || canDeleteProject) && (
                      <Menu shadow="md" width={200} position="bottom-end">
                        <Menu.Target>
                          <ActionIcon 
                            variant="subtle" 
                            color="gray"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical size={18} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          {canUpdateProject && (
                            <Menu.Item
                              leftSection={<Pencil size={16} />}
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
                              leftSection={<Trash2 size={16} />}
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

                  {/* Description */}
                  {project.description && (
                    <p className="text-sm text-gray-500 min-h-[40px]">
                      {project.description}
                    </p>
                  )}

                  {/* Metadata */}
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      {t('projects.created_at', {
                        date: new Date(project.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }),
                      })}
                    </p>
                  </div>
                </div>
              </Card>
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










