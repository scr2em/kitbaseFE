import {
  Card,
  Loader,
  Alert,
  Badge,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft,
  Activity,
  AlertCircle,
  Clock,
  Tag,
  User,
  Key,
  Bell,
  FileText,
} from 'lucide-react';
import { useEventQuery } from '../../../shared/api/queries/events';

export function EventDetailPage() {
  const { t } = useTranslation();
  const { projectKey, eventId } = useParams<{ projectKey: string; eventId: string }>();
  const navigate = useNavigate();

  const { data: event, isLoading, isError } = useEventQuery(projectKey || '', eventId || '');

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div>
        <Alert
          icon={<AlertCircle size={16} />}
          title={t('common.error')}
          color="red"
        >
          {t('events.detail.error_loading')}
        </Alert>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/projects/${projectKey}/events`)}
          className="p-1.5 -ml-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
          {event.icon ? (
            <span className="text-lg">{event.icon}</span>
          ) : (
            <Activity size={20} className="text-white" strokeWidth={2} />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-slate-900">
              {event.event}
            </h1>
            {event.apiKeyName && (
              <Badge variant="light" color="blue" size="sm">
                {event.apiKeyName}
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-500">
            {formatDate(event.timestamp)}
          </p>
        </div>
      </div>

      {/* Event Details Card */}
      <Card withBorder radius="md" className="p-6">
        <h2 className="text-lg font-semibold mb-6">{t('events.detail.section_title')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Event Name */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0">
              <Activity size={16} className="text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                {t('events.detail.event_name')}
              </p>
              <p className="text-sm font-medium text-slate-900">{event.event}</p>
            </div>
          </div>

          {/* API Key */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0">
              <Key size={16} className="text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                {t('events.detail.api_key')}
              </p>
              {event.apiKeyName ? (
                <Badge variant="light" color="blue" size="sm">
                  {event.apiKeyName}
                </Badge>
              ) : (
                <p className="text-sm text-slate-400">{t('events.no_api_key')}</p>
              )}
            </div>
          </div>

          {/* Channel */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0">
              <Tag size={16} className="text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                {t('events.detail.channel')}
              </p>
              {event.channel ? (
                <Badge variant="outline" color="gray" size="sm">
                  {event.channel}
                </Badge>
              ) : (
                <p className="text-sm text-slate-400">{t('events.no_channel')}</p>
              )}
            </div>
          </div>

          {/* User ID */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0">
              <User size={16} className="text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                {t('events.detail.user_id')}
              </p>
              {event.userId ? (
                <code className="text-sm font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {event.userId}
                </code>
              ) : (
                <p className="text-sm text-slate-400">{t('events.no_user_id')}</p>
              )}
            </div>
          </div>

          {/* Timestamp */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0">
              <Clock size={16} className="text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                {t('events.detail.timestamp')}
              </p>
              <p className="text-sm text-slate-700">{formatDate(event.timestamp)}</p>
            </div>
          </div>

          {/* Notify */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0">
              <Bell size={16} className="text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                {t('events.detail.notifications')}
              </p>
              <Badge variant="light" color={event.notify ? 'green' : 'gray'} size="sm">
                {event.notify ? t('events.detail.notify_enabled') : t('events.detail.notify_disabled')}
              </Badge>
            </div>
          </div>
        </div>

        {/* Description */}
        {event.description && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0">
                <FileText size={16} className="text-slate-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                  {t('events.detail.description')}
                </p>
                <p className="text-sm text-slate-700">{event.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tags */}
        {event.tags && Object.keys(event.tags).length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
              {t('events.detail.tags')}
            </p>
            <Card withBorder radius="md" className="bg-slate-50">
              <pre className="text-xs text-slate-700 overflow-x-auto">
                {JSON.stringify(event.tags, null, 2)}
              </pre>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
}

