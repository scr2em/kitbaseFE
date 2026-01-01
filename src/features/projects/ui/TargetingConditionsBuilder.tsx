import { Button, Select, TextInput, SegmentedControl, ActionIcon } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Users } from 'lucide-react';
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
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-amber-50 flex items-center justify-center">
            <Users size={16} className="text-amber-600" />
          </div>
          <div>
            <span className="text-sm font-medium text-slate-700">
              {t('ota_updates.targeting.title')}
            </span>
            <span className="text-xs text-slate-400 ml-2">
              ({t('ota_updates.targeting.optional')})
            </span>
          </div>
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

      {/* Description when no conditions */}
      {!hasConditions && (
        <p className="text-sm text-slate-400 ml-11">
          {t('ota_updates.targeting.description')}
        </p>
      )}

      {/* Conditions Builder */}
      {hasConditions && (
        <div className="ml-11 space-y-4">
          {/* Operator Selection */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
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
          <div className="space-y-2">
            {value?.conditions.map((condition, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100"
              >
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="relative">
                    <TextInput
                      placeholder={t('ota_updates.targeting.field_placeholder')}
                      value={condition.field}
                      onChange={(e) => handleConditionChange(index, 'field', e.target.value)}
                      size="sm"
                      list={`field-suggestions-${index}`}
                    />
                    <datalist id={`field-suggestions-${index}`}>
                      {FIELD_SUGGESTIONS.map((suggestion) => (
                        <option key={suggestion} value={suggestion} />
                      ))}
                    </datalist>
                  </div>

                  <Select
                    data={operatorOptions}
                    value={condition.op}
                    onChange={(val) => val && handleConditionChange(index, 'op', val)}
                    size="sm"
                    allowDeselect={false}
                  />

                  <TextInput
                    placeholder={t('ota_updates.targeting.value_placeholder')}
                    value={condition.value}
                    onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                    size="sm"
                  />
                </div>

                <ActionIcon
                  variant="subtle"
                  color="red"
                  size="md"
                  onClick={() => handleRemoveCondition(index)}
                >
                  <Trash2 size={16} />
                </ActionIcon>
              </div>
            ))}
          </div>

          {/* Add Another Condition */}
          <Button
            type="button"
            variant="subtle"
            size="xs"
            leftSection={<Plus size={14} />}
            onClick={handleAddCondition}
          >
            {t('ota_updates.targeting.add_condition')}
          </Button>
        </div>
      )}
    </div>
  );
}
