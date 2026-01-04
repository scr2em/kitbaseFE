import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { 
  TextInput, 
  PasswordInput, 
  Button, 
  Anchor,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { User, Lock, ArrowRight } from 'lucide-react';
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
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput
            label={t('auth.signup.first_name_label')}
            placeholder={t('auth.signup.first_name_placeholder')}
            leftSection={<User size={18} className="text-gray-400" />}
            size="md"
            radius="lg"
            classNames={{
              input: 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 focus:border-violet-500 dark:focus:border-violet-500',
              label: 'text-gray-700 dark:text-gray-300 font-medium mb-1.5',
            }}
            {...register('firstName')}
            error={errors.firstName?.message ? t(errors.firstName.message) : undefined}
          />

          <TextInput
            label={t('auth.signup.last_name_label')}
            placeholder={t('auth.signup.last_name_placeholder')}
            leftSection={<User size={18} className="text-gray-400" />}
            size="md"
            radius="lg"
            classNames={{
              input: 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 focus:border-violet-500 dark:focus:border-violet-500',
              label: 'text-gray-700 dark:text-gray-300 font-medium mb-1.5',
            }}
            {...register('lastName')}
            error={errors.lastName?.message ? t(errors.lastName.message) : undefined}
          />
        </div>

        <PasswordInput
          label={t('auth.signup.password_label')}
          placeholder={t('auth.signup.password_placeholder')}
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

        <PasswordInput
          label={t('auth.signup.complete.confirm_password_label')}
          placeholder={t('auth.signup.complete.confirm_password_placeholder')}
          leftSection={<Lock size={18} className="text-gray-400" />}
          size="md"
          radius="lg"
          classNames={{
            input: 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 focus:border-violet-500 dark:focus:border-violet-500',
            label: 'text-gray-700 dark:text-gray-300 font-medium mb-1.5',
          }}
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message ? t(errors.confirmPassword.message) : undefined}
        />

        <Button
          type="submit"
          fullWidth
          size="lg"
          radius="lg"
          loading={completeSignupMutation.isPending}
          rightSection={!completeSignupMutation.isPending && <ArrowRight size={18} />}
          className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 border-0 mt-2 h-12"
        >
          {t('auth.signup.complete.submit_button')}
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

        <Anchor
          onClick={() => navigate('/login')}
          className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 cursor-pointer font-semibold text-center"
          underline="never"
        >
          {t('auth.signup.login_link')}
        </Anchor>
      </div>
    </form>
  );
}
