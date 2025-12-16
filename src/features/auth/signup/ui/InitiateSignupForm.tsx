import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { 
  TextInput, 
  Button, 
  Anchor, 
  Divider,
} from '@mantine/core';
import { Mail, CheckCircle, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { initiateSignupSchema, type InitiateSignupFormData } from '../model/schema';
import { useInitiateSignupMutation } from '../../../../shared/api/queries/auth';
import { useShowBackendError } from '../../../../shared/hooks';

export function InitiateSignupForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const initiateSignupMutation = useInitiateSignupMutation();
  const { showError } = useShowBackendError();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<InitiateSignupFormData>({
    resolver: zodResolver(initiateSignupSchema),
  });

  const onSubmit = async (data: InitiateSignupFormData) => {
    try {
      await initiateSignupMutation.mutateAsync(data);
      setSubmittedEmail(data.email);
      setEmailSent(true);
    } catch (error) {
      showError(error);
    }
  };

  const handleResend = async () => {
    try {
      await initiateSignupMutation.mutateAsync({ email: submittedEmail || getValues('email') });
    } catch (error) {
      showError(error);
    }
  };

  if (emailSent) {
    return (
      <div className="flex flex-col gap-6 items-center">
        <CheckCircle size={64} color="var(--mantine-color-green-6)" />
        <h3 className="text-xl font-semibold text-center">
          {t('auth.signup.initiate.success_title')}
        </h3>
        <p className="text-gray-500 text-center">
          {t('auth.signup.initiate.success_message', { email: submittedEmail })}
        </p>
        <Button
          variant="subtle"
          leftSection={<RefreshCw size={16} />}
          onClick={handleResend}
          loading={initiateSignupMutation.isPending}
        >
          {t('auth.signup.initiate.resend_button')}
        </Button>
        <Divider className="w-full" />
        <p className="text-center text-sm">
          {t('auth.signup.have_account')}{' '}
          <Anchor
            onClick={() => navigate('/login')}
            fw={700}
            c="brand"
            className="cursor-pointer"
          >
            {t('auth.signup.login_link')}
          </Anchor>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <TextInput
          label={t('auth.signup.email_label')}
          placeholder={t('auth.signup.email_placeholder')}
          leftSection={<Mail size={18} />}
          size="md"
          {...register('email')}
          error={errors.email?.message ? t(errors.email.message) : undefined}
        />

        <Button
          type="submit"
          fullWidth
          size="md"
          loading={initiateSignupMutation.isPending}
        >
          {t('auth.signup.initiate.submit_button')}
        </Button>

        <Divider />

        <p className="text-center text-sm">
          {t('auth.signup.have_account')}{' '}
          <Anchor
            onClick={() => navigate('/login')}
            fw={700}
            c="brand"
            className="cursor-pointer"
          >
            {t('auth.signup.login_link')}
          </Anchor>
        </p>
      </div>
    </form>
  );
}
