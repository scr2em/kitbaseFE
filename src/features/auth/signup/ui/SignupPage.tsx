import { Paper } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { usePageTitle } from '../../../../shared/hooks';
import { InitiateSignupForm } from './InitiateSignupForm';
import { CompleteSignupForm } from './CompleteSignupForm';

export function SignupPage() {
  const { t } = useTranslation();
  usePageTitle(t('auth.signup.page_title'));
  const [searchParams] = useSearchParams();
  
  const token = searchParams.get('token');
  const isCompleteStep = !!token;

  return (
    <Paper withBorder shadow="xl" p="xl" radius="lg">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-center mb-2">
            {isCompleteStep 
              ? t('auth.signup.complete.title') 
              : t('auth.signup.initiate.title')
            }
          </h2>
          <p className="text-sm text-gray-500 text-center">
            {isCompleteStep 
              ? t('auth.signup.complete.subtitle') 
              : t('auth.signup.initiate.subtitle')
            }
          </p>
        </div>
        
        {isCompleteStep ? (
          <CompleteSignupForm token={token} />
        ) : (
          <InitiateSignupForm />
        )}
      </div>
    </Paper>
  );
}
