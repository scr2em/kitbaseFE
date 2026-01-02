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
import { useUpdateChangelogMutation, useChangelogQuery } from '../../../shared/api/queries/changelog';
import { useProjectQuery } from '../../../shared/api/queries';
import { useShowBackendError } from '../../../shared/hooks';

export function EditChangelogPage() {
  const { t } = useTranslation();
  const { projectKey, environmentId, changelogId } = useParams<{ projectKey: string; environmentId: string; changelogId: string }>();
  const navigate = useNavigate();
  const { showError } = useShowBackendError();
  const updateChangelogMutation = useUpdateChangelogMutation(projectKey || '', changelogId || '');
  
  const { data: project, isLoading: isLoadingProject, isError: isProjectError } = useProjectQuery(projectKey || '');
  const { data: changelog, isLoading: isLoadingChangelog, isError: isChangelogError } = useChangelogQuery(
    projectKey || '',
    changelogId || ''
  );

  const form = useForm<ChangelogFormData>({
    resolver: zodResolver(changelogSchema),
    values: changelog ? {
      version: changelog.version,
      markdown: changelog.markdown,
      isPublished: changelog.isPublished,
    } : undefined,
  });

  const handleSubmit = async (data: ChangelogFormData) => {
    try {
      await updateChangelogMutation.mutateAsync({
        version: data.version,
        markdown: data.markdown,
        isPublished: data.isPublished,
      });

      notifications.show({
        title: t('common.success'),
        message: t('projects.detail.changelog.edit.success_message'),
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

  if (isLoadingProject || isLoadingChangelog) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (isProjectError || !project || isChangelogError || !changelog) {
    return (
      <Alert
        icon={<AlertCircle size={16} />}
        title={t('common.error')}
        color="red"
      >
        {t('projects.detail.changelog.error_loading')}
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
              {t('projects.detail.changelog.edit.back_button')}
            </Button>
            <div>
              <h2 className="text-2xl font-semibold">
                {t('projects.detail.changelog.edit.page_title')}
              </h2>
              <p className="text-sm text-gray-500">{project.name} - v{changelog.version}</p>
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
                label={t('projects.detail.changelog.edit.version_label')}
                placeholder={t('projects.detail.changelog.edit.version_placeholder')}
                description={t('projects.detail.changelog.edit.version_description')}
                required
              />

              <div>
                <label className="block text-sm font-medium mb-1">
                  {t('projects.detail.changelog.edit.markdown_label')} <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  {t('projects.detail.changelog.edit.markdown_description')}
                </p>
                <Controller
                  control={form.control}
                  name="markdown"
                  render={({ field, fieldState }) => (
                    <div>
                      <TipTapEditor
                        key={changelog.id}
                        content={field.value || changelog.markdown}
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
                label={t('projects.detail.changelog.edit.published_label')}
                description={t('projects.detail.changelog.edit.published_description')}
              />

              <div className="flex justify-end gap-3 pt-4 ">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                >
                  {t('projects.detail.changelog.edit.cancel_button')}
                </Button>
                <Button
                  type="submit"
                  loading={updateChangelogMutation.isPending}
                >
                  {t('projects.detail.changelog.edit.submit_button')}
                </Button>
              </div>
            </div>
          </form>
        </Paper>
      </div>
    </div>
  );
}
