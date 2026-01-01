import { Modal, Button, Loader } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { ControlledTextInput, ControlledSelect } from '../../../shared/controlled-form-fields';
import { useShowBackendError } from '../../../shared/hooks';
import { useUpdateOtaUpdateMutation } from '../../../shared/api/queries/ota-updates';
import { useBuildsQuery } from '../../../shared/api/queries/builds';
import { useEnvironmentsInfiniteQuery } from '../../../shared/api/queries/environments';
import { updateOtaUpdateSchema, type UpdateOtaUpdateFormData } from '../model/ota-update-schema';
import { TargetingConditionsBuilder } from './TargetingConditionsBuilder';
import type { OtaUpdateResponse } from '../../../generated-api';

interface UpdateOtaUpdateModalProps {
  opened: boolean;
  onClose: () => void;
  projectKey: string;
  otaUpdate: OtaUpdateResponse;
}

export function UpdateOtaUpdateModal({ opened, onClose, projectKey, otaUpdate }: UpdateOtaUpdateModalProps) {
  const { t } = useTranslation();
  const updateMutation = useUpdateOtaUpdateMutation(projectKey, otaUpdate.id);
  const { showError } = useShowBackendError();

  // Fetch builds for the select dropdown
  const { data: buildsData, isLoading: isLoadingBuilds } = useBuildsQuery(projectKey, 0, 100, 'desc');
  
  // Fetch environments for the select dropdown
  const { data: environmentsData, isLoading: isLoadingEnvironments } = useEnvironmentsInfiniteQuery(projectKey);

  const { control, handleSubmit, reset } = useForm<UpdateOtaUpdateFormData>({
    resolver: zodResolver(updateOtaUpdateSchema),
    defaultValues: {
      name: otaUpdate.name,
      version: otaUpdate.version,
      buildId: otaUpdate.buildId,
      environmentId: otaUpdate.environmentId,
      minNativeVersion: otaUpdate.minNativeVersion,
      updateMode: otaUpdate.updateMode,
      targetPlatform: otaUpdate.targetPlatform,
      targetingConditions: otaUpdate.targetingConditions,
    },
  });

  const onSubmit = async (data: UpdateOtaUpdateFormData) => {
    try {
      // Clean up targeting conditions - only send if there are valid conditions
      const submitData = {
        ...data,
        targetingConditions: data.targetingConditions?.conditions?.length 
          ? data.targetingConditions 
          : undefined,
      };
      await updateMutation.mutateAsync(submitData);
      notifications.show({
        title: t('common.success'),
        message: t('ota_updates.update.success_message'),
        color: 'green',
      });
      onClose();
    } catch (error) {
      showError(error);
    }
  };

  const handleClose = () => {
    reset({
      name: otaUpdate.name,
      version: otaUpdate.version,
      buildId: otaUpdate.buildId,
      environmentId: otaUpdate.environmentId,
      minNativeVersion: otaUpdate.minNativeVersion,
      updateMode: otaUpdate.updateMode,
      targetPlatform: otaUpdate.targetPlatform,
      targetingConditions: otaUpdate.targetingConditions,
    });
    onClose();
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

  const isLoading = isLoadingBuilds || isLoadingEnvironments;

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={t('ota_updates.update.modal_title')}
      size="lg"
    >
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader size="lg" />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ControlledTextInput
                control={control}
                name="name"
                label={t('ota_updates.update.name_label')}
                placeholder={t('ota_updates.update.name_placeholder')}
                required
              />

              <ControlledTextInput
                control={control}
                name="version"
                label={t('ota_updates.update.version_label')}
                placeholder={t('ota_updates.update.version_placeholder')}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ControlledSelect
                control={control}
                name="buildId"
                label={t('ota_updates.update.build_label')}
                placeholder={t('ota_updates.update.build_placeholder')}
                options={buildOptions}
                searchable
                required
              />

              <ControlledSelect
                control={control}
                name="environmentId"
                label={t('ota_updates.update.environment_label')}
                placeholder={t('ota_updates.update.environment_placeholder')}
                options={environmentOptions}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ControlledTextInput
                control={control}
                name="minNativeVersion"
                label={t('ota_updates.update.min_version_label')}
                placeholder={t('ota_updates.update.min_version_placeholder')}
                required
              />

              <ControlledSelect
                control={control}
                name="updateMode"
                label={t('ota_updates.update.update_mode_label')}
                placeholder={t('ota_updates.update.update_mode_placeholder')}
                options={updateModeOptions}
                required
              />

              <ControlledSelect
                control={control}
                name="targetPlatform"
                label={t('ota_updates.update.platform_label')}
                placeholder={t('ota_updates.update.platform_placeholder')}
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

            <div className="flex justify-end gap-3 mt-4">
              <Button type="button" variant="subtle" onClick={handleClose}>
                {t('ota_updates.update.cancel_button')}
              </Button>
              <Button type="submit" loading={updateMutation.isPending}>
                {t('ota_updates.update.submit_button')}
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}

