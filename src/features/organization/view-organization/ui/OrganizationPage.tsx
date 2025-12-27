import {
  Card,
  Loader,
  Alert,
  Button,
  Paper,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Building, Calendar, Edit } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import {
  useGetOrganizationQuery,
  useUpdateOrganizationMutation,
} from '../../../../shared/api/queries/organization';
import { useShowBackendError, usePermissions, useCurrentOrganization, usePageTitle } from '../../../../shared/hooks';
import { updateOrganizationSchema, type UpdateOrganizationFormData } from '../model/schema';
import { ControlledTextInput, ControlledTextArea } from '../../../../shared/controlled-form-fields';

export function OrganizationPage() {
  const { t } = useTranslation();
  usePageTitle(t('organization.view.page_title'));
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const { currentOrganization, isLoading: isLoadingUser } = useCurrentOrganization();
  const { data: organization, isLoading, isError } = useGetOrganizationQuery();
  const updateOrganizationMutation = useUpdateOrganizationMutation();
  const { showError } = useShowBackendError();
  const { canUpdateOrganization } = usePermissions();

  const form = useForm<UpdateOrganizationFormData>({
    resolver: zodResolver(updateOrganizationSchema),
    values: {
      name: organization?.name || '',
      description: organization?.description || '',
    },
  });

  const handleSubmit = async (data: UpdateOrganizationFormData) => {
    try {
      await updateOrganizationMutation.mutateAsync(data);
      notifications.show({
        title: t('common.success'),
        message: t('organization.edit.success_message'),
        color: 'green',
      });
      setIsEditing(false);
    } catch (error) {
      showError(error);
    }
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  if (isLoadingUser || isLoading) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!currentOrganization) {
    return (
      <div>
        <div className="flex flex-col gap-4">
          <Alert
            icon={<AlertCircle size={16} />}
            title={t('organization.no_organization_title')}
            color="yellow"
          >
            {t('organization.no_organization_message')}
          </Alert>
          <Button
            leftSection={<Building size={16} />}
            variant="light"
            size="md"
            onClick={() => navigate('/create-organization')}
            className="self-start"
          >
            {t('dashboard.create_organization')}
          </Button>
        </div>
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
          {t('organization.error_loading')}
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {t('organization.view.title')}
            </h1>
            <p className="text-lg text-gray-500">
              {t('organization.view.subtitle')}
            </p>
          </div>
          {!isEditing && canUpdateOrganization && (
            <Button
              leftSection={<Edit size={18} />}
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
              onClick={() => setIsEditing(true)}
            >
              {t('organization.edit.edit_button')}
            </Button>
          )}
        </div>

        <Card withBorder p="xl" radius="md">
          {isEditing && canUpdateOrganization ? (
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="flex flex-col gap-6">
                <ControlledTextInput
                  control={form.control}
                  name="name"
                  label={t('organization.edit.name_label')}
                  placeholder={t('organization.edit.name_placeholder')}
                  required
                />
                
                <ControlledTextArea
                  control={form.control}
                  name="description"
                  label={t('organization.edit.description_label')}
                  placeholder={t('organization.edit.description_placeholder')}
                  minRows={4}
                  autosize
                />

                <div className="flex justify-end gap-4">
                  <Button
                    variant="subtle"
                    onClick={handleCancel}
                    disabled={updateOrganizationMutation.isPending}
                  >
                    {t('organization.edit.cancel_button')}
                  </Button>
                  <Button
                    type="submit"
                    loading={updateOrganizationMutation.isPending}
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
                  >
                    {t('organization.edit.submit_button')}
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-8">
              <Paper withBorder p="lg" radius="md">
                <div className="flex flex-col gap-4">
                  <div className="flex gap-3 items-center">
                    <Building size={24} strokeWidth={2} color="var(--mantine-color-blue-6)" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">
                        {t('organization.view.name_label')}
                      </p>
                      <p className="text-xl font-semibold">
                        {organization?.name}
                      </p>
                    </div>
                  </div>
                </div>
              </Paper>

              {organization?.description && (
                <Paper withBorder p="lg" radius="md">
                  <p className="text-sm text-gray-500 mb-3">
                    {t('organization.view.description_label')}
                  </p>
                  <p>
                    {organization.description}
                  </p>
                </Paper>
              )}

              <Paper withBorder p="lg" radius="md">
                <div className="flex gap-8">
                  <div>
                    <div className="flex gap-2 items-center mb-1">
                      <Calendar size={16} className="text-gray-400" />
                      <p className="text-sm text-gray-500">
                        {t('organization.view.created_at')}
                      </p>
                    </div>
                    <p className="font-medium">
                      {new Date(organization?.createdAt || '').toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  {organization?.updatedAt && (
                    <div>
                      <div className="flex gap-2 items-center mb-1">
                        <Calendar size={16} className="text-gray-400" />
                        <p className="text-sm text-gray-500">
                          {t('organization.view.updated_at')}
                        </p>
                      </div>
                      <p className="font-medium">
                        {new Date(organization.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </Paper>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
