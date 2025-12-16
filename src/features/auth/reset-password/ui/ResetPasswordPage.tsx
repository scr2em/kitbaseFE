import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Paper, Title, Text, Stack, Box, Group, ThemeIcon, PasswordInput, Button, Anchor, Alert } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Plane, Lock, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import { resetPasswordSchema, type ResetPasswordFormData } from '../model/schema';
import { useResetPasswordMutation } from '../../../../shared/api/queries/auth';

export function ResetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [resetSuccess, setResetSuccess] = useState(false);
  const resetPasswordMutation = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;
    
    try {
      await resetPasswordMutation.mutateAsync({
        token,
        newPassword: data.newPassword,
      });
      setResetSuccess(true);
    } catch (error: any) {
      const errorCode = error.response?.data?.error?.code;
      let errorMessage = t('auth.reset_password.reset.error_generic');
      
      if (errorCode === 'AUTH_007') {
        errorMessage = t('auth.reset_password.errors.invalid_token');
      } else if (errorCode === 'AUTH_008') {
        errorMessage = t('auth.reset_password.errors.token_used');
      } else if (errorCode === 'AUTH_009') {
        errorMessage = t('auth.reset_password.errors.weak_password');
      }
      
      notifications.show({
        title: t('common.error'),
        message: errorMessage,
        color: 'red',
      });
    }
  };

  // No token provided
  if (!token) {
    return (
      <Box
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        p="md"
      >
        <Box w="100%" maw="460px">
          <Stack gap="xl">
            <Group justify="center">
              <ThemeIcon
                size={60}
                radius="xl"
                variant="gradient"
              >
                <Plane size={36} />
              </ThemeIcon>
            </Group>

            <Paper
              withBorder
              shadow="xl"
              p="xl"
              radius="lg"
              bg="white"
            >
              <Stack gap="md" align="center">
                <ThemeIcon
                  size={60}
                  radius="xl"
                  color="red"
                  variant="light"
                >
                  <AlertTriangle size={32} />
                </ThemeIcon>
                <Title order={2} ta="center">
                  {t('auth.reset_password.errors.title')}
                </Title>
                <Text c="dimmed" size="sm" ta="center">
                  {t('auth.reset_password.errors.invalid_link')}
                </Text>
                <Button
                  variant="subtle"
                  leftSection={<ArrowLeft size={16} />}
                  onClick={() => navigate('/forgot-password')}
                >
                  {t('auth.reset_password.reset.request_new_link')}
                </Button>
              </Stack>
            </Paper>
          </Stack>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      p="md"
    >
      <Box w="100%" maw="460px">
        <Stack gap="xl">
          {/* Logo/Brand */}
          <Group justify="center">
            <ThemeIcon
              size={60}
              radius="xl"
              variant="gradient"
            >
              <Plane size={36} />
            </ThemeIcon>
          </Group>

          <Box ta="center">
            <Title
              order={1}
              c="white"
              mb="xs"
            >
              Flyway
            </Title>
            <Text size="lg" c="white" style={{ opacity: 0.9 }}>
              {t('auth.reset_password.reset.tagline')}
            </Text>
          </Box>

          <Paper
            withBorder
            shadow="xl"
            p="xl"
            radius="lg"
            bg="white"
          >
            {resetSuccess ? (
              <Stack gap="md" align="center">
                <ThemeIcon
                  size={60}
                  radius="xl"
                  color="green"
                  variant="light"
                >
                  <CheckCircle size={32} />
                </ThemeIcon>
                <Title order={2} ta="center">
                  {t('auth.reset_password.reset.success_title')}
                </Title>
                <Text c="dimmed" size="sm" ta="center">
                  {t('auth.reset_password.reset.success_message')}
                </Text>
                <Button
                  fullWidth
                  variant="gradient"
                  onClick={() => navigate('/login')}
                >
                  {t('auth.reset_password.reset.go_to_login')}
                </Button>
              </Stack>
            ) : (
              <Stack gap="md">
                <div>
                  <Title ta="center" order={2} mb="xs">
                    {t('auth.reset_password.reset.title')}
                  </Title>
                  <Text c="dimmed" size="sm" ta="center">
                    {t('auth.reset_password.reset.subtitle')}
                  </Text>
                </div>

                <Alert 
                  color="blue" 
                  variant="light"
                  styles={{ message: { fontSize: 'var(--mantine-font-size-xs)' } }}
                >
                  {t('auth.reset_password.reset.password_requirements')}
                </Alert>
                
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack gap="md">
                    <PasswordInput
                      label={t('auth.reset_password.reset.new_password_label')}
                      placeholder={t('auth.reset_password.reset.new_password_placeholder')}
                      leftSection={<Lock size={18} />}
                      size="md"
                      {...register('newPassword')}
                      error={errors.newPassword?.message ? t(errors.newPassword.message) : undefined}
                    />

                    <PasswordInput
                      label={t('auth.reset_password.reset.confirm_password_label')}
                      placeholder={t('auth.reset_password.reset.confirm_password_placeholder')}
                      leftSection={<Lock size={18} />}
                      size="md"
                      {...register('confirmPassword')}
                      error={errors.confirmPassword?.message ? t(errors.confirmPassword.message) : undefined}
                    />

                    <Button
                      type="submit"
                      fullWidth
                      size="md"
                      loading={resetPasswordMutation.isPending}
                      variant="gradient"
                    >
                      {t('auth.reset_password.reset.submit_button')}
                    </Button>

                    <Group justify="center">
                      <Anchor
                        onClick={() => navigate('/login')}
                        c="dimmed"
                        size="sm"
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <ArrowLeft size={14} />
                        {t('auth.reset_password.reset.back_to_login')}
                      </Anchor>
                    </Group>
                  </Stack>
                </form>
              </Stack>
            )}
          </Paper>
        </Stack>
      </Box>
    </Box>
  );
}

