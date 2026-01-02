import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { TextInput, PasswordInput, Button, Anchor } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { loginSchema, type LoginFormData } from '../model/schema';
import { useLoginMutation } from '../../../../shared/api/queries/auth';
import { useAuth } from '../../../../shared/lib/auth/AuthContext';
import { useNavigate, useSearchParams } from 'react-router';

export function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setIsAuthenticated } = useAuth();
  const loginMutation = useLoginMutation();

  const returnUrl = searchParams.get('returnUrl');

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
      // setIsAuthenticated(true);
      // notifications.show({
      //   title: t('common.success'),
      //   message: t('auth.login.title'),
      //   color: 'green',
      // });
      
      // If returnUrl is provided, redirect there
      if (returnUrl) {
        navigate(returnUrl);
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
        message: error.response?.data?.message || t('auth.login.error_generic'),
        color: 'red',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-5">
        <TextInput
          label={t('auth.login.email_label')}
          placeholder={t('auth.login.email_placeholder')}
          leftSection={<Mail size={18} className="text-gray-400" />}
          size="md"
          radius="lg"
          classNames={{
            input: 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 focus:border-violet-500 dark:focus:border-violet-500',
            label: 'text-gray-700 dark:text-gray-300 font-medium mb-1.5',
          }}
          {...register('email')}
          error={errors.email?.message ? t(errors.email.message) : undefined}
        />

        <div>
          <PasswordInput
            label={t('auth.login.password_label')}
            placeholder={t('auth.login.password_placeholder')}
            leftSection={<Lock size={18} className="text-gray-400" />}
            size="md"
            radius="lg"
            classNames={{
              input: 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 focus:border-violet-500 dark:focus:border-violet-500',
              label: 'text-gray-700 dark:text-gray-300 font-medium mb-1.5',
            }}
            {...register('password')}
            error={errors.password?.message ? t(errors.password.message) : undefined}
          />
          <div className="flex justify-end mt-2">
            <Anchor
              onClick={() => navigate('/forgot-password')}
              size="sm"
              className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 cursor-pointer font-medium"
              underline="never"
            >
              {t('auth.login.forgot_password_link')}
            </Anchor>
          </div>
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          radius="lg"
          loading={loginMutation.isPending}
          rightSection={!loginMutation.isPending && <ArrowRight size={18} />}
          className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 border-0 mt-2 h-12"
        >
          {t('auth.login.submit_button')}
        </Button>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-white/10" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-[#0a0a0f] text-gray-500">
              {t('auth.login.no_account')}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          fullWidth
          size="lg"
          radius="lg"
          onClick={() => navigate('/signup')}
          className="border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 h-12"
        >
          {t('auth.login.signup_link')}
        </Button>
      </div>
    </form>
  );
}
