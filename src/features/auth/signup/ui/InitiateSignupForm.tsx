import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { 
  TextInput, 
  Button, 
  Anchor,
} from '@mantine/core';
import { Mail, CheckCircle, RefreshCw, ArrowRight } from 'lucide-react';
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
      <div className="flex flex-col gap-6 items-center py-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/25">
          <CheckCircle size={40} className="text-white" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t('auth.signup.initiate.success_title')}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm">
            {t('auth.signup.initiate.success_message', { email: submittedEmail })}
          </p>
        </div>
        <Button
          variant="subtle"
          leftSection={<RefreshCw size={16} />}
          onClick={handleResend}
          loading={initiateSignupMutation.isPending}
          radius="lg"
          className="text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10"
        >
          {t('auth.signup.initiate.resend_button')}
        </Button>
        
        <div className="w-full relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-white/10" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-[#0d1117] text-gray-500">
              {t('auth.signup.have_account')}
            </span>
          </div>
        </div>

        <Anchor
          onClick={() => navigate('/login')}
          className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 cursor-pointer font-semibold"
          underline="never"
        >
          {t('auth.signup.login_link')}
        </Anchor>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-5">
        <TextInput
          label={t('auth.signup.email_label')}
          placeholder={t('auth.signup.email_placeholder')}
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

        <Button
          type="submit"
          fullWidth
          size="lg"
          radius="lg"
          loading={initiateSignupMutation.isPending}
          rightSection={!initiateSignupMutation.isPending && <ArrowRight size={18} />}
          className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 border-0 mt-2 h-12"
        >
          {t('auth.signup.initiate.submit_button')}
        </Button>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-white/10" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-[#0d1117] text-gray-500">
              {t('auth.signup.have_account')}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          fullWidth
          size="lg"
          radius="lg"
          onClick={() => navigate('/login')}
          className="border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 h-12"
        >
          {t('auth.signup.login_link')}
        </Button>
      </div>
    </form>
  );
}
