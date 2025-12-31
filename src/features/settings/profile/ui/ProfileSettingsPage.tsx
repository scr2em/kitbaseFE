import { Card, Loader, Alert, Button, TextInput } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { AlertCircle, User, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { useCurrentUserQuery, useUpdateUserMutation } from '../../../../shared/api/queries/user';
import { useShowBackendError, usePageTitle } from '../../../../shared/hooks';
import { updateProfileSchema, type UpdateProfileFormData } from '../model/schema';
import { ControlledTextInput } from '../../../../shared/controlled-form-fields';

export function ProfileSettingsPage() {
  const { t } = useTranslation();
  usePageTitle(t('settings.profile.page_title'));
  const { data: user, isLoading, isError } = useCurrentUserQuery();
  const updateUserMutation = useUpdateUserMutation();
  const { showError } = useShowBackendError();

  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    values: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    },
  });

  const handleSubmit = async (data: UpdateProfileFormData) => {
    try {
      await updateUserMutation.mutateAsync(data);
      notifications.show({
        title: t('common.success'),
        message: t('settings.profile.success_message'),
        color: 'green',
      });
    } catch (error) {
      showError(error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <Alert
          icon={<AlertCircle size={16} />}
          title={t('common.error')}
          color="red"
        >
          {t('settings.profile.error_loading')}
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {t('settings.profile.title')}
          </h1>
          <p className="text-lg text-gray-500">
            {t('settings.profile.subtitle')}
          </p>
        </div>

        <Card withBorder p="xl" radius="md">
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-6">
              {/* Avatar/Icon section */}
              <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <User size={32} className="text-white" />
                </div>
                <div>
                  <p className="text-xl font-semibold">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ControlledTextInput
                  control={form.control}
                  name="firstName"
                  label={t('settings.profile.first_name_label')}
                  placeholder={t('settings.profile.first_name_placeholder')}
                  required
                />

                <ControlledTextInput
                  control={form.control}
                  name="lastName"
                  label={t('settings.profile.last_name_label')}
                  placeholder={t('settings.profile.last_name_placeholder')}
                  required
                />
              </div>

              {/* Email (disabled) */}
              <TextInput
                label={t('settings.profile.email_label')}
                value={user?.email || ''}
                disabled
                description={t('settings.profile.email_description')}
              />

              {/* Submit button */}
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <Button
                  type="submit"
                  loading={updateUserMutation.isPending}
                  leftSection={<Save size={18} />}
                  variant="gradient"
                  gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
                >
                  {t('settings.profile.submit_button')}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}





