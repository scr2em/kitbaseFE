import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { TextInput, PasswordInput, Button, Anchor, Alert, CopyButton, ActionIcon, Tooltip } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Mail, Lock, ArrowRight, Rocket, ShieldCheck, AlertTriangle, Copy, Check, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import { QRCodeSVG } from 'qrcode.react';
import { z } from 'zod';
import { loginSchema, type LoginFormData } from '../model/schema';
import { useLoginMutation } from '../../../../shared/api/queries/auth';
import { useAuth } from '../../../../shared/lib/auth';
import { setTwoFactorSession } from '../../two-factor/ui/TwoFactorVerifyPage';
import { usePageTitle } from '../../../../shared/hooks';
import { useShowBackendError } from '../../../../shared/hooks';
import {
  useTwoFactorSetupWithTokenMutation,
  useTwoFactorEnableWithTokenMutation,
} from '../../../../shared/api/queries/two-factor';

type ViewState = 'login' | 'setup-loading' | 'setup-qr' | 'setup-verify' | 'setup-backup';

const enableTwoFactorSchema = z.object({
  code: z.string().min(6, 'validation.two_factor.code_min').max(6, 'validation.two_factor.code_max'),
});

type EnableTwoFactorFormData = z.infer<typeof enableTwoFactorSchema>;

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setIsAuthenticated } = useAuth();
  const { showError } = useShowBackendError();
  
  usePageTitle(t('auth.login.page_title'));

  const loginMutation = useLoginMutation();
  const setupMutation = useTwoFactorSetupWithTokenMutation();
  const enableMutation = useTwoFactorEnableWithTokenMutation();

  const returnUrl = searchParams.get('returnUrl');

  const [viewState, setViewState] = useState<ViewState>('login');
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [setupData, setSetupData] = useState<{
    secret: string;
    qrCodeUri: string;
    backupCodes: string[];
  } | null>(null);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const enableForm = useForm<EnableTwoFactorFormData>({
    resolver: zodResolver(enableTwoFactorSchema),
    defaultValues: { code: '' },
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginMutation.mutateAsync(data);
      
      // Check if 2FA setup is required (org requires 2FA but user hasn't set it up)
      if (response.twoFactorSetupRequired && response.tempToken) {
        setTempToken(response.tempToken);
        setViewState('setup-loading');
        // Start 2FA setup
        try {
          const setup = await setupMutation.mutateAsync(response.tempToken);
          setSetupData(setup);
          setViewState('setup-qr');
        } catch (error) {
          showError(error);
          setViewState('login');
          setTempToken(null);
        }
        return;
      }
      
      // Check if 2FA verification is required (user has 2FA enabled)
      if (response.twoFactorRequired && response.tempToken) {
        setTwoFactorSession({
          tempToken: response.tempToken,
          methods: response.twoFactorMethods || ['totp'],
          returnUrl,
        });
        const twoFactorUrl = returnUrl ? `/2fa?returnUrl=${encodeURIComponent(returnUrl)}` : '/2fa';
        navigate(twoFactorUrl);
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

  const handleEnableTwoFactor = async (data: EnableTwoFactorFormData) => {
    if (!tempToken) return;

    try {
      await enableMutation.mutateAsync({
        tempToken,
        code: data.code,
      });
      setViewState('setup-backup');
    } catch (error) {
      showError(error);
    }
  };

  const handleSetupComplete = () => {
    notifications.show({
      title: t('common.success'),
      message: t('auth.two_factor_setup.success_message'),
      color: 'green',
    });
    // Reset to login state so user can log in with their new 2FA
    setViewState('login');
    setTempToken(null);
    setSetupData(null);
    enableForm.reset();
    loginForm.reset();
  };

  const handleBackToLogin = () => {
    setViewState('login');
    setTempToken(null);
    setSetupData(null);
    enableForm.reset();
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

  // 2FA Setup Loading View
  if (viewState === 'setup-loading') {
    return (
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 mb-6 shadow-lg shadow-violet-500/25">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('auth.two_factor_setup.loading_title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t('auth.two_factor_setup.loading_message')}
          </p>
        </div>
      </div>
    );
  }

  // 2FA Setup QR View
  if (viewState === 'setup-qr' && setupData) {
    return (
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 mb-6 shadow-lg shadow-violet-500/25">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('auth.two_factor_setup.title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t('auth.two_factor_setup.subtitle')}
          </p>
        </div>

        <Alert
          variant="light"
          color="amber"
          className="text-sm"
          icon={<AlertTriangle size={18} />}
        >
          {t('auth.two_factor_setup.required_notice')}
        </Alert>

        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/50 dark:shadow-none">
          <div className="flex flex-col gap-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('auth.two_factor_setup.qr_instructions')}
            </p>

            <div className="flex justify-center p-6 bg-white rounded-lg">
              <QRCodeSVG value={setupData.qrCodeUri} size={200} />
            </div>

            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <p className="text-xs text-gray-500 mb-2">
                {t('auth.two_factor_setup.manual_entry_label')}
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm font-mono bg-white dark:bg-gray-900 px-3 py-2 rounded border border-gray-200 dark:border-gray-700 break-all">
                  {setupData.secret}
                </code>
                <CopyButton value={setupData.secret}>
                  {({ copied, copy }) => (
                    <Tooltip label={copied ? t('common.copied') : t('common.copy')}>
                      <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </CopyButton>
              </div>
            </div>

            <Button
              fullWidth
              size="lg"
              radius="lg"
              onClick={() => setViewState('setup-verify')}
              className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 border-0 h-12"
            >
              {t('auth.two_factor_setup.continue_button')}
            </Button>

            <div className="text-center">
              <Button
                variant="subtle"
                color="gray"
                leftSection={<ArrowLeft size={16} />}
                onClick={handleBackToLogin}
              >
                {t('auth.two_factor_setup.back_to_login')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2FA Setup Verify View
  if (viewState === 'setup-verify') {
    return (
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 mb-6 shadow-lg shadow-violet-500/25">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('auth.two_factor_setup.title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t('auth.two_factor_setup.verify_instructions')}
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/50 dark:shadow-none">
          <form onSubmit={enableForm.handleSubmit(handleEnableTwoFactor)}>
            <div className="flex flex-col gap-6">
              <TextInput
                label={t('auth.two_factor_setup.verification_code_label')}
                placeholder={t('auth.two_factor_setup.verification_code_placeholder')}
                {...enableForm.register('code')}
                error={enableForm.formState.errors.code?.message ? t(enableForm.formState.errors.code.message) : undefined}
                maxLength={6}
                classNames={{
                  input: 'text-center tracking-widest font-mono text-lg bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 focus:border-violet-500 dark:focus:border-violet-500',
                  label: 'text-gray-700 dark:text-gray-300 font-medium mb-1.5',
                }}
              />

              <div className="flex gap-3">
                <Button
                  variant="default"
                  onClick={() => setViewState('setup-qr')}
                  className="flex-1"
                  size="lg"
                  radius="lg"
                >
                  {t('common.back')}
                </Button>
                <Button
                  type="submit"
                  loading={enableMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 border-0"
                  size="lg"
                  radius="lg"
                >
                  {t('auth.two_factor_setup.verify_button')}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 2FA Setup Backup Codes View
  if (viewState === 'setup-backup' && setupData) {
    return (
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 mb-6 shadow-lg shadow-violet-500/25">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('auth.two_factor_setup.title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t('auth.two_factor_setup.backup_codes_warning')}
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/50 dark:shadow-none">
          <div className="flex flex-col gap-6">
            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  {t('auth.two_factor_setup.backup_codes_warning')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {setupData.backupCodes.map((code, index) => (
                <code
                  key={index}
                  className="px-3 py-2 text-center font-mono text-sm bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
                >
                  {code}
                </code>
              ))}
            </div>

            <CopyButton value={setupData.backupCodes.join('\n')}>
              {({ copied, copy }) => (
                <Button
                  variant="light"
                  leftSection={copied ? <Check size={16} /> : <Copy size={16} />}
                  onClick={copy}
                >
                  {copied ? t('common.copied') : t('auth.two_factor_setup.copy_all_codes')}
                </Button>
              )}
            </CopyButton>

            <Button
              fullWidth
              size="lg"
              radius="lg"
              onClick={handleSetupComplete}
              className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 border-0 h-12"
            >
              {t('auth.two_factor_setup.complete_button')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
