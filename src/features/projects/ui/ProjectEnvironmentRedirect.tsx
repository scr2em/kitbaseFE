import { Loader, Alert, Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useParams, Navigate } from 'react-router';
import { AlertCircle, Plus } from 'lucide-react';
import { useEnvironmentsInfiniteQuery } from '../../../shared/api/queries/environments';
import { useProjectQuery } from '../../../shared/api/queries';
import { CreateEnvironmentModal } from '../../environments/ui/CreateEnvironmentModal';
import { useState } from 'react';

export function ProjectEnvironmentRedirect() {
  const { t } = useTranslation();
  const { projectKey } = useParams<{ projectKey: string }>();
  const [createModalOpened, setCreateModalOpened] = useState(false);

  const { data: project, isLoading: isLoadingProject } = useProjectQuery(projectKey || '');
  const { data, isLoading: isLoadingEnvironments, isError } = useEnvironmentsInfiniteQuery(projectKey || '');
  
  const isLoading = isLoadingProject || isLoadingEnvironments;

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-200px)] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <Alert
          icon={<AlertCircle size={16} />}
          title={t('common.error')}
          color="red"
        >
          {t('environments.error_loading')}
        </Alert>
      </div>
    );
  }

  const environments = data?.pages.flatMap((page) => page.data) || [];
  const isIonicProject = project?.projectType === 'ionic';
  const defaultPath = isIonicProject ? 'ota-updates' : 'events';

  // If there are environments, redirect to the first one
  const firstEnvironment = environments[0];
  if (firstEnvironment) {
    return <Navigate to={`/projects/${projectKey}/${firstEnvironment.id}/${defaultPath}`} replace />;
  }

  // No environments - show prompt to create one
  return (
    <div className="h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-slate-100 flex items-center justify-center">
          <AlertCircle size={32} className="text-slate-400" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          {t('projects.environment_redirect.no_environments_title')}
        </h2>
        <p className="text-slate-500 mb-6">
          {t('projects.environment_redirect.no_environments_description')}
        </p>
        <Button
          leftSection={<Plus size={16} />}
          onClick={() => setCreateModalOpened(true)}
        >
          {t('environments.create_button')}
        </Button>
      </div>

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
