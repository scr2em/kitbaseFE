import {
  Card,
  Loader,
  Button,
  Alert,
  Badge,
  Switch,
  Checkbox,
  Accordion,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import {
  AlertCircle,
  ArrowLeft,
  Flag,
  Edit,
  Trash2,
  Clock,
  Code2,
} from 'lucide-react';
import {
  useFeatureFlagQuery,
  useUpdateFeatureFlagMutation,
  useDeleteFeatureFlagMutation,
} from '../../../shared/api/queries/feature-flags';
import { useShowBackendError } from '../../../shared/hooks';
import { UpdateFeatureFlagModal } from './UpdateFeatureFlagModal';
import { FlagRulesBuilder } from './FlagRulesBuilder';
import { CodeSnippet } from '../../../shared/components/CodeSnippet';
import { getFeatureFlagSnippets } from '../../../shared/lib/sdk-snippets';
import type { FeatureFlagResponse } from '../../../generated-api';

export function FeatureFlagDetailPage() {
  const { t } = useTranslation();
  const { projectKey, environmentId, flagKey } = useParams<{
    projectKey: string;
    environmentId: string;
    flagKey: string;
  }>();
  const navigate = useNavigate();

  const [updateModalOpened, setUpdateModalOpened] = useState(false);

  const { data: flag, isLoading, isError } = useFeatureFlagQuery(
    projectKey || '',
    environmentId || '',
    flagKey || ''
  );

  const updateMutation = useUpdateFeatureFlagMutation(
    projectKey || '',
    environmentId || '',
    flagKey || ''
  );
  const deleteMutation = useDeleteFeatureFlagMutation(projectKey || '', environmentId || '');
  const { showError } = useShowBackendError();

  const handleToggleEnabled = async () => {
    if (!flag) return;
    try {
      await updateMutation.mutateAsync({ enabled: !flag.enabled });
      notifications.show({
        title: t('common.success'),
        message: flag.enabled
          ? t('feature_flags.disabled_success')
          : t('feature_flags.enabled_success'),
        color: 'green',
      });
    } catch (error) {
      showError(error);
    }
  };

  const handleDelete = () => {
    if (!flag) return;
    let deleteAllEnvironments = false;
    modals.openConfirmModal({
      title: t('feature_flags.delete.title'),
      children: (
        <div className="flex flex-col gap-3">
          <p className="text-sm">
            {t('feature_flags.delete.confirmation', { name: flag.name })}
          </p>

          <Checkbox
            defaultChecked={false}
            label={t('feature_flags.delete.delete_all_environments_label')}
            description={t('feature_flags.delete.delete_all_environments_description')}
            onChange={(e) => {
              deleteAllEnvironments = e.currentTarget.checked;
            }}
          />
        </div>
      ),
      labels: { confirm: t('feature_flags.delete.confirm'), cancel: t('feature_flags.delete.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteMutation.mutateAsync({
            flagKey: flag.flagKey,
            deleteAllEnvironments,
          });
          notifications.show({
            title: t('common.success'),
            message: t('feature_flags.delete.success_message'),
            color: 'green',
          });
          navigate(`/projects/${projectKey}/${environmentId}/feature-flags`);
        } catch (error) {
          showError(error);
        }
      },
    });
  };

  const getValueTypeBadge = (valueType: string) => {
    const colorMap: Record<string, string> = {
      boolean: 'blue',
      string: 'green',
      number: 'orange',
      json: 'violet',
    };
    return (
      <Badge size="sm" variant="light" color={colorMap[valueType] || 'gray'}>
        {t(`feature_flags.value_types.${valueType}`)}
      </Badge>
    );
  };

  const formatValue = (value: unknown, valueType: string) => {
    if (value === null || value === undefined) {
      return <span className="text-slate-400">{t('feature_flags.no_value')}</span>;
    }
    if (valueType === 'boolean') {
      return value ? t('common.true') : t('common.false');
    }
    if (valueType === 'json') {
      return (
        <pre className="font-mono text-xs bg-slate-100 p-2 rounded overflow-auto max-h-40">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }
    return String(value);
  };

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (isError || !flag) {
    return (
      <div>
        <Alert
          icon={<AlertCircle size={16} />}
          title={t('common.error')}
          color="red"
        >
          {t('feature_flags.error_loading_detail')}
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/projects/${projectKey}/${environmentId}/feature-flags`)}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Flag size={24} className="text-slate-500" />
            <h1 className="text-xl font-semibold text-slate-900">{flag.name}</h1>
            {getValueTypeBadge(flag.valueType)}
          </div>
          <code className="text-sm text-slate-500 mt-1 block">{flag.flagKey}</code>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="light"
            leftSection={<Edit size={16} />}
            size="sm"
            onClick={() => setUpdateModalOpened(true)}
          >
            {t('feature_flags.actions.edit')}
          </Button>
          <Button
            variant="light"
            color="red"
            leftSection={<Trash2 size={16} />}
            size="sm"
            onClick={handleDelete}
          >
            {t('feature_flags.actions.delete')}
          </Button>
        </div>
      </div>

      {/* Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flag Info */}
        <Card withBorder radius="md" className="lg:col-span-1">
          <h3 className="font-semibold text-slate-900 mb-4">{t('feature_flags.detail.info')}</h3>
          
          <div className="flex flex-col gap-4">
            {/* Enabled Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">{t('feature_flags.detail.status')}</span>
              <Switch
                checked={flag.enabled}
                onChange={handleToggleEnabled}
                disabled={updateMutation.isPending}
                label={flag.enabled ? t('feature_flags.status.enabled') : t('feature_flags.status.disabled')}
              />
            </div>

            {/* Description */}
            {flag.description && (
              <div>
                <span className="text-sm text-slate-500">{t('feature_flags.form.description_label')}</span>
                <p className="text-sm mt-1">{flag.description}</p>
              </div>
            )}

            {/* Default Value */}
            <div>
              <span className="text-sm text-slate-500">{t('feature_flags.detail.default_value')}</span>
              <div className="mt-1">{formatValue(flag.value, flag.valueType)}</div>
            </div>

            {/* Timestamps */}
            <div className="border-t border-slate-100 pt-4 mt-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock size={14} />
                <span>
                  {t('feature_flags.detail.created_at', {
                    date: new Date(flag.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }),
                  })}
                </span>
              </div>
              {flag.updatedAt && (
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <Clock size={14} />
                  <span>
                    {t('feature_flags.detail.updated_at', {
                      date: new Date(flag.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }),
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Targeting Rules */}
        <Card withBorder radius="md" className="lg:col-span-2">
          <FlagRulesBuilder
            projectKey={projectKey || ''}
            environmentId={environmentId || ''}
            flagKey={flagKey || ''}
            rules={flag.rules || []}
            valueType={flag.valueType}
          />
        </Card>
      </div>

      {/* SDK Usage Code Snippet */}
      <Accordion variant="separated" radius="md" defaultValue="usage">
        <Accordion.Item value="usage">
          <Accordion.Control icon={<Code2 size={18} />}>
            <span className="font-medium">{t('code_snippet.usage_title')}</span>
          </Accordion.Control>
          <Accordion.Panel>
            <div className="flex flex-col gap-3">
              <p className="text-sm text-slate-600">
                {t('code_snippet.usage_description')}
              </p>
              <CodeSnippet 
                tabs={getFeatureFlagSnippets(undefined, flag.flagKey, flag.valueType)} 
              />
            </div>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      {/* Update Modal */}
      <UpdateFeatureFlagModal
        opened={updateModalOpened}
        onClose={() => setUpdateModalOpened(false)}
        projectKey={projectKey || ''}
        environmentId={environmentId || ''}
        flag={flag as FeatureFlagResponse}
      />
    </div>
  );
}
