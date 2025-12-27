import {
  Card,
  Loader,
  Button,
  Alert,
  Badge,
  Switch,
  Checkbox,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import {
  ArrowLeft,
  Webhook,
  AlertCircle,
  Trash2,
  Zap,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useWebhookQuery,
  useUpdateWebhookMutation,
  useDeleteWebhookMutation,
  useTestWebhookMutation,
} from '../../../shared/api/queries/webhooks';
import { useShowBackendError, usePageTitle } from '../../../shared/hooks';
import { updateWebhookSchema, webhookEventTypes, type UpdateWebhookFormData } from '../model/schema';
import { ControlledTextInput } from '../../../shared/controlled-form-fields';
import { WebhookDeliveriesSection } from './WebhookDeliveriesSection';

export function WebhookDetailPage() {
  const { t } = useTranslation();
  usePageTitle(t('webhooks.detail.page_title'));
  const { webhookId } = useParams<{ webhookId: string }>();
  const navigate = useNavigate();

  const { data: webhook, isLoading, isError } = useWebhookQuery(webhookId || '');
  const updateWebhookMutation = useUpdateWebhookMutation(webhookId || '');
  const deleteWebhookMutation = useDeleteWebhookMutation();
  const testWebhookMutation = useTestWebhookMutation(webhookId || '');
  const { showError } = useShowBackendError();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<UpdateWebhookFormData>({
    resolver: zodResolver(updateWebhookSchema),
    values: webhook ? {
      name: webhook.name,
      url: webhook.url,
      secret: '',
      events: webhook.events,
      enabled: webhook.enabled,
    } : undefined,
  });

  const selectedEvents = watch('events') || [];
  const isEnabled = watch('enabled');

  const handleEventToggle = (event: typeof webhookEventTypes[number]) => {
    const currentEvents = selectedEvents || [];
    if (currentEvents.includes(event)) {
      setValue('events', currentEvents.filter((e) => e !== event), { shouldDirty: true });
    } else {
      setValue('events', [...currentEvents, event], { shouldDirty: true });
    }
  };

  const formatEventName = (event: string) => {
    return event.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const onSubmit = async (data: UpdateWebhookFormData) => {
    try {
      await updateWebhookMutation.mutateAsync({
        name: data.name,
        url: data.url,
        secret: data.secret || undefined,
        events: data.events,
        enabled: data.enabled,
      });
      notifications.show({
        title: t('common.success'),
        message: t('webhooks.update.success_message'),
        color: 'green',
      });
      reset(data);
    } catch (error) {
      showError(error);
    }
  };

  const handleDelete = () => {
    if (!webhook) return;
    
    modals.openConfirmModal({
      title: t('webhooks.delete.title'),
      children: (
        <p className="text-sm">
          {t('webhooks.delete.confirmation', { name: webhook.name })}
        </p>
      ),
      labels: { confirm: t('webhooks.delete.confirm'), cancel: t('webhooks.delete.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteWebhookMutation.mutateAsync(webhook.id);
          notifications.show({
            title: t('common.success'),
            message: t('webhooks.delete.success_message'),
            color: 'green',
          });
          navigate('/organization/webhooks');
        } catch (error) {
          showError(error);
        }
      },
    });
  };

  const handleTestWebhook = async () => {
    try {
      const result = await testWebhookMutation.mutateAsync();
      if (result.success) {
        notifications.show({
          title: t('common.success'),
          message: t('webhooks.test.success_message'),
          color: 'green',
        });
      } else {
        notifications.show({
          title: t('common.warning'),
          message: t('webhooks.test.failed_message'),
          color: 'red',
        });
      }
    } catch (error) {
      showError(error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (isError || !webhook) {
    return (
      <div>
        <Alert
          icon={<AlertCircle size={16} />}
          title={t('common.error')}
          color="red"
        >
          {t('webhooks.error_loading')}
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/organization/webhooks')}
            className="p-1.5 -ml-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
            <Webhook size={18} className="text-white" strokeWidth={2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-slate-900">
                {webhook.name}
              </h1>
              <Badge
                variant="light"
                color={webhook.enabled ? 'green' : 'gray'}
                size="sm"
              >
                {webhook.enabled
                  ? t('webhooks.status.active')
                  : t('webhooks.status.disabled')}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                {webhook.url}
              </code>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="light"
            leftSection={<Zap size={16} />}
            onClick={handleTestWebhook}
            loading={testWebhookMutation.isPending}
          >
            {t('webhooks.test.button')}
          </Button>
          <Button
            variant="subtle"
            color="red"
            leftSection={<Trash2 size={16} />}
            onClick={handleDelete}
          >
            {t('webhooks.delete.menu_item')}
          </Button>
        </div>
      </div>

      {/* Update Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card withBorder radius="md" className="p-6">
          <h2 className="text-lg font-semibold mb-4">{t('webhooks.update.section_title')}</h2>
          <div className="flex flex-col gap-6">
            {/* Name */}
            <ControlledTextInput
              control={control}
              name="name"
              label={t('webhooks.create.name_label')}
              placeholder={t('webhooks.create.name_placeholder')}
            />

            {/* URL */}
            <ControlledTextInput
              control={control}
              name="url"
              label={t('webhooks.create.url_label')}
              placeholder={t('webhooks.create.url_placeholder')}
              description={t('webhooks.create.url_description')}
            />

            {/* Secret */}
            <ControlledTextInput
              control={control}
              name="secret"
              label={t('webhooks.update.secret_label')}
              placeholder={t('webhooks.update.secret_placeholder')}
              description={t('webhooks.update.secret_description')}
            />

            {/* Events */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('webhooks.create.events_label')}
              </label>
              <p className="text-sm text-gray-500 mb-3">
                {t('webhooks.create.events_description')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {webhookEventTypes.map((event) => (
                  <div
                    key={event}
                    className={`
                      p-4 rounded-lg border cursor-pointer transition-all
                      ${selectedEvents?.includes(event)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                      }
                    `}
                    onClick={() => handleEventToggle(event)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedEvents?.includes(event) || false}
                        onChange={() => handleEventToggle(event)}
                        readOnly
                      />
                      <div>
                        <p className="font-medium text-sm">
                          {formatEventName(event)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {t(`webhooks.events.${event}`)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enabled Switch */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
              <div>
                <p className="font-medium text-sm">
                  {t('webhooks.create.enabled_label')}
                </p>
                <p className="text-xs text-gray-500">
                  {t('webhooks.create.enabled_description')}
                </p>
              </div>
              <Switch
                checked={isEnabled}
                onChange={(event) => setValue('enabled', event.currentTarget.checked, { shouldDirty: true })}
                size="md"
              />
            </div>

            {/* Actions */}
            {isDirty && (
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button
                  variant="subtle"
                  onClick={() => reset()}
                >
                  {t('webhooks.update.cancel_button')}
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  variant="gradient"
                  gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
                >
                  {t('webhooks.update.submit_button')}
                </Button>
              </div>
            )}
          </div>
        </Card>
      </form>

      {/* Deliveries Section */}
      <WebhookDeliveriesSection webhookId={webhookId || ''} />
    </div>
  );
}

