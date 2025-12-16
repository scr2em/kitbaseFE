import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { 
  Paper, 
  ThemeIcon, 
  PasswordInput, 
  Button, 
  Anchor, 
  Alert
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Lock, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
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

  if (!token) {
    return (
      <Paper withBorder shadow="xl" p="xl" radius="lg">
        <div className="flex flex-col gap-4 items-center">
          <ThemeIcon size={60} radius="xl" color="red" variant="light">
            <AlertTriangle size={32} />
          </ThemeIcon>
          <h2 className="text-2xl font-semibold text-center">
            {t('auth.reset_password.errors.title')}
          </h2>
          <p className="text-sm text-gray-500 text-center">
            {t('auth.reset_password.errors.invalid_link')}
          </p>
          <Button
            variant="subtle"
            leftSection={<ArrowLeft size={16} />}
            onClick={() => navigate('/forgot-password')}
          >
            {t('auth.reset_password.reset.request_new_link')}
          </Button>
        </div>
      </Paper>
    );
  }

  return (
    <Paper withBorder shadow="xl" p="xl" radius="lg">
      {resetSuccess ? (
        <div className="flex flex-col gap-4 items-center">
          <ThemeIcon size={60} radius="xl" color="green" variant="light">
            <CheckCircle size={32} />
          </ThemeIcon>
          <h2 className="text-2xl font-semibold text-center">
            {t('auth.reset_password.reset.success_title')}
          </h2>
          <p className="text-sm text-gray-500 text-center">
            {t('auth.reset_password.reset.success_message')}
          </p>
          <Button fullWidth variant="gradient" onClick={() => navigate('/login')}>
            {t('auth.reset_password.reset.go_to_login')}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-center mb-2">
              {t('auth.reset_password.reset.title')}
            </h2>
            <p className="text-sm text-gray-500 text-center">
              {t('auth.reset_password.reset.subtitle')}
            </p>
          </div>

          <Alert 
            color="blue" 
            variant="light"
            styles={{ message: { fontSize: 'var(--mantine-font-size-xs)' } }}
          >
            {t('auth.reset_password.reset.password_requirements')}
          </Alert>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
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

              <div className="flex justify-center">
                <Anchor
                  onClick={() => navigate('/login')}
                  c="dimmed"
                  size="sm"
                  className="cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft size={14} />
                  {t('auth.reset_password.reset.back_to_login')}
                </Anchor>
              </div>
            </div>
          </form>
        </div>
      )}
    </Paper>
  );
}
