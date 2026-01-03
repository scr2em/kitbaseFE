import { Navigate, useParams } from 'react-router';
import { Loader } from '@mantine/core';
import { useProjectQuery } from '../../../shared/api/queries';

export function EnvironmentDefaultRedirect() {
  const { projectKey } = useParams<{ projectKey: string; environmentId: string }>();
  const { data: project, isLoading } = useProjectQuery(projectKey || '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader size="sm" />
      </div>
    );
  }

  const isIonicProject = project?.projectType === 'ionic';
  const defaultPath = isIonicProject ? 'ota-updates' : 'events';

  return <Navigate to={defaultPath} replace />;
}
