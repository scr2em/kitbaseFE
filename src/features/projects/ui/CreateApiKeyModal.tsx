import { Modal, Button } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { createApiKeySchema, type CreateApiKeyFormData } from '../model/api-key-schema';
import { ControlledTextInput } from '../../../shared/controlled-form-fields';

interface CreateApiKeyModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  isLoading: boolean;
}

export function CreateApiKeyModal({ opened, onClose, onSubmit, isLoading }: CreateApiKeyModalProps) {
  const { t } = useTranslation();

  const form = useForm<CreateApiKeyFormData>({
    resolver: zodResolver(createApiKeySchema),
    defaultValues: {
      name: '',
    },
  });

  const handleSubmit = (data: CreateApiKeyFormData) => {
    onSubmit(data.name);
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



