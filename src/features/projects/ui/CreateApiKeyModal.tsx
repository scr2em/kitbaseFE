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
  onSubmit: (name: string, environmentName: string) => void;
  isLoading: boolean;
  projectKey: string;
}

export function CreateApiKeyModal({ opened, onClose, onSubmit, isLoading, projectKey }: CreateApiKeyModalProps) {
  const { t } = useTranslation();
  const { data: environmentsData, isLoading: isLoadingEnvironments } = useEnvironmentsInfiniteQuery(projectKey);

  const environments = environmentsData?.pages.flatMap((page) => page.data) || [];
  const environmentOptions = environments.map((env) => ({
    value: env.name,
    label: env.name,
  }));

  const form = useForm<CreateApiKeyFormData>({
    resolver: zodResolver(createApiKeySchema),
    defaultValues: {
      name: '',
      environmentName: '',
    },
  });

  const handleSubmit = (data: CreateApiKeyFormData) => {
    onSubmit(data.name, data.environmentName);
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
            name="environmentName"
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










