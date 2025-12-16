import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { TextInput, PasswordInput, Button, Anchor, Divider } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Mail, Lock } from 'lucide-react';
import { loginSchema, type LoginFormData } from '../model/schema';
import { useLoginMutation } from '../../../../shared/api/queries/auth';
import { useAuth } from '../../../../shared/lib/auth/AuthContext';
import { useNavigate } from 'react-router';

export function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginMutation.mutateAsync(data);
      setIsAuthenticated(true);
      notifications.show({
        title: t('common.success'),
        message: t('auth.login.title'),
        color: 'green',
      });
      
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
        message: error.response?.data?.message || t('auth.login.error_generic'),
        color: 'red',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <TextInput
          label={t('auth.login.email_label')}
          placeholder={t('auth.login.email_placeholder')}
          leftSection={<Mail size={18} />}
          size="md"
          {...register('email')}
          error={errors.email?.message ? t(errors.email.message) : undefined}
        />

        <PasswordInput
          label={t('auth.login.password_label')}
          placeholder={t('auth.login.password_placeholder')}
          leftSection={<Lock size={18} />}
          size="md"
          {...register('password')}
          error={errors.password?.message ? t(errors.password.message) : undefined}
        />

        <Anchor
          onClick={() => navigate('/forgot-password')}
          size="sm"
          c="brand"
          className="cursor-pointer self-end"
        >
          {t('auth.login.forgot_password_link')}
        </Anchor>

        <Button
          type="submit"
          fullWidth
          size="md"
          loading={loginMutation.isPending}
          variant="gradient"
        >
          {t('auth.login.submit_button')}
        </Button>

        <Divider />

        <p className="text-center text-sm">
          {t('auth.login.no_account')}{' '}
          <Anchor
            onClick={() => navigate('/signup')}
            fw={700}
            c="brand"
            className="cursor-pointer"
          >
            {t('auth.login.signup_link')}
          </Anchor>
        </p>
      </div>
    </form>
  );
}
