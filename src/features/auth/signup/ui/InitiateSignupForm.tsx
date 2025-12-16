import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { 
  TextInput, 
  Button, 
  Stack, 
  Text, 
  Anchor, 
  Divider,
  Title
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
      <Stack gap="lg" align="center">
        <CheckCircle size={64} color="var(--mantine-color-green-6)" />
        <Title order={3} ta="center">
          {t('auth.signup.initiate.success_title')}
        </Title>
        <Text c="dimmed" ta="center">
          {t('auth.signup.initiate.success_message', { email: submittedEmail })}
        </Text>
        <Button
          variant="subtle"
          leftSection={<RefreshCw size={16} />}
          onClick={handleResend}
          loading={initiateSignupMutation.isPending}
        >
          {t('auth.signup.initiate.resend_button')}
        </Button>
        <Divider w="100%" />
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
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="md">
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

