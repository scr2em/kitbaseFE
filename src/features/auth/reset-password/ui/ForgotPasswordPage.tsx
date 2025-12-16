import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { 
  Paper, 
  ThemeIcon, 
  TextInput, 
  Button, 
  Anchor
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
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
    <Paper withBorder shadow="xl" p="xl" radius="lg">
      {emailSent ? (
        <div className="flex flex-col gap-4 items-center">
          <ThemeIcon size={60} radius="xl" color="green" variant="light">
            <CheckCircle size={32} />
          </ThemeIcon>
          <h2 className="text-2xl font-semibold text-center">
            {t('auth.reset_password.forgot.success_title')}
          </h2>
          <p className="text-sm text-gray-500 text-center">
            {t('auth.reset_password.forgot.success_message', { email: submittedEmail })}
          </p>
          <Button
            variant="subtle"
            leftSection={<ArrowLeft size={16} />}
            onClick={() => navigate('/login')}
          >
            {t('auth.reset_password.forgot.back_to_login')}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-center mb-2">
              {t('auth.reset_password.forgot.title')}
            </h2>
            <p className="text-sm text-gray-500 text-center">
              {t('auth.reset_password.forgot.subtitle')}
            </p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
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

              <div className="flex justify-center">
                <Anchor
                  onClick={() => navigate('/login')}
                  c="dimmed"
                  size="sm"
                  className="cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft size={14} />
                  {t('auth.reset_password.forgot.back_to_login')}
                </Anchor>
              </div>
            </div>
          </form>
        </div>
      )}
    </Paper>
  );
}
