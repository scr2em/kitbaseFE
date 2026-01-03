import { Modal, Button, Textarea } from '@mantine/core';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { notifications } from '@mantine/notifications';
import { useUpdateFeatureFlagMutation } from '../../../shared/api/queries/feature-flags';
import { useShowBackendError } from '../../../shared/hooks';
import { ControlledTextInput } from '../../../shared/controlled-form-fields';
import {
  updateFeatureFlagSchema,
  type UpdateFeatureFlagFormData,
} from '../model/schema';
import { FlagValueInput } from './FlagValueInput';
import type { FeatureFlagResponse } from '../../../generated-api';

interface UpdateFeatureFlagModalProps {
  opened: boolean;
  onClose: () => void;
  projectKey: string;
  environmentId: string;
  flag: FeatureFlagResponse;
}

export function UpdateFeatureFlagModal({
  opened,
  onClose,
  projectKey,
  environmentId,
  flag,
}: UpdateFeatureFlagModalProps) {
  const { t } = useTranslation();
  const updateMutation = useUpdateFeatureFlagMutation(projectKey, environmentId, flag.flagKey);
  const { showError } = useShowBackendError();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateFeatureFlagFormData>({
    resolver: zodResolver(updateFeatureFlagSchema),
    defaultValues: {
      name: flag.name,
      description: flag.description || '',
      enabled: flag.enabled,
      value: flag.value,
    },
  });

  const handleClose = () => {
    reset({
      name: flag.name,
      description: flag.description || '',
      enabled: flag.enabled,
      value: flag.value,
    });
    onClose();
  };

  const onSubmit = async (data: UpdateFeatureFlagFormData) => {
    try {
      await updateMutation.mutateAsync({
        name: data.name,
        description: data.description || undefined,
        enabled: data.enabled,
        value: data.value,
      });
      notifications.show({
        title: t('common.success'),
        message: t('feature_flags.update.success_message'),
        color: 'green',
      });
      handleClose();
    } catch (error) {
      showError(error);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={t('feature_flags.update.title')}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="bg-slate-50 rounded-md p-3 mb-2">
          <p className="text-xs text-slate-500 mb-1">{t('feature_flags.form.flag_key_label')}</p>
          <code className="text-sm font-medium">{flag.flagKey}</code>
        </div>

        <ControlledTextInput
          name="name"
          control={control}
          label={t('feature_flags.form.name_label')}
          placeholder={t('feature_flags.form.name_placeholder')}
          error={errors.name?.message ? t(errors.name.message) : undefined}
          required
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              label={t('feature_flags.form.description_label')}
              placeholder={t('feature_flags.form.description_placeholder')}
              error={errors.description?.message ? t(errors.description.message) : undefined}
              rows={3}
            />
          )}
        />

        <Controller
          name="value"
          control={control}
          render={({ field }) => (
            <FlagValueInput
              value={field.value}
              onChange={field.onChange}
              valueType={flag.valueType}
              label={t('feature_flags.form.value_label')}
            />
          )}
        />

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="subtle" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" loading={updateMutation.isPending}>
            {t('feature_flags.update.submit_button')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
