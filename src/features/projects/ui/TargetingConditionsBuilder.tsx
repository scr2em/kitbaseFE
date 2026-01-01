import { Button, Select, TextInput, SegmentedControl, ActionIcon, Card } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Filter } from 'lucide-react';
import type { TargetingConditions, TargetingCondition } from '../model/ota-update-schema';

interface TargetingConditionsBuilderProps {
  value?: TargetingConditions;
  onChange: (value: TargetingConditions | undefined) => void;
}

const FIELD_SUGGESTIONS = [
  'user_id',
  'device_id',
  'app_version',
  'os_version',
  'country',
  'language',
  'beta_tester',
];

export function TargetingConditionsBuilder({ value, onChange }: TargetingConditionsBuilderProps) {
  const { t } = useTranslation();

  const hasConditions = value && value.conditions && value.conditions.length > 0;

  const handleAddCondition = () => {
    const newCondition: TargetingCondition = {
      field: '',
      op: 'eq',
      value: '',
    };

    if (!value) {
      onChange({
        operator: 'and',
        conditions: [newCondition],
      });
    } else {
      onChange({
        ...value,
        conditions: [...value.conditions, newCondition],
      });
    }
  };

  const handleRemoveCondition = (index: number) => {
    if (!value) return;

    const newConditions = value.conditions.filter((_, i) => i !== index);
    
    if (newConditions.length === 0) {
      onChange(undefined);
    } else {
      onChange({
        ...value,
        conditions: newConditions,
      });
    }
  };

  const handleConditionChange = (index: number, field: keyof TargetingCondition, fieldValue: string) => {
    if (!value) return;

    const newConditions = value.conditions.map((condition, i) => {
      if (i === index) {
        return { ...condition, [field]: fieldValue };
      }
      return condition;
    });

    onChange({
      ...value,
      conditions: newConditions,
    });
  };

  const handleOperatorChange = (operator: string) => {
    if (!value) return;
    onChange({
      ...value,
      operator: operator as 'and' | 'or',
    });
  };

  const operatorOptions = [
    { value: 'eq', label: t('ota_updates.targeting.operator_eq') },
    { value: 'neq', label: t('ota_updates.targeting.operator_neq') },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-500" />
          <span className="text-sm font-medium text-slate-700">
            {t('ota_updates.targeting.title')}
          </span>
          <span className="text-xs text-slate-400">
            ({t('ota_updates.targeting.optional')})
          </span>
        </div>
        {!hasConditions && (
          <Button
            type="button"
            variant="light"
            size="xs"
            leftSection={<Plus size={14} />}
            onClick={handleAddCondition}
          >
            {t('ota_updates.targeting.add_condition')}
          </Button>
        )}
      </div>

      {hasConditions && (
        <Card withBorder padding="md" radius="md" className="bg-slate-50">
          <div className="flex flex-col gap-4">
            {/* Operator Selection */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600">
                {t('ota_updates.targeting.match_label')}
              </span>
              <SegmentedControl
                size="xs"
                value={value?.operator || 'and'}
                onChange={handleOperatorChange}
                data={[
                  { value: 'and', label: t('ota_updates.targeting.match_all') },
                  { value: 'or', label: t('ota_updates.targeting.match_any') },
                ]}
              />
              <span className="text-sm text-slate-600">
                {t('ota_updates.targeting.conditions_suffix')}
              </span>
            </div>

            {/* Conditions List */}
            <div className="flex flex-col gap-3">
              {value?.conditions.map((condition, index) => (
                <div key={index} className="flex items-center gap-2">
                  <TextInput
                    placeholder={t('ota_updates.targeting.field_placeholder')}
                    value={condition.field}
                    onChange={(e) => handleConditionChange(index, 'field', e.target.value)}
                    className="flex-1"
                    size="sm"
                    list={`field-suggestions-${index}`}
                  />
                  <datalist id={`field-suggestions-${index}`}>
                    {FIELD_SUGGESTIONS.map((suggestion) => (
                      <option key={suggestion} value={suggestion} />
                    ))}
                  </datalist>

                  <Select
                    data={operatorOptions}
                    value={condition.op}
                    onChange={(val) => val && handleConditionChange(index, 'op', val)}
                    className="w-32"
                    size="sm"
                    allowDeselect={false}
                  />

                  <TextInput
                    placeholder={t('ota_updates.targeting.value_placeholder')}
                    value={condition.value}
                    onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                    className="flex-1"
                    size="sm"
                  />

                  <ActionIcon
                    variant="subtle"
                    color="red"
                    size="sm"
                    onClick={() => handleRemoveCondition(index)}
                  >
                    <Trash2 size={14} />
                  </ActionIcon>
                </div>
              ))}
            </div>

            {/* Add Condition Button */}
            <Button
              type="button"
              variant="subtle"
              size="xs"
              leftSection={<Plus size={14} />}
              onClick={handleAddCondition}
              className="self-start"
            >
              {t('ota_updates.targeting.add_condition')}
            </Button>
          </div>
        </Card>
      )}

      {!hasConditions && (
        <p className="text-xs text-slate-400">
          {t('ota_updates.targeting.description')}
        </p>
      )}
    </div>
  );
}

