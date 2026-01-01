import { Card } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Lock } from 'lucide-react';

export function AccessPage() {
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">
        {t('projects.detail.access.title')}
      </h2>
      <Card withBorder padding="xl" radius="md">
        <div className="flex justify-center p-6">
          <div className="text-center">
            <Lock size={48} strokeWidth={1.5} className="mx-auto opacity-50" />
            <p className="text-gray-500 mt-4">
              {t('projects.detail.access.coming_soon')}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}









