import { Button, Card, Select, NumberInput, Badge, ActionIcon } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { Plus, GripVertical, Trash2, Users, Percent, Save } from 'lucide-react';
import { useUpdateFeatureFlagRulesMutation } from '../../../shared/api/queries/feature-flags';
import { useFeatureFlagSegmentsInfiniteQuery } from '../../../shared/api/queries/feature-flag-segments';
import { useShowBackendError } from '../../../shared/hooks';
import { FlagValueInput } from './FlagValueInput';
import type { FeatureFlagRuleResponse, FeatureFlagValueTypeEnum } from '../../../generated-api';

interface FlagRulesBuilderProps {
  projectKey: string;
  environmentId: string;
  flagKey: string;
  rules: FeatureFlagRuleResponse[];
  valueType: FeatureFlagValueTypeEnum;
}

interface EditableRule {
  id: string;
  segmentId?: string;
  segmentName?: string;
  rolloutPercentage?: number;
  enabled: boolean;
  value?: unknown;
  isNew?: boolean;
}

export function FlagRulesBuilder({
  projectKey,
  environmentId,
  flagKey,
  rules,
  valueType,
}: FlagRulesBuilderProps) {
  const { t } = useTranslation();
  const { showError } = useShowBackendError();

  // Transform rules to editable format
  const initialRules: EditableRule[] = rules.map((rule) => ({
    id: rule.id,
    segmentId: rule.segment?.id,
    segmentName: rule.segment?.name,
    rolloutPercentage: rule.rolloutPercentage,
    enabled: rule.enabled,
    value: rule.value,
  }));

  const [editableRules, setEditableRules] = useState<EditableRule[]>(initialRules);
  const [hasChanges, setHasChanges] = useState(false);

  const { data: segmentsData } = useFeatureFlagSegmentsInfiniteQuery(projectKey, environmentId);
  const updateRulesMutation = useUpdateFeatureFlagRulesMutation(projectKey, environmentId, flagKey);

  const segments = segmentsData?.pages.flatMap((page) => page.data) || [];

  const segmentOptions = [
    { value: '', label: t('feature_flags.rules.all_users') },
    ...segments.map((segment) => ({
      value: segment.id,
      label: segment.name,
    })),
  ];

  const handleAddRule = () => {
    const newRule: EditableRule = {
      id: `new-${Date.now()}`,
      segmentId: undefined,
      rolloutPercentage: 100,
      enabled: true,
      value: getDefaultValue(valueType),
      isNew: true,
    };
    setEditableRules([...editableRules, newRule]);
    setHasChanges(true);
  };

  const handleRemoveRule = (ruleId: string) => {
    setEditableRules(editableRules.filter((r) => r.id !== ruleId));
    setHasChanges(true);
  };

  const handleRuleChange = (ruleId: string, updates: Partial<EditableRule>) => {
    setEditableRules(
      editableRules.map((rule) =>
        rule.id === ruleId ? { ...rule, ...updates } : rule
      )
    );
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      await updateRulesMutation.mutateAsync({
        rules: editableRules.map((rule) => ({
          segmentId: rule.segmentId || undefined,
          rolloutPercentage: rule.rolloutPercentage,
          enabled: rule.enabled,
          value: rule.value,
        })),
      });
      notifications.show({
        title: t('common.success'),
        message: t('feature_flags.rules.save_success'),
        color: 'green',
      });
      setHasChanges(false);
    } catch (error) {
      showError(error);
    }
  };

  const handleMoveRule = (index: number, direction: 'up' | 'down') => {
    const newRules = [...editableRules];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newRules.length) return;
    const temp = newRules[index];
    newRules[index] = newRules[newIndex]!;
    newRules[newIndex] = temp!;
    setEditableRules(newRules);
    setHasChanges(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">{t('feature_flags.rules.title')}</h3>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Button
              size="xs"
              leftSection={<Save size={14} />}
              onClick={handleSave}
              loading={updateRulesMutation.isPending}
            >
              {t('feature_flags.rules.save_changes')}
            </Button>
          )}
          <Button
            size="xs"
            variant="light"
            leftSection={<Plus size={14} />}
            onClick={handleAddRule}
          >
            {t('feature_flags.rules.add_rule')}
          </Button>
        </div>
      </div>

      <p className="text-sm text-slate-500">{t('feature_flags.rules.description')}</p>

      {editableRules.length === 0 ? (
        <Card withBorder p="md" radius="md" className="bg-slate-50">
          <div className="flex flex-col items-center gap-3 py-4">
            <Users size={32} className="text-slate-400" />
            <p className="text-sm text-slate-500">{t('feature_flags.rules.no_rules')}</p>
            <Button
              size="xs"
              variant="light"
              leftSection={<Plus size={14} />}
              onClick={handleAddRule}
            >
              {t('feature_flags.rules.add_first_rule')}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {editableRules.map((rule, index) => (
            <Card key={rule.id} withBorder p="sm" radius="md" className="relative">
              <div className="flex items-start gap-3">
                {/* Drag Handle & Priority */}
                <div className="flex flex-col items-center gap-1 pt-2">
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => handleMoveRule(index, 'up')}
                      disabled={index === 0}
                      className="p-0.5 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                    >
                      <GripVertical size={14} />
                    </button>
                  </div>
                  <Badge size="xs" variant="light" color="gray">
                    #{index + 1}
                  </Badge>
                </div>

                {/* Rule Content */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Segment Selection */}
                  <div>
                    <Select
                      label={t('feature_flags.rules.segment_label')}
                      placeholder={t('feature_flags.rules.segment_placeholder')}
                      data={segmentOptions}
                      value={rule.segmentId || ''}
                      onChange={(val) => handleRuleChange(rule.id, { segmentId: val || undefined })}
                      size="xs"
                      leftSection={<Users size={14} />}
                    />
                  </div>

                  {/* Rollout Percentage */}
                  <div>
                    <NumberInput
                      label={t('feature_flags.rules.rollout_label')}
                      value={rule.rolloutPercentage ?? 100}
                      onChange={(val) =>
                        handleRuleChange(rule.id, {
                          rolloutPercentage: typeof val === 'number' ? val : 100,
                        })
                      }
                      min={0}
                      max={100}
                      size="xs"
                      leftSection={<Percent size={14} />}
                      suffix="%"
                    />
                  </div>

                  {/* Value */}
                  <div>
                    <FlagValueInput
                      value={rule.value}
                      onChange={(val) => handleRuleChange(rule.id, { value: val })}
                      valueType={valueType}
                      label={t('feature_flags.rules.value_label')}
                    />
                  </div>
                </div>

                {/* Remove Button */}
                <ActionIcon
                  variant="subtle"
                  color="red"
                  size="sm"
                  onClick={() => handleRemoveRule(rule.id)}
                  className="mt-6"
                >
                  <Trash2 size={14} />
                </ActionIcon>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Fallback Value Info */}
      <Card withBorder p="sm" radius="md" className="bg-blue-50 border-blue-200">
        <p className="text-xs text-blue-700">
          <strong>{t('feature_flags.rules.fallback_note_title')}</strong>{' '}
          {t('feature_flags.rules.fallback_note_description')}
        </p>
      </Card>
    </div>
  );
}

function getDefaultValue(valueType: FeatureFlagValueTypeEnum): unknown {
  switch (valueType) {
    case 'boolean':
      return true;
    case 'number':
      return 0;
    case 'json':
      return {};
    case 'string':
    default:
      return '';
  }
}
