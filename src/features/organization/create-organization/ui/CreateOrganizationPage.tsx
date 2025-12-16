import { useTranslation } from 'react-i18next';
import { Paper, ThemeIcon } from '@mantine/core';
import { Building2 } from 'lucide-react';
import { CreateOrganizationForm } from './CreateOrganizationForm';

export function CreateOrganizationPage() {
  const { t } = useTranslation();

  return (
    <div className="h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-[540px]">
        <Paper
          radius="lg"
          p="xl"
          shadow="xl"
          bg="white"
          style={{
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="flex flex-col gap-6">
            <div className="flex justify-center">
              <ThemeIcon
                size={64}
                radius="xl"
                variant="gradient"
                gradient={{ from: 'brand', to: 'accent', deg: 135 }}
              >
                <Building2 size={32} />
              </ThemeIcon>
            </div>

            <div className="flex flex-col gap-2 items-center">
              <h2 className="text-2xl font-semibold text-center">
                {t('organization.create.title')}
              </h2>
              <p className="text-sm text-gray-500 text-center">
                {t('organization.create.subtitle')}
              </p>
            </div>

            <CreateOrganizationForm />
          </div>
        </Paper>
      </div>
    </div>
  );
}
