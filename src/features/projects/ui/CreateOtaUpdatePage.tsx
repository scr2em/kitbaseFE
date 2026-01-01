import { Card, Button, Loader, Alert } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { ControlledTextInput, ControlledSelect } from '../../../shared/controlled-form-fields';
import { useShowBackendError } from '../../../shared/hooks';
import { useCreateOtaUpdateMutation } from '../../../shared/api/queries/ota-updates';
import { useBuildsQuery } from '../../../shared/api/queries/builds';
import { useEnvironmentsInfiniteQuery } from '../../../shared/api/queries/environments';
import { createOtaUpdateSchema, type CreateOtaUpdateFormData } from '../model/ota-update-schema';
import { TargetingConditionsBuilder } from './TargetingConditionsBuilder';

export function CreateOtaUpdatePage() {
  const { t } = useTranslation();
  const { projectKey } = useParams<{ projectKey: string }>();
  const navigate = useNavigate();
  const createMutation = useCreateOtaUpdateMutation(projectKey || '');
  const { showError } = useShowBackendError();

  // Fetch builds for the select dropdown
  const { data: buildsData, isLoading: isLoadingBuilds } = useBuildsQuery(projectKey || '', 0, 100, 'desc');
  
  // Fetch environments for the select dropdown
  const { data: environmentsData, isLoading: isLoadingEnvironments } = useEnvironmentsInfiniteQuery(projectKey || '');

  const { control, handleSubmit, reset } = useForm<CreateOtaUpdateFormData>({
    resolver: zodResolver(createOtaUpdateSchema),
    defaultValues: {
      name: '',
      version: '',
      buildId: '',
      environmentId: '',
      minNativeVersion: '',
      updateMode: undefined,
      targetPlatform: undefined,
      targetingConditions: undefined,
    },
  });

  const onSubmit = async (data: CreateOtaUpdateFormData) => {
    try {
      // Clean up targeting conditions - only send if there are valid conditions
      const submitData = {
        ...data,
        targetingConditions: data.targetingConditions?.conditions?.length 
          ? data.targetingConditions 
          : undefined,
      };
      await createMutation.mutateAsync(submitData);
      notifications.show({
        title: t('common.success'),
        message: t('ota_updates.create.success_message'),
        color: 'green',
      });
      reset();
      navigate(`/projects/${projectKey}/ota-updates`);
    } catch (error) {
      showError(error);
    }
  };

  const handleBack = () => {
    navigate(`/projects/${projectKey}/ota-updates`);
  };

  // Prepare builds select options
  const buildOptions = buildsData?.data?.map((build) => ({
    value: build.id,
    label: `${build.commitHash.substring(0, 7)} - ${build.branchName} (v${build.nativeVersion})`,
  })) || [];

  // Prepare environments select options
  const environments = environmentsData?.pages.flatMap((page) => page.data) || [];
  const environmentOptions = environments.map((env) => ({
    value: env.id,
    label: env.name,
  }));

  const updateModeOptions = [
    { value: 'force', label: t('ota_updates.update_mode.force') },
    { value: 'silent', label: t('ota_updates.update_mode.silent') },
    { value: 'prompt', label: t('ota_updates.update_mode.prompt') },
  ];

  const platformOptions = [
    { value: 'ios', label: t('ota_updates.platform.ios') },
    { value: 'android', label: t('ota_updates.platform.android') },
    { value: 'both', label: t('ota_updates.platform.both') },
  ];

  if (isLoadingBuilds || isLoadingEnvironments) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (buildOptions.length === 0) {
    return (
      <div>
        <Button
          variant="subtle"
          leftSection={<ArrowLeft size={16} />}
          onClick={handleBack}
          className="mb-4"
        >
          {t('ota_updates.create.back_button')}
        </Button>
        <Alert
          icon={<AlertCircle size={16} />}
          title={t('ota_updates.create.no_builds_title')}
          color="yellow"
        >
          {t('ota_updates.create.no_builds_message')}
        </Alert>
      </div>
    );
  }

  if (environmentOptions.length === 0) {
    return (
      <div>
        <Button
          variant="subtle"
          leftSection={<ArrowLeft size={16} />}
          onClick={handleBack}
          className="mb-4"
        >
          {t('ota_updates.create.back_button')}
        </Button>
        <Alert
          icon={<AlertCircle size={16} />}
          title={t('ota_updates.create.no_environments_title')}
          color="yellow"
        >
          {t('ota_updates.create.no_environments_message')}
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <Button
        variant="subtle"
        leftSection={<ArrowLeft size={16} />}
        onClick={handleBack}
        className="mb-4"
      >
        {t('ota_updates.create.back_button')}
      </Button>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-1">
          {t('ota_updates.create.page_title')}
        </h2>
        <p className="text-sm text-slate-500">
          {t('ota_updates.create.page_subtitle')}
        </p>
      </div>

      <Card withBorder padding="lg" radius="md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ControlledTextInput
                control={control}
                name="name"
                label={t('ota_updates.create.name_label')}
                placeholder={t('ota_updates.create.name_placeholder')}
                required
              />

              <ControlledTextInput
                control={control}
                name="version"
                label={t('ota_updates.create.version_label')}
                placeholder={t('ota_updates.create.version_placeholder')}
                description={t('ota_updates.create.version_description')}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ControlledSelect
                control={control}
                name="buildId"
                label={t('ota_updates.create.build_label')}
                placeholder={t('ota_updates.create.build_placeholder')}
                options={buildOptions}
                searchable
                required
              />

              <ControlledSelect
                control={control}
                name="environmentId"
                label={t('ota_updates.create.environment_label')}
                placeholder={t('ota_updates.create.environment_placeholder')}
                options={environmentOptions}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ControlledTextInput
                control={control}
                name="minNativeVersion"
                label={t('ota_updates.create.min_version_label')}
                placeholder={t('ota_updates.create.min_version_placeholder')}
                description={t('ota_updates.create.min_version_description')}
                required
              />

              <ControlledSelect
                control={control}
                name="updateMode"
                label={t('ota_updates.create.update_mode_label')}
                placeholder={t('ota_updates.create.update_mode_placeholder')}
                options={updateModeOptions}
                required
              />

              <ControlledSelect
                control={control}
                name="targetPlatform"
                label={t('ota_updates.create.platform_label')}
                placeholder={t('ota_updates.create.platform_placeholder')}
                options={platformOptions}
                required
              />
            </div>

            {/* Targeting Conditions */}
            <div className="mt-2">
              <Controller
                control={control}
                name="targetingConditions"
                render={({ field }) => (
                  <TargetingConditionsBuilder
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="subtle" onClick={handleBack}>
                {t('ota_updates.create.cancel_button')}
              </Button>
              <Button type="submit" loading={createMutation.isPending}>
                {t('ota_updates.create.submit_button')}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}

