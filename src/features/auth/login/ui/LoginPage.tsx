import { useTranslation } from 'react-i18next';
import { usePageTitle } from '../../../../shared/hooks';
import { LoginForm } from './LoginForm';
import { Rocket } from 'lucide-react';

export function LoginPage() {
  const { t } = useTranslation();
  usePageTitle(t('auth.login.page_title'));

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 mb-6 shadow-lg shadow-violet-500/25">
          <Rocket className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('auth.login.title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {t('auth.login.subtitle')}
        </p>
      </div>

      {/* Form Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/50 dark:shadow-none">
        <LoginForm />
      </div>
    </div>
  );
}
