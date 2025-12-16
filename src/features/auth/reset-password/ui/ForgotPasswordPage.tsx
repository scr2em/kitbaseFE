import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Paper, Title, Text, Stack, Box, Group, ThemeIcon, TextInput, Button, Anchor } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Plane, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../model/schema';
import { useForgotPasswordMutation } from '../../../../shared/api/queries/auth';

export function ForgotPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const forgotPasswordMutation = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPasswordMutation.mutateAsync(data);
      setSubmittedEmail(data.email);
      setEmailSent(true);
    } catch (error: any) {
      notifications.show({
        title: t('common.error'),
        message: error.response?.data?.error?.message || t('auth.reset_password.forgot.error_generic'),
        color: 'red',
      });
    }
  };

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
              {t('auth.reset_password.forgot.tagline')}
            </Text>
          </Box>

          <Paper
            withBorder
            shadow="xl"
            p="xl"
            radius="lg"
            bg="white"
          >
            {emailSent ? (
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
                  {t('auth.reset_password.forgot.success_title')}
                </Title>
                <Text c="dimmed" size="sm" ta="center">
                  {t('auth.reset_password.forgot.success_message', { email: submittedEmail })}
                </Text>
                <Button
                  variant="subtle"
                  leftSection={<ArrowLeft size={16} />}
                  onClick={() => navigate('/login')}
                >
                  {t('auth.reset_password.forgot.back_to_login')}
                </Button>
              </Stack>
            ) : (
              <Stack gap="md">
                <div>
                  <Title ta="center" order={2} mb="xs">
                    {t('auth.reset_password.forgot.title')}
                  </Title>
                  <Text c="dimmed" size="sm" ta="center">
                    {t('auth.reset_password.forgot.subtitle')}
                  </Text>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack gap="md">
                    <TextInput
                      label={t('auth.reset_password.forgot.email_label')}
                      placeholder={t('auth.reset_password.forgot.email_placeholder')}
                      leftSection={<Mail size={18} />}
                      size="md"
                      {...register('email')}
                      error={errors.email?.message ? t(errors.email.message) : undefined}
                    />

                    <Button
                      type="submit"
                      fullWidth
                      size="md"
                      loading={forgotPasswordMutation.isPending}
                      variant="gradient"
                    >
                      {t('auth.reset_password.forgot.submit_button')}
                    </Button>

                    <Group justify="center">
                      <Anchor
                        onClick={() => navigate('/login')}
                        c="dimmed"
                        size="sm"
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <ArrowLeft size={14} />
                        {t('auth.reset_password.forgot.back_to_login')}
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

