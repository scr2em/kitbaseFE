import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { TextInput, PasswordInput, Button, Stack, Text, Anchor, Group, Divider, Alert } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Mail, Lock, User, Info } from 'lucide-react';
import { signupSchema, type SignupFormData } from '../model/schema';
import { useSignupMutation } from '../../../../shared/api/queries/auth';
import { useAuth } from '../../../../shared/lib/auth/AuthContext';
import { useNavigate, useSearchParams } from 'react-router';

export function SignupForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setIsAuthenticated } = useAuth();
  const signupMutation = useSignupMutation();

  const invitationId = searchParams.get('invitationId');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const response = await signupMutation.mutateAsync(data);
      setIsAuthenticated(true);

      notifications.show({
        title: t('common.success'),
        message: t('auth.signup.success_message'),
        color: 'green',
      });

      // If there's an invitation ID, redirect back to accept invitation page
      if (invitationId) {
        navigate(`/invitations/accept?id=${invitationId}`);
        return;
      }
      
      // Redirect to organization creation if user doesn't have one
      if (!response.user.organizations || response.user.organizations.length === 0) {
        navigate('/create-organization');
      } else {
        // Redirect to the first organization
        const firstOrg = response.user.organizations[0];
        if (firstOrg) {
          const url = `http://${firstOrg.organization.subdomain}.${import.meta.env.VITE_APP_DOMAIN}/dashboard`;
          window.open(url, '_self');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      notifications.show({
        title: t('common.error'),
        message: error.response?.data?.message || t('auth.signup.error_generic'),
        color: 'red',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="md">
        {invitationId && (
          <Alert color="blue" icon={<Info size={16} />}>
            <Text size="sm">
              {t('auth.signup.invitation_note')}
            </Text>
          </Alert>
        )}

        <Group grow>
          <TextInput
            label={t('auth.signup.first_name_label')}
            placeholder={t('auth.signup.first_name_placeholder')}
            leftSection={<User size={18} />}
            size="md"
            {...register('firstName')}
            error={errors.firstName?.message ? t(errors.firstName.message) : undefined}
          />

          <TextInput
            label={t('auth.signup.last_name_label')}
            placeholder={t('auth.signup.last_name_placeholder')}
            leftSection={<User size={18} />}
            size="md"
            {...register('lastName')}
            error={errors.lastName?.message ? t(errors.lastName.message) : undefined}
          />
        </Group>

        <TextInput
          label={t('auth.signup.email_label')}
          placeholder={t('auth.signup.email_placeholder')}
          leftSection={<Mail size={18} />}
          size="md"
          {...register('email')}
          error={errors.email?.message ? t(errors.email.message) : undefined}
        />

        <PasswordInput
          label={t('auth.signup.password_label')}
          placeholder={t('auth.signup.password_placeholder')}
          leftSection={<Lock size={18} />}
          size="md"
          {...register('password')}
          error={errors.password?.message ? t(errors.password.message) : undefined}
        />

        <Button
          type="submit"
          fullWidth
          size="md"
          loading={signupMutation.isPending}
          variant="gradient"
          gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
        >
          {t('auth.signup.submit_button')}
        </Button>

        <Divider />

        <Text ta="center" size="sm">
          {t('auth.signup.have_account')}{' '}
          <Anchor
            onClick={() => navigate('/login')}
            fw={700}
            c="brand"
            style={{ cursor: 'pointer' }}
          >
            {t('auth.signup.login_link')}
          </Anchor>
        </Text>
      </Stack>
    </form>
  );
}
