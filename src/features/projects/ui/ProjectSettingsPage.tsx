import {
  Card,
  Switch,
  Loader,
  Alert,
  Badge,
  Divider,
  Button,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { notifications } from '@mantine/notifications';
import {
  AlertCircle,
  Activity,
  Bell,
  Globe,
  Shield,
  Mail,
  Webhook,
  Clock,
  Database,
} from 'lucide-react';
import {
  useEventsStatusQuery,
  useUpdateEventsStatusMutation,
} from '../../../shared/api/queries/events';

interface SettingCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  badge?: {
    text: string;
    color: string;
  };
}

function SettingCard({ icon, title, description, children, badge }: SettingCardProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-500">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-slate-900">{title}</h4>
            {badge && (
              <Badge size="xs" color={badge.color} variant="light">
                {badge.text}
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function ProjectSettingsPage() {
  const { t } = useTranslation();
  const { projectKey } = useParams<{ projectKey: string }>();

  const { data: eventsStatus, isLoading, isError } = useEventsStatusQuery(projectKey || '');
  const updateEventsStatusMutation = useUpdateEventsStatusMutation(projectKey || '');

  const handleEventsStatusToggle = (enabled: boolean) => {
    updateEventsStatusMutation.mutate(enabled, {
      onSuccess: () => {
        notifications.show({
          title: t('common.success'),
          message: enabled
            ? t('project.settings.events.events_enabled_success')
            : t('project.settings.events.events_disabled_success'),
          color: 'green',
        });
      },
      onError: () => {
        notifications.show({
          title: t('common.error'),
          message: t('project.settings.events.update_error'),
          color: 'red',
        });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert icon={<AlertCircle size={16} />} title={t('common.error')} color="red">
        {t('project.settings.events.error_loading')}
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          {t('project.settings.title')}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {t('project.settings.subtitle')}
        </p>
      </div>

      {/* Events Settings */}
      <Card withBorder padding="lg" radius="md">
        <h3 className="text-base font-semibold text-slate-900 mb-2">
          {t('project.settings.events.title')}
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          {t('project.settings.events.description')}
        </p>

        <Divider className="mb-2" />

        <SettingCard
          icon={<Activity size={20} />}
          title={t('project.settings.events.event_logging.title')}
          description={t('project.settings.events.event_logging.description')}
        >
          <Switch
            checked={eventsStatus?.eventsEnabled ?? false}
            onChange={(event) => handleEventsStatusToggle(event.currentTarget.checked)}
            disabled={updateEventsStatusMutation.isPending}
            size="md"
            color="green"
          />
        </SettingCard>

        <Divider />

        <SettingCard
          icon={<Globe size={20} />}
          title={t('project.settings.events.ip_logging.title')}
          description={t('project.settings.events.ip_logging.description')}
          badge={{ text: t('common.coming_soon'), color: 'gray' }}
        >
          <Switch disabled size="md" />
        </SettingCard>

        <Divider />

        <SettingCard
          icon={<Clock size={20} />}
          title={t('project.settings.events.retention.title')}
          description={t('project.settings.events.retention.description')}
          badge={{ text: t('common.coming_soon'), color: 'gray' }}
        >
          <Button variant="light" size="xs" disabled>
            {t('project.settings.events.retention.configure')}
          </Button>
        </SettingCard>
      </Card>

      {/* Notification Settings */}
      <Card withBorder padding="lg" radius="md">
        <h3 className="text-base font-semibold text-slate-900 mb-2">
          {t('project.settings.notifications.title')}
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          {t('project.settings.notifications.description')}
        </p>

        <Divider className="mb-2" />

        <SettingCard
          icon={<Bell size={20} />}
          title={t('project.settings.notifications.in_app.title')}
          description={t('project.settings.notifications.in_app.description')}
          badge={{ text: t('common.coming_soon'), color: 'gray' }}
        >
          <Switch disabled size="md" />
        </SettingCard>

        <Divider />

        <SettingCard
          icon={<Mail size={20} />}
          title={t('project.settings.notifications.email.title')}
          description={t('project.settings.notifications.email.description')}
          badge={{ text: t('common.coming_soon'), color: 'gray' }}
        >
          <Button variant="light" size="xs" disabled>
            {t('project.settings.notifications.email.configure')}
          </Button>
        </SettingCard>

        <Divider />

        <SettingCard
          icon={<Webhook size={20} />}
          title={t('project.settings.notifications.webhook.title')}
          description={t('project.settings.notifications.webhook.description')}
        >
          <Button
            variant="light"
            size="xs"
            onClick={() => window.location.href = '/organization/webhooks'}
          >
            {t('project.settings.notifications.webhook.configure')}
          </Button>
        </SettingCard>
      </Card>

      {/* Privacy & Security */}
      <Card withBorder padding="lg" radius="md">
        <h3 className="text-base font-semibold text-slate-900 mb-2">
          {t('project.settings.privacy.title')}
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          {t('project.settings.privacy.description')}
        </p>

        <Divider className="mb-2" />

        <SettingCard
          icon={<Shield size={20} />}
          title={t('project.settings.privacy.anonymize.title')}
          description={t('project.settings.privacy.anonymize.description')}
          badge={{ text: t('common.coming_soon'), color: 'gray' }}
        >
          <Switch disabled size="md" />
        </SettingCard>

        <Divider />

        <SettingCard
          icon={<Database size={20} />}
          title={t('project.settings.privacy.data_export.title')}
          description={t('project.settings.privacy.data_export.description')}
          badge={{ text: t('common.coming_soon'), color: 'gray' }}
        >
          <Button variant="light" size="xs" disabled>
            {t('project.settings.privacy.data_export.export')}
          </Button>
        </SettingCard>
      </Card>
    </div>
  );
}

