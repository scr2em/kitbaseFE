import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { 
  TextInput, 
  PasswordInput, 
  Button,
} from '@mantine/core';
import { User, Lock, ArrowLeft } from 'lucide-react';
import { invitationSignupSchema, type InvitationSignupFormData } from '../model/schema';
import { useCompleteSignupMutation } from '../../../shared/api/queries/auth';
import { useShowBackendError } from '../../../shared/hooks';
import type { AuthResponse } from '../../../generated-api';

interface InvitationSignupFormProps {
  token: string;
  onBack: () => void;
  onSuccess: (authResponse: AuthResponse) => void;
}

export function InvitationSignupForm({ token, onBack, onSuccess }: InvitationSignupFormProps) {
  const { t } = useTranslation();
  const completeSignupMutation = useCompleteSignupMutation(true);
  const { showError } = useShowBackendError();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InvitationSignupFormData>({
    resolver: zodResolver(invitationSignupSchema),
  });

  const onSubmit = async (data: InvitationSignupFormData) => {
    try {
      const response = await completeSignupMutation.mutateAsync({
        token,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      
      // Let the parent handle authentication state and redirects
      // (may need 2FA setup/verification first)
      onSuccess(response);
    } catch (error) {
      showError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <Button
          variant="subtle"
          leftSection={<ArrowLeft size={16} />}
          onClick={onBack}
          className="self-start -ml-2"
          size="sm"
        >
          {t('invitation.signup.back_button')}
        </Button>

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
          {t('invitation.signup.submit_button')}
        </Button>
      </div>
    </form>
  );
}
