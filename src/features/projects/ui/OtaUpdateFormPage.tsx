import { Card, Button, Loader, Alert, Divider } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, AlertCircle, Info, Package, Settings } from 'lucide-react';
import { ControlledTextInput, ControlledSelect } from '../../../shared/controlled-form-fields';
import { useShowBackendError } from '../../../shared/hooks';
import { 
  useCreateOtaUpdateMutation, 
  useUpdateOtaUpdateMutation,
  useOtaUpdateQuery,
} from '../../../shared/api/queries/ota-updates';
import { useBuildsQuery } from '../../../shared/api/queries/builds';
import { useEnvironmentsInfiniteQuery } from '../../../shared/api/queries/environments';
import { createOtaUpdateSchema, type CreateOtaUpdateFormData } from '../model/ota-update-schema';
import { TargetingConditionsBuilder } from './TargetingConditionsBuilder';

export function OtaUpdateFormPage() {
  const { t } = useTranslation();
  const { projectKey, otaUpdateId } = useParams<{ projectKey: string; otaUpdateId?: string }>();
  const navigate = useNavigate();
  const { showError } = useShowBackendError();

  const isEditMode = !!otaUpdateId;

  // Fetch existing OTA update data if editing
  const { data: existingOtaUpdate, isLoading: isLoadingOtaUpdate } = useOtaUpdateQuery(
    projectKey || '', 
    otaUpdateId || ''
  );

  const createMutation = useCreateOtaUpdateMutation(projectKey || '');
  const updateMutation = useUpdateOtaUpdateMutation(projectKey || '', otaUpdateId || '');

  const { data: buildsData, isLoading: isLoadingBuilds } = useBuildsQuery(projectKey || '', 0, 100, 'desc');
  const { data: environmentsData, isLoading: isLoadingEnvironments } = useEnvironmentsInfiniteQuery(projectKey || '');

  const { control, handleSubmit, reset } = useForm<CreateOtaUpdateFormData>({
    resolver: zodResolver(createOtaUpdateSchema),
    defaultValues: {
      name: '',
      version: '',
      buildId: '',
      environmentId: '',
      minNativeVersion: '',
      updateMode: 'silent',
      targetPlatform: 'both',
      targetingConditions: undefined,
    },
    values: isEditMode && existingOtaUpdate ? {
      name: existingOtaUpdate.name,
      version: existingOtaUpdate.version,
      buildId: existingOtaUpdate.buildId,
      environmentId: existingOtaUpdate.environmentId,
      minNativeVersion: existingOtaUpdate.minNativeVersion,
      updateMode: existingOtaUpdate.updateMode,
      targetPlatform: existingOtaUpdate.targetPlatform,
      targetingConditions: existingOtaUpdate.targetingConditions,
    } : undefined,
  });

  const onSubmit = async (data: CreateOtaUpdateFormData) => {
    try {
      const submitData = {
        ...data,
        targetingConditions: data.targetingConditions?.conditions?.length 
          ? data.targetingConditions 
          : undefined,
      };

      if (isEditMode) {
        await updateMutation.mutateAsync(submitData);
        notifications.show({
          title: t('common.success'),
          message: t('ota_updates.edit.success_message'),
          color: 'green',
        });
      } else {
        await createMutation.mutateAsync(submitData);
        notifications.show({
          title: t('common.success'),
          message: t('ota_updates.create.success_message'),
          color: 'green',
        });
      }
      
      reset();
      navigate(`/projects/${projectKey}/ota-updates`);
    } catch (error) {
      showError(error);
    }
  };

  const handleBack = () => {
    navigate(`/projects/${projectKey}/ota-updates`);
  };

  const buildOptions = buildsData?.data?.map((build) => ({
    value: build.id,
    label: `${build.commitHash.substring(0, 7)} - ${build.branchName} (v${build.nativeVersion})`,
  })) || [];

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

  const isLoading = isLoadingBuilds || isLoadingEnvironments || (isEditMode && isLoadingOtaUpdate);

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (buildOptions.length === 0) {
    return (
      <div>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          {t('ota_updates.form.back_button')}
        </button>
        <Alert icon={<AlertCircle size={16} />} title={t('ota_updates.form.no_builds_title')} color="yellow">
          {t('ota_updates.form.no_builds_message')}
        </Alert>
      </div>
    );
  }

  if (environmentOptions.length === 0) {
    return (
      <div>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          {t('ota_updates.form.back_button')}
        </button>
        <Alert icon={<AlertCircle size={16} />} title={t('ota_updates.form.no_environments_title')} color="yellow">
          {t('ota_updates.form.no_environments_message')}
        </Alert>
      </div>
    );
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        {t('ota_updates.form.back_button')}
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          {isEditMode ? t('ota_updates.edit.page_title') : t('ota_updates.create.page_title')}
        </h1>
        <p className="text-slate-500">
          {isEditMode ? t('ota_updates.edit.page_subtitle') : t('ota_updates.create.page_subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Basic Information Section */}
        <Card withBorder padding="xl" radius="md" className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Info size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                {t('ota_updates.form.section_basic')}
              </h2>
              <p className="text-sm text-slate-500">
                {t('ota_updates.form.section_basic_description')}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <ControlledTextInput
              control={control}
              name="name"
              label={t('ota_updates.form.name_label')}
              placeholder={t('ota_updates.form.name_placeholder')}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ControlledTextInput
                control={control}
                name="version"
                label={t('ota_updates.form.version_label')}
                placeholder={t('ota_updates.form.version_placeholder')}
                description={t('ota_updates.form.version_description')}
                required
              />

              <ControlledTextInput
                control={control}
                name="minNativeVersion"
                label={t('ota_updates.form.min_version_label')}
                placeholder={t('ota_updates.form.min_version_placeholder')}
                description={t('ota_updates.form.min_version_description')}
                required
              />
            </div>
          </div>
        </Card>

        {/* Build & Environment Section */}
        <Card withBorder padding="xl" radius="md" className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Package size={20} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                {t('ota_updates.form.section_source')}
              </h2>
              <p className="text-sm text-slate-500">
                {t('ota_updates.form.section_source_description')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ControlledSelect
              control={control}
              name="buildId"
              label={t('ota_updates.form.build_label')}
              placeholder={t('ota_updates.form.build_placeholder')}
              options={buildOptions}
              searchable
              required
            />

            <ControlledSelect
              control={control}
              name="environmentId"
              label={t('ota_updates.form.environment_label')}
              placeholder={t('ota_updates.form.environment_placeholder')}
              options={environmentOptions}
              required
            />
          </div>
        </Card>

        {/* Delivery Settings Section */}
        <Card withBorder padding="xl" radius="md" className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
              <Settings size={20} className="text-violet-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                {t('ota_updates.form.section_delivery')}
              </h2>
              <p className="text-sm text-slate-500">
                {t('ota_updates.form.section_delivery_description')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <ControlledSelect
              control={control}
              name="targetPlatform"
              label={t('ota_updates.form.platform_label')}
              placeholder={t('ota_updates.form.platform_placeholder')}
              options={platformOptions}
              required
            />

            <ControlledSelect
              control={control}
              name="updateMode"
              label={t('ota_updates.form.update_mode_label')}
              placeholder={t('ota_updates.form.update_mode_placeholder')}
              options={updateModeOptions}
              required
            />
          </div>

          <Divider className="my-6" />

          {/* Targeting Conditions */}
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
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="subtle" size="md" onClick={handleBack}>
            {t('ota_updates.form.cancel_button')}
          </Button>
          <Button type="submit" size="md" loading={isPending}>
            {isEditMode ? t('ota_updates.form.update_button') : t('ota_updates.form.create_button')}
          </Button>
        </div>
      </form>
    </div>
  );
}

