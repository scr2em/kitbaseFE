import { useTranslation } from 'react-i18next';
import { Paper, ThemeIcon, Stepper } from '@mantine/core';
import { Building2, Rocket, Users, Folder } from 'lucide-react';
import { CreateOrganizationForm } from './CreateOrganizationForm';

export function CreateOrganizationPage() {
  const { t } = useTranslation();

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: 'linear-gradient(135deg, var(--mantine-color-blue-0) 0%, var(--mantine-color-violet-0) 100%)',
      }}
    >
      <div className="w-full max-w-[900px]">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left side - Steps preview */}
          <div className="lg:col-span-2 hidden lg:block">
            <div className="sticky top-6">
              <div className="flex items-center gap-3 mb-8">
                <ThemeIcon
                  size={48}
                  radius="xl"
                  variant="gradient"
                  gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
                >
                  <Rocket size={24} />
                </ThemeIcon>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">
                    {t('onboarding.welcome')}
                  </h1>
                  <p className="text-sm text-slate-500">
                    {t('onboarding.subtitle')}
                  </p>
                </div>
              </div>

              <Stepper 
                active={0} 
                orientation="vertical"
                color="blue"
                size="sm"
                classNames={{
                  stepBody: 'pt-0 pb-4',
                }}
              >
                <Stepper.Step
                  label={t('onboarding.steps.organization.title')}
                  description={t('onboarding.steps.organization.description')}
                  icon={<Building2 size={18} />}
                />
                <Stepper.Step
                  label={t('onboarding.steps.project.title')}
                  description={t('onboarding.steps.project.description')}
                  icon={<Folder size={18} />}
                />
                <Stepper.Step
                  label={t('onboarding.steps.team.title')}
                  description={t('onboarding.steps.team.description')}
                  icon={<Users size={18} />}
                />
              </Stepper>

              <div className="mt-8 p-4 rounded-lg bg-blue-50 border border-blue-100">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">{t('onboarding.tip_title')}</span>
                  {' '}
                  {t('onboarding.tip_content')}
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="lg:col-span-3">
            <Paper
              radius="lg"
              p="xl"
              shadow="xl"
              bg="white"
            >
              <div className="flex flex-col gap-6">
                {/* Mobile header */}
                <div className="flex justify-center lg:hidden">
                  <ThemeIcon
                    size={64}
                    radius="xl"
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'cyan', deg: 135 }}
                  >
                    <Building2 size={32} />
                  </ThemeIcon>
                </div>

                <div className="flex flex-col gap-2 items-center lg:items-start">
                  <div className="flex items-center gap-2 mb-1 lg:hidden">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {t('onboarding.step_indicator', { current: 1, total: 3 })}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-center lg:text-left">
                    {t('organization.create.title')}
                  </h2>
                  <p className="text-sm text-slate-500 text-center lg:text-left">
                    {t('organization.create.subtitle')}
                  </p>
                </div>

                <CreateOrganizationForm />
              </div>
            </Paper>
          </div>
        </div>
      </div>
    </div>
  );
}
