import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { 
  TextInput, 
  PasswordInput, 
  Button, 
  Anchor, 
  Divider,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { User, Lock } from 'lucide-react';
import { useNavigate } from 'react-router';
import { completeSignupSchema, type CompleteSignupFormData } from '../model/schema';
import { useCompleteSignupMutation } from '../../../../shared/api/queries/auth';
import { useAuth } from '../../../../shared/lib/auth/AuthContext';
import { useShowBackendError } from '../../../../shared/hooks';

interface CompleteSignupFormProps {
  token: string;
}

export function CompleteSignupForm({ token }: CompleteSignupFormProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const completeSignupMutation = useCompleteSignupMutation();
  const { showError } = useShowBackendError();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompleteSignupFormData>({
    resolver: zodResolver(completeSignupSchema),
  });

  const onSubmit = async (data: CompleteSignupFormData) => {
    try {
      const response = await completeSignupMutation.mutateAsync({
        token,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      
      setIsAuthenticated(true);

      notifications.show({
        title: t('common.success'),
        message: t('auth.signup.success_message'),
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
    } catch (error) {
      showError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <TextInput
            label={t('auth.signup.first_name_label')}
            placeholder={t('auth.signup.first_name_placeholder')}
            leftSection={<User size={18} />}
            size="md"
            {...register('firstName')}
            error={errors.firstName?.message ? t(errors.firstName.message) : undefined}
          />

          <TextInput
            label={t('auth.signup.last_name_label')}
            placeholder={t('auth.signup.last_name_placeholder')}
            leftSection={<User size={18} />}
            size="md"
            {...register('lastName')}
            error={errors.lastName?.message ? t(errors.lastName.message) : undefined}
          />
        </div>

        <PasswordInput
          label={t('auth.signup.password_label')}
          placeholder={t('auth.signup.password_placeholder')}
          leftSection={<Lock size={18} />}
          size="md"
          {...register('password')}
          error={errors.password?.message ? t(errors.password.message) : undefined}
        />

        <PasswordInput
          label={t('auth.signup.complete.confirm_password_label')}
          placeholder={t('auth.signup.complete.confirm_password_placeholder')}
          leftSection={<Lock size={18} />}
          size="md"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message ? t(errors.confirmPassword.message) : undefined}
        />

        <Button
          type="submit"
          fullWidth
          size="md"
          loading={completeSignupMutation.isPending}
        >
          {t('auth.signup.complete.submit_button')}
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
