import { Modal, Button, Textarea, Select } from '@mantine/core';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { notifications } from '@mantine/notifications';
import { useCreateFeatureFlagMutation } from '../../../shared/api/queries/feature-flags';
import { useShowBackendError } from '../../../shared/hooks';
import { ControlledTextInput } from '../../../shared/controlled-form-fields';
import {
  createFeatureFlagSchema,
  type CreateFeatureFlagFormData,
  featureFlagValueTypes,
} from '../model/schema';
import { FlagValueInput } from './FlagValueInput';

interface CreateFeatureFlagModalProps {
  opened: boolean;
  onClose: () => void;
  projectKey: string;
  environmentId: string;
}

export function CreateFeatureFlagModal({
  opened,
  onClose,
  projectKey,
  environmentId,
}: CreateFeatureFlagModalProps) {
  const { t } = useTranslation();
  const createMutation = useCreateFeatureFlagMutation(projectKey, environmentId);
  const { showError } = useShowBackendError();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateFeatureFlagFormData>({
    resolver: zodResolver(createFeatureFlagSchema),
    defaultValues: {
      flagKey: '',
      name: '',
      description: '',
      valueType: 'boolean',
      defaultEnabled: false,
      defaultValue: false,
    },
  });

  const valueType = watch('valueType');

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: CreateFeatureFlagFormData) => {
    try {
      await createMutation.mutateAsync({
        flagKey: data.flagKey,
        name: data.name,
        description: data.description || undefined,
        valueType: data.valueType,
        defaultEnabled: data.defaultEnabled,
        defaultValue: data.defaultValue,
      });
      notifications.show({
        title: t('common.success'),
        message: t('feature_flags.create.success_message'),
        color: 'green',
      });
      handleClose();
    } catch (error) {
      showError(error);
    }
  };

  const valueTypeOptions = featureFlagValueTypes.map((type) => ({
    value: type,
    label: t(`feature_flags.value_types.${type}`),
  }));

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={t('feature_flags.create.title')}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <ControlledTextInput
          name="flagKey"
          control={control}
          label={t('feature_flags.form.flag_key_label')}
          placeholder={t('feature_flags.form.flag_key_placeholder')}
          description={t('feature_flags.form.flag_key_description')}
          error={errors.flagKey?.message ? t(errors.flagKey.message) : undefined}
          required
        />

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
          name="valueType"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label={t('feature_flags.form.value_type_label')}
              placeholder={t('feature_flags.form.value_type_placeholder')}
              data={valueTypeOptions}
              error={errors.valueType?.message ? t(errors.valueType.message) : undefined}
              required
            />
          )}
        />

        <Controller
          name="defaultValue"
          control={control}
          render={({ field }) => (
            <FlagValueInput
              value={field.value}
              onChange={field.onChange}
              valueType={valueType}
              label={t('feature_flags.form.default_value_label')}
            />
          )}
        />

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="subtle" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" loading={createMutation.isPending}>
            {t('feature_flags.create.submit_button')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
