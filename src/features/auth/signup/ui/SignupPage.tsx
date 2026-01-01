import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { usePageTitle } from '../../../../shared/hooks';
import { InitiateSignupForm } from './InitiateSignupForm';
import { CompleteSignupForm } from './CompleteSignupForm';
import { Rocket, UserPlus } from 'lucide-react';

export function SignupPage() {
  const { t } = useTranslation();
  usePageTitle(t('auth.signup.page_title'));
  const [searchParams] = useSearchParams();
  
  const token = searchParams.get('token');
  const isCompleteStep = !!token;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 mb-6 shadow-lg shadow-violet-500/25">
          {isCompleteStep ? (
            <UserPlus className="w-8 h-8 text-white" />
          ) : (
            <Rocket className="w-8 h-8 text-white" />
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {isCompleteStep 
            ? t('auth.signup.complete.title') 
            : t('auth.signup.initiate.title')
          }
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {isCompleteStep 
            ? t('auth.signup.complete.subtitle') 
            : t('auth.signup.initiate.subtitle')
          }
        </p>
      </div>

      {/* Form Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/50 dark:shadow-none">
        {isCompleteStep ? (
          <CompleteSignupForm token={token} />
        ) : (
          <InitiateSignupForm />
        )}
      </div>
    </div>
  );
}
