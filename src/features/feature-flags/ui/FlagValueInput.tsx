import { TextInput, NumberInput, Switch, Textarea } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import type { FeatureFlagValueTypeEnum } from '../../../generated-api';

interface FlagValueInputProps {
  value: unknown;
  onChange: (value: unknown) => void;
  valueType: FeatureFlagValueTypeEnum;
  label?: string;
  error?: string;
}

export function FlagValueInput({
  value,
  onChange,
  valueType,
  label,
  error,
}: FlagValueInputProps) {
  const { t } = useTranslation();
  const [jsonError, setJsonError] = useState<string | null>(null);

  if (valueType === 'boolean') {
    return (
      <div className="flex flex-col gap-1">
        {label && <label className="text-sm font-medium">{label}</label>}
        <Switch
          checked={Boolean(value)}
          onChange={(e) => onChange(e.currentTarget.checked)}
          label={value ? t('common.true') : t('common.false')}
          error={error}
        />
      </div>
    );
  }

  if (valueType === 'number') {
    return (
      <NumberInput
        label={label}
        value={typeof value === 'number' ? value : 0}
        onChange={(val) => onChange(val)}
        error={error}
        placeholder={t('feature_flags.form.number_value_placeholder')}
      />
    );
  }

  if (valueType === 'json') {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
    
    const handleJsonChange = (val: string) => {
      try {
        const parsed = JSON.parse(val);
        setJsonError(null);
        onChange(parsed);
      } catch {
        setJsonError(t('feature_flags.form.invalid_json'));
        // Still update the raw value for editing
        onChange(val);
      }
    };

    return (
      <Textarea
        label={label}
        value={stringValue}
        onChange={(e) => handleJsonChange(e.currentTarget.value)}
        error={error || jsonError}
        placeholder={t('feature_flags.form.json_value_placeholder')}
        rows={5}
        styles={{
          input: {
            fontFamily: 'monospace',
            fontSize: '0.875rem',
          },
        }}
      />
    );
  }

  // Default: string
  return (
    <TextInput
      label={label}
      value={typeof value === 'string' ? value : String(value ?? '')}
      onChange={(e) => onChange(e.currentTarget.value)}
      error={error}
      placeholder={t('feature_flags.form.string_value_placeholder')}
    />
  );
}
