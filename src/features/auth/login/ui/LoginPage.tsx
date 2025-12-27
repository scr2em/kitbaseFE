import { Paper } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { usePageTitle } from '../../../../shared/hooks';
import { LoginForm } from './LoginForm';

export function LoginPage() {
  const { t } = useTranslation();
  usePageTitle(t('auth.login.page_title'));

  return (
    <Paper withBorder shadow="xl" p="xl" radius="lg">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-center mb-2">
            {t('auth.login.title')}
          </h2>
          <p className="text-sm text-gray-500 text-center">
            {t('auth.login.subtitle')}
          </p>
        </div>
        <LoginForm />
      </div>
    </Paper>
  );
}
