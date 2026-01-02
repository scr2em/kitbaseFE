import { Modal, Button } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { createApiKeySchema, type CreateApiKeyFormData } from '../model/api-key-schema';
import { ControlledTextInput, ControlledSelect } from '../../../shared/controlled-form-fields';
import { useEnvironmentsInfiniteQuery } from '../../../shared/api/queries/environments';

interface CreateApiKeyModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (name: string, environmentId: string) => void;
  isLoading: boolean;
  projectKey: string;
  defaultEnvironmentId?: string;
}

export function CreateApiKeyModal({ opened, onClose, onSubmit, isLoading, projectKey, defaultEnvironmentId }: CreateApiKeyModalProps) {
  const { t } = useTranslation();
  const { data: environmentsData, isLoading: isLoadingEnvironments } = useEnvironmentsInfiniteQuery(projectKey);

  const environments = environmentsData?.pages.flatMap((page) => page.data) || [];
  const environmentOptions = environments.map((env) => ({
    value: env.id,
    label: env.name,
  }));

  const form = useForm<CreateApiKeyFormData>({
    resolver: zodResolver(createApiKeySchema),
    defaultValues: {
      name: '',
      environmentId: defaultEnvironmentId || '',
    },
  });

  const handleSubmit = (data: CreateApiKeyFormData) => {
    onSubmit(data.name, data.environmentId);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={t('projects.detail.api_keys.create.modal_title')}
      size="md"
    >
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex flex-col gap-4">
          <ControlledTextInput
            control={form.control}
            name="name"
            label={t('projects.detail.api_keys.create.name_label')}
            placeholder={t('projects.detail.api_keys.create.name_placeholder')}
            required
          />

          <ControlledSelect
            control={form.control}
            name="environmentId"
            label={t('projects.detail.api_keys.create.environment_label')}
            placeholder={t('projects.detail.api_keys.create.environment_placeholder')}
            options={environmentOptions}
            disabled={isLoadingEnvironments}
            required
            searchable
          />

          <Button
            type="submit"
            loading={isLoading}
            fullWidth
            mt="md"
          >
            {t('projects.detail.api_keys.create.submit_button')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}










