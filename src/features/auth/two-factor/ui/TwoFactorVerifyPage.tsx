import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { TextInput, Button, Alert, SegmentedControl } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { ShieldCheck, KeyRound, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams, Link, useLocation } from 'react-router';
import { twoFactorVerifySchema, type TwoFactorVerifyFormData } from '../model/schema';
import { useVerifyTwoFactorMutation } from '../../../../shared/api/queries/auth';
import { useAuth } from '../../../../shared/lib/auth';
import { usePageTitle } from '../../../../shared/hooks';

export interface TwoFactorSessionData {
  tempToken: string;
  methods: string[];
  returnUrl?: string | null;
}

export function TwoFactorVerifyPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { setIsAuthenticated } = useAuth();
  const verifyMutation = useVerifyTwoFactorMutation();
  
  usePageTitle(t('auth.two_factor.page_title'));

  // Get session data from navigation state (passed via navigate with state)
  const sessionData = location.state as TwoFactorSessionData | null;
  const returnUrl = searchParams.get('returnUrl') || sessionData?.returnUrl;
  const availableMethods = sessionData?.methods || ['totp'];
  const hasBackupOption = availableMethods.includes('backup');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TwoFactorVerifyFormData>({
    resolver: zodResolver(twoFactorVerifySchema),
    defaultValues: {
      code: '',
      type: 'totp',
    },
  });

  const selectedType = watch('type');

  const onSubmit = async (data: TwoFactorVerifyFormData) => {
    if (!sessionData?.tempToken) {
      return;
    }

    try {
      const response = await verifyMutation.mutateAsync({
        tempToken: sessionData.tempToken,
        code: data.code,
        type: data.type,
      });

      setIsAuthenticated(true);

      // Handle redirect after successful 2FA verification
      if (returnUrl) {
        navigate(returnUrl);
        return;
      }

      // Redirect to organization creation if user doesn't have one
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
        message: error.response?.data?.message || t('auth.two_factor.error_invalid_code'),
        color: 'red',
      });
    }
  };

  // No session data - show error and redirect to login
  if (!sessionData?.tempToken) {
    return (
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('auth.two_factor.session_expired_title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t('auth.two_factor.session_expired_message')}
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/50 dark:shadow-none">
          <Button
            component={Link}
            to="/login"
            fullWidth
            size="lg"
            radius="lg"
            leftSection={<ArrowLeft size={18} />}
            className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 border-0 h-12"
          >
            {t('auth.two_factor.back_to_login')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 mb-6 shadow-lg shadow-violet-500/25">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('auth.two_factor.title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {selectedType === 'totp' 
            ? t('auth.two_factor.subtitle_totp')
            : t('auth.two_factor.subtitle_backup')
          }
        </p>
      </div>

      {/* Form Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/50 dark:shadow-none">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-5">
            {/* Method selector (only show if backup codes available) */}
            {hasBackupOption && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('auth.two_factor.method_label')}
                </label>
                <SegmentedControl
                  fullWidth
                  value={selectedType}
                  onChange={(value) => setValue('type', value as 'totp' | 'backup')}
                  data={[
                    { 
                      label: t('auth.two_factor.method_totp'), 
                      value: 'totp' 
                    },
                    { 
                      label: t('auth.two_factor.method_backup'), 
                      value: 'backup' 
                    },
                  ]}
                  radius="lg"
                />
              </div>
            )}

            <TextInput
              label={selectedType === 'totp' 
                ? t('auth.two_factor.code_label_totp')
                : t('auth.two_factor.code_label_backup')
              }
              placeholder={selectedType === 'totp'
                ? t('auth.two_factor.code_placeholder_totp')
                : t('auth.two_factor.code_placeholder_backup')
              }
              leftSection={selectedType === 'totp' 
                ? <ShieldCheck size={18} className="text-gray-400" />
                : <KeyRound size={18} className="text-gray-400" />
              }
              size="md"
              radius="lg"
              classNames={{
                input: 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 focus:border-violet-500 dark:focus:border-violet-500 text-center tracking-widest font-mono text-lg',
                label: 'text-gray-700 dark:text-gray-300 font-medium mb-1.5',
              }}
              {...register('code')}
              error={errors.code?.message ? t(errors.code.message) : undefined}
              maxLength={selectedType === 'totp' ? 6 : 10}
            />

            {selectedType === 'totp' && (
              <Alert
                variant="light"
                color="blue"
                className="text-sm"
              >
                {t('auth.two_factor.totp_hint')}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              size="lg"
              radius="lg"
              loading={verifyMutation.isPending}
              className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 border-0 mt-2 h-12"
            >
              {t('auth.two_factor.submit_button')}
            </Button>

            <div className="text-center">
              <Button
                variant="subtle"
                color="gray"
                component={Link}
                to="/login"
                leftSection={<ArrowLeft size={16} />}
              >
                {t('auth.two_factor.back_to_login')}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
