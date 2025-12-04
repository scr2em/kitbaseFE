import {
  Box,
  Title,
  Text,
  Stack,
  Card,
  Center,
  Loader,
  Alert,
  Group,
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
import { useShowBackendError, usePermissions, useCurrentOrganization } from '../../../../shared/hooks';
import { updateOrganizationSchema, type UpdateOrganizationFormData } from '../model/schema';
import { ControlledTextInput, ControlledTextArea } from '../../../../shared/controlled-form-fields';

export function OrganizationPage() {
  const { t } = useTranslation();
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
      <Center h="calc(100vh - 120px)">
        <Loader size="lg" />
      </Center>
    );
  }

  if (!currentOrganization) {
    return (
      <Box>
        <Stack gap="md">
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
            style={{ alignSelf: 'flex-start' }}
          >
            {t('dashboard.create_organization')}
          </Button>
        </Stack>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box>
        <Alert
          icon={<AlertCircle size={16} />}
          title={t('common.error')}
          color="red"
        >
          {t('organization.error_loading')}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <Box>
            <Title order={1} mb="xs">
              {t('organization.view.title')}
            </Title>
            <Text c="dimmed" size="lg">
              {t('organization.view.subtitle')}
            </Text>
          </Box>
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
        </Group>

        <Card withBorder   p="xl" radius="md">
          {isEditing && canUpdateOrganization ? (
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <Stack gap="lg">
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

                <Group justify="flex-end" gap="md">
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
                </Group>
              </Stack>
            </form>
          ) : (
            <Stack gap="xl">
              <Paper withBorder p="lg" radius="md">
                <Stack gap="md">
                  <Group gap="sm">
                    <Building size={24} strokeWidth={2} color="var(--mantine-color-blue-6)" />
                    <Box style={{ flex: 1 }}>
                      <Text size="sm" c="dimmed" mb={4}>
                        {t('organization.view.name_label')}
                      </Text>
                      <Text size="xl" fw={600}>
                        {organization?.name}
                      </Text>
                    </Box>
                  </Group>
                </Stack>
              </Paper>

              {organization?.description && (
                <Paper withBorder p="lg" radius="md">
                  <Text size="sm" c="dimmed" mb="sm">
                    {t('organization.view.description_label')}
                  </Text>
                  <Text size="md">
                    {organization.description}
                  </Text>
                </Paper>
              )}

              <Paper withBorder p="lg" radius="md">
                <Group gap="lg">
                  <Box>
                    <Group gap="xs" mb={4}>
                      <Calendar size={16} color="var(--mantine-color-dimmed)" />
                      <Text size="sm" c="dimmed">
                        {t('organization.view.created_at')}
                      </Text>
                    </Group>
                    <Text size="md" fw={500}>
                      {new Date(organization?.createdAt || '').toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Text>
                  </Box>
                  {organization?.updatedAt && (
                    <Box>
                      <Group gap="xs" mb={4}>
                        <Calendar size={16} color="var(--mantine-color-dimmed)" />
                        <Text size="sm" c="dimmed">
                          {t('organization.view.updated_at')}
                        </Text>
                      </Group>
                      <Text size="md" fw={500}>
                        {new Date(organization.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Text>
                    </Box>
                  )}
                </Group>
              </Paper>
            </Stack>
          )}
        </Card>
      </Stack>
    </Box>
  );
}

