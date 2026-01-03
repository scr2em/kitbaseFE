import { Modal, Button, Textarea, TextInput, Select, ActionIcon, Card } from '@mantine/core';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { notifications } from '@mantine/notifications';
import { Plus, Trash2 } from 'lucide-react';
import { useCreateFeatureFlagSegmentMutation } from '../../../shared/api/queries/feature-flag-segments';
import { useShowBackendError } from '../../../shared/hooks';
import { ControlledTextInput } from '../../../shared/controlled-form-fields';
import {
  createSegmentSchema,
  type CreateSegmentFormData,
  featureFlagOperators,
} from '../model/schema';

interface CreateSegmentModalProps {
  opened: boolean;
  onClose: () => void;
  projectKey: string;
  environmentId: string;
}

export function CreateSegmentModal({
  opened,
  onClose,
  projectKey,
  environmentId,
}: CreateSegmentModalProps) {
  const { t } = useTranslation();
  const createMutation = useCreateFeatureFlagSegmentMutation(projectKey, environmentId);
  const { showError } = useShowBackendError();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateSegmentFormData>({
    resolver: zodResolver(createSegmentSchema),
    defaultValues: {
      name: '',
      description: '',
      rules: [{ field: '', operator: 'eq', value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'rules',
  });

  const operatorOptions = featureFlagOperators.map((op) => ({
    value: op,
    label: t(`feature_flags.operators.${op}`),
  }));

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: CreateSegmentFormData) => {
    try {
      await createMutation.mutateAsync({
        name: data.name,
        description: data.description || undefined,
        rules: data.rules.map((rule) => ({
          field: rule.field,
          operator: rule.operator,
          value: rule.value || undefined,
        })),
      });
      notifications.show({
        title: t('common.success'),
        message: t('feature_flags.segments.create.success_message'),
        color: 'green',
      });
      handleClose();
    } catch (error) {
      showError(error);
    }
  };

  const handleAddRule = () => {
    append({ field: '', operator: 'eq', value: '' });
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={t('feature_flags.segments.create.title')}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <ControlledTextInput
          name="name"
          control={control}
          label={t('feature_flags.segments.form.name_label')}
          placeholder={t('feature_flags.segments.form.name_placeholder')}
          error={errors.name?.message ? t(errors.name.message) : undefined}
          required
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              label={t('feature_flags.segments.form.description_label')}
              placeholder={t('feature_flags.segments.form.description_placeholder')}
              error={errors.description?.message ? t(errors.description.message) : undefined}
              rows={2}
            />
          )}
        />

        {/* Rules Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              {t('feature_flags.segments.form.rules_label')} *
            </label>
            <Button
              type="button"
              size="xs"
              variant="light"
              leftSection={<Plus size={14} />}
              onClick={handleAddRule}
            >
              {t('feature_flags.segments.form.add_rule')}
            </Button>
          </div>

          {errors.rules?.message && (
            <p className="text-xs text-red-500">{t(errors.rules.message)}</p>
          )}

          <div className="flex flex-col gap-2">
            {fields.map((field, index) => (
              <Card key={field.id} withBorder p="sm" radius="md">
                <div className="flex items-start gap-2">
                  <div className="flex-1 grid grid-cols-3 gap-2">
                    <Controller
                      name={`rules.${index}.field`}
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          placeholder={t('feature_flags.segments.form.field_placeholder')}
                          size="xs"
                          error={
                            errors.rules?.[index]?.field?.message
                              ? t(errors.rules[index].field.message)
                              : undefined
                          }
                        />
                      )}
                    />

                    <Controller
                      name={`rules.${index}.operator`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          data={operatorOptions}
                          size="xs"
                          error={
                            errors.rules?.[index]?.operator?.message
                              ? t(errors.rules[index].operator.message)
                              : undefined
                          }
                        />
                      )}
                    />

                    <Controller
                      name={`rules.${index}.value`}
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          placeholder={t('feature_flags.segments.form.value_placeholder')}
                          size="xs"
                          error={
                            errors.rules?.[index]?.value?.message
                              ? t(errors.rules[index].value.message)
                              : undefined
                          }
                        />
                      )}
                    />
                  </div>

                  <ActionIcon
                    variant="subtle"
                    color="red"
                    size="sm"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 size={14} />
                  </ActionIcon>
                </div>
              </Card>
            ))}
          </div>

          <p className="text-xs text-slate-500">
            {t('feature_flags.segments.form.rules_hint')}
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="subtle" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" loading={createMutation.isPending}>
            {t('feature_flags.segments.create.submit_button')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
