import { Button, Paper, Alert, Loader } from '@mantine/core';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router';
import { notifications } from '@mantine/notifications';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { changelogSchema, type ChangelogFormData } from '../model/changelog-schema';
import { ControlledTextInput, ControlledCheckbox } from '../../../shared/controlled-form-fields';
import { TipTapEditor } from '../../../shared/components/TipTapEditor';
import { useCreateChangelogMutation } from '../../../shared/api/queries/changelog';
import { useProjectQuery } from '../../../shared/api/queries';
import { useShowBackendError } from '../../../shared/hooks';

export function CreateChangelogPage() {
  const { t } = useTranslation();
  const { projectKey, environmentId } = useParams<{ projectKey: string; environmentId: string }>();
  const navigate = useNavigate();
  const { showError } = useShowBackendError();
  const createChangelogMutation = useCreateChangelogMutation(projectKey || '');
  
  const { data: project, isLoading: isLoadingProject, isError: isProjectError } = useProjectQuery(projectKey || '');

  const form = useForm<ChangelogFormData>({
    resolver: zodResolver(changelogSchema),
    defaultValues: {
      version: '',
      markdown: '',
      isPublished: false,
    },
  });

  const handleSubmit = async (data: ChangelogFormData) => {

    if(!environmentId) {
      notifications.show({
        title: t('common.error'),
        message: t('projects.detail.changelog.create.environment_required'),
        color: 'red',
      });
      return;
    }
    
    try {
      await createChangelogMutation.mutateAsync({
        version: data.version,
        markdown: data.markdown,
        isPublished: data.isPublished,
        environmentId: environmentId,
      });

      notifications.show({
        title: t('common.success'),
        message: t('projects.detail.changelog.create.success_message'),
        color: 'green',
      });

      navigate(`/projects/${projectKey}/${environmentId}/changelog`);
    } catch (error) {
      showError(error);
    }
  };

  const handleCancel = () => {
    navigate(`/projects/${projectKey}/${environmentId}/changelog`);
  };

  if (isLoadingProject) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (isProjectError || !project) {
    return (
      <Alert
        icon={<AlertCircle size={16} />}
        title={t('common.error')}
        color="red"
      >
        {t('projects.detail.error_loading')}
      </Alert>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="subtle"
              size="sm"
              leftSection={<ArrowLeft size={16} />}
              onClick={handleCancel}
            >
              {t('projects.detail.changelog.create.back_button')}
            </Button>
            <div>
              <h2 className="text-2xl font-semibold">
                {t('projects.detail.changelog.create.page_title')}
              </h2>
              <p className="text-sm text-gray-500">{project.name}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Paper withBorder p="xl">
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-6">
              <ControlledTextInput
                control={form.control}
                name="version"
                label={t('projects.detail.changelog.create.version_label')}
                placeholder={t('projects.detail.changelog.create.version_placeholder')}
                description={t('projects.detail.changelog.create.version_description')}
                required
              />

              <div>
                <label className="block text-sm font-medium mb-1">
                  {t('projects.detail.changelog.create.markdown_label')} <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  {t('projects.detail.changelog.create.markdown_description')}
                </p>
                <Controller
                  control={form.control}
                  name="markdown"
                  render={({ field, fieldState }) => (
                    <div>
                      <TipTapEditor
                        content={field.value}
                        onChange={field.onChange}
                        minHeight="400px"
                      />
                      {fieldState.error && (
                        <p className="text-sm text-red-500 mt-1">
                          {t(fieldState.error.message || '')}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <ControlledCheckbox
                control={form.control}
                name="isPublished"
                label={t('projects.detail.changelog.create.published_label')}
                description={t('projects.detail.changelog.create.published_description')}
              />

              <div className="flex justify-end gap-3 pt-4 ">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                >
                  {t('projects.detail.changelog.create.cancel_button')}
                </Button>
                <Button
                  type="submit"
                  loading={createChangelogMutation.isPending}
                >
                  {t('projects.detail.changelog.create.submit_button')}
                </Button>
              </div>
            </div>
          </form>
        </Paper>
      </div>
    </div>
  );
}
