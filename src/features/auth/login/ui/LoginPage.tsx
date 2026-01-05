import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { TextInput, PasswordInput, Button, Anchor } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Mail, Lock, ArrowRight, Rocket } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import { loginSchema, type LoginFormData } from '../model/schema';
import { useLoginMutation } from '../../../../shared/api/queries/auth';
import { useAuth } from '../../../../shared/lib/auth';
import type { TwoFactorSessionData } from '../../two-factor/ui/TwoFactorVerifyPage';
import { usePageTitle } from '../../../../shared/hooks';
import { TwoFactorSetupFlow } from '../../../../shared/components/TwoFactorSetupFlow';

type ViewState = 'login' | 'two-factor-setup';

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setIsAuthenticated } = useAuth();
  
  usePageTitle(t('auth.login.page_title'));

  const loginMutation = useLoginMutation();

  const returnUrl = searchParams.get('returnUrl');

  const [viewState, setViewState] = useState<ViewState>('login');
  const [tempToken, setTempToken] = useState<string | null>(null);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginMutation.mutateAsync(data);
      
      // Check if 2FA setup is required (org requires 2FA but user hasn't set it up)
      if (response.twoFactorSetupRequired && response.tempToken) {
        setTempToken(response.tempToken);
        setViewState('two-factor-setup');
        return;
      }
      
      // Check if 2FA verification is required (user has 2FA enabled)
      if (response.twoFactorRequired && response.tempToken) {
        const twoFactorState: TwoFactorSessionData = {
          tempToken: response.tempToken,
          methods: response.twoFactorMethods || ['totp'],
          returnUrl,
        };
        navigate('/2fa', { state: twoFactorState });
        return;
      }
      
      // 2FA not required - tokens are already stored by mutation, mark authenticated
      setIsAuthenticated(true);
      
      if (returnUrl) {
        navigate(returnUrl);
        return;
      }
      
      if (!response.user?.organizations || response.user.organizations.length === 0) {
        navigate('/create-organization');
      } else {
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

  const handleTwoFactorSetupComplete = () => {
    notifications.show({
      title: t('common.success'),
      message: t('auth.two_factor_setup.success_message'),
      color: 'green',
    });
    // Reset to login state so user can log in with their new 2FA
    setViewState('login');
    setTempToken(null);
    loginForm.reset();
  };

  const handleTwoFactorSetupBack = () => {
    setViewState('login');
    setTempToken(null);
  };

  const handleTwoFactorSetupError = () => {
    setViewState('login');
    setTempToken(null);
  };

  // Login View
  if (viewState === 'login') {
    return (
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 mb-6 shadow-lg shadow-violet-500/25">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('auth.login.title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t('auth.login.subtitle')}
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/50 dark:shadow-none">
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
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
                {...loginForm.register('email')}
                error={loginForm.formState.errors.email?.message ? t(loginForm.formState.errors.email.message) : undefined}
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
                  {...loginForm.register('password')}
                  error={loginForm.formState.errors.password?.message ? t(loginForm.formState.errors.password.message) : undefined}
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
                  <span className="px-4 bg-white dark:bg-[#0d1117] text-gray-500">
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
        </div>
      </div>
    );
  }

  // 2FA Setup Flow
  if (viewState === 'two-factor-setup' && tempToken) {
    return (
      <div className="flex flex-col gap-8">
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/50 dark:shadow-none">
          <TwoFactorSetupFlow
            tempToken={tempToken}
            onComplete={handleTwoFactorSetupComplete}
            onBack={handleTwoFactorSetupBack}
            onError={handleTwoFactorSetupError}
          />
        </div>
      </div>
    );
  }

  return null;
}
