import {
  Card,
  Button,
  Switch,
  Checkbox,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { notifications } from '@mantine/notifications';
import { ArrowLeft, Webhook } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateWebhookMutation } from '../../../shared/api/queries/webhooks';
import { useShowBackendError, usePageTitle } from '../../../shared/hooks';
import { createWebhookSchema, webhookEventTypes, type CreateWebhookFormData } from '../model/schema';
import { ControlledTextInput } from '../../../shared/controlled-form-fields';

export function CreateWebhookPage() {
  const { t } = useTranslation();
  usePageTitle(t('webhooks.create.page_title'));
  const navigate = useNavigate();
  const createWebhookMutation = useCreateWebhookMutation();
  const { showError } = useShowBackendError();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<CreateWebhookFormData>({
    resolver: zodResolver(createWebhookSchema),
    defaultValues: {
      name: '',
      url: '',
      secret: '',
      events: [],
      enabled: true,
    },
  });

  const selectedEvents = watch('events');
  const isEnabled = watch('enabled');

  const handleEventToggle = (event: typeof webhookEventTypes[number]) => {
    const currentEvents = selectedEvents || [];
    if (currentEvents.includes(event)) {
      setValue('events', currentEvents.filter((e) => e !== event));
    } else {
      setValue('events', [...currentEvents, event]);
    }
  };

  const formatEventName = (event: string) => {
    return event.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const onSubmit = async (data: CreateWebhookFormData) => {
    try {
      await createWebhookMutation.mutateAsync({
        name: data.name,
        url: data.url,
        secret: data.secret || undefined,
        events: data.events,
        enabled: data.enabled,
      });
      notifications.show({
        title: t('common.success'),
        message: t('webhooks.create.success_message'),
        color: 'green',
      });
      navigate('/organization/webhooks');
    } catch (error) {
      showError(error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
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
          <h1 className="text-xl font-semibold text-slate-900">
            {t('webhooks.create.page_title')}
          </h1>
          <p className="text-sm text-gray-500">
            {t('webhooks.create.page_subtitle')}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card withBorder radius="md" className="p-6">
          <div className="flex flex-col gap-6">
            {/* Name */}
            <ControlledTextInput
              control={control}
              name="name"
              label={t('webhooks.create.name_label')}
              placeholder={t('webhooks.create.name_placeholder')}
              withAsterisk
            />

            {/* URL */}
            <ControlledTextInput
              control={control}
              name="url"
              label={t('webhooks.create.url_label')}
              placeholder={t('webhooks.create.url_placeholder')}
              description={t('webhooks.create.url_description')}
              withAsterisk
            />

            {/* Secret */}
            <ControlledTextInput
              control={control}
              name="secret"
              label={t('webhooks.create.secret_label')}
              placeholder={t('webhooks.create.secret_placeholder')}
              description={t('webhooks.create.secret_description')}
            />

            {/* Events */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('webhooks.create.events_label')} <span className="text-red-500">*</span>
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
                onChange={(event) => setValue('enabled', event.currentTarget.checked)}
                size="md"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button
                variant="subtle"
                onClick={() => navigate('/organization/webhooks')}
              >
                {t('webhooks.create.cancel_button')}
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
              >
                {t('webhooks.create.submit_button')}
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}

