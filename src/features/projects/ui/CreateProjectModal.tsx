import { Modal, Button } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { notifications } from '@mantine/notifications';
import { createProjectSchema, projectTypeOptions, type CreateProjectFormData } from '../model/schema';
import { useCreateProjectMutation } from '../../../shared/api/queries';
import {
  ControlledTextInput,
  ControlledTextArea,
  ControlledSelect,
} from '../../../shared/controlled-form-fields';
import { useShowBackendError } from '../../../shared/hooks';

interface CreateProjectModalProps {
  opened: boolean;
  onClose: () => void;
}

export function CreateProjectModal({ opened, onClose }: CreateProjectModalProps) {
  const { t } = useTranslation();
  const createProjectMutation = useCreateProjectMutation();
  const { showError } = useShowBackendError();

  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      projectKey: '',
      name: '',
      description: '',
      projectType: undefined,
    },
  });

  const handleSubmit = async (data: CreateProjectFormData) => {
    try {
      await createProjectMutation.mutateAsync(data);
      notifications.show({
        title: t('common.success'),
        message: t('projects.create.success_message'),
        color: 'green',
      });
      form.reset();
      onClose();
    } catch (error) {
      showError(error);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t('projects.create.modal_title')}
      size="md"
    >
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex flex-col gap-4">
          <ControlledTextInput
            control={form.control}
            name="name"
            label={t('projects.create.name_label')}
            placeholder={t('projects.create.name_placeholder')}
            required
          />

          <ControlledTextInput
            control={form.control}
            name="projectKey"
            label={t('projects.create.project_key_label')}
            placeholder={t('projects.create.project_key_placeholder')}
            required
          />

          <ControlledTextArea
            control={form.control}
            name="description"
            label={t('projects.create.description_label')}
            placeholder={t('projects.create.description_placeholder')}
            minRows={3}
          />

          <ControlledSelect
            control={form.control}
            name="projectType"
            label={t('projects.create.project_type_label')}
            placeholder={t('projects.create.project_type_placeholder')}
            options={[...projectTypeOptions]}
            required
          />

          <Button
            type="submit"
            loading={createProjectMutation.isPending}
            fullWidth
            mt="md"
          >
            {t('projects.create.submit_button')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}



