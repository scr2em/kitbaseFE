import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Building2, Globe } from 'lucide-react';
import { createOrganizationSchema, type CreateOrganizationFormData } from '../model/schema';
import { useCreateOrganizationMutation } from '../../../../shared/api/queries';
import { ControlledTextInput } from '../../../../shared/controlled-form-fields/ControlledTextInput';

export function CreateOrganizationForm() {
  const { t } = useTranslation();
  const createOrgMutation = useCreateOrganizationMutation();

  const {
    control,
    handleSubmit,
  } = useForm<CreateOrganizationFormData>({
    resolver: zodResolver(createOrganizationSchema),
  });

  const onSubmit = async (data: CreateOrganizationFormData) => {
    try {
      await createOrgMutation.mutateAsync(data);
      
      notifications.show({
        title: t('common.success'),
        message: t('organization.create.success_message'),
        color: 'green',
      });

      const url = `http://${data.subdomain}.${import.meta.env.VITE_APP_DOMAIN}/dashboard`;

      window.open(url, '_self');

    } catch (error: any) {
      notifications.show({
        title: t('common.error'),
        message: error.response?.data?.message || t('organization.create.error_generic'),
        color: 'red',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <ControlledTextInput
          control={control}
          name="name"
          label={t('organization.create.name_label')}
          placeholder={t('organization.create.name_placeholder')}
          leftSection={<Building2 size={18} />}
          size="md"
        />

        <ControlledTextInput
          control={control}
          name="subdomain"
          label={t('organization.create.subdomain_label')}
          placeholder={t('organization.create.subdomain_placeholder')}
          leftSection={<Globe size={18} />}
          size="md"
        />
        
        <p className="text-sm text-gray-500">
          {t('organization.create.subdomain_help')}
        </p>

        <Button
          type="submit"
          fullWidth
          size="md"
          loading={createOrgMutation.isPending}
          variant="gradient"
          gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
        >
          {t('organization.create.submit_button')}
        </Button>
      </div>
    </form>
  );
}
