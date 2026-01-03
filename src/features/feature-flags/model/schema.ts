import { z } from 'zod';

// Feature Flag Value Types
export const featureFlagValueTypes = ['boolean', 'string', 'number', 'json'] as const;
export type FeatureFlagValueType = (typeof featureFlagValueTypes)[number];

// Feature Flag Operators for segment rules
export const featureFlagOperators = [
  'eq',
  'neq',
  'contains',
  'not_contains',
  'starts_with',
  'ends_with',
  'gt',
  'gte',
  'lt',
  'lte',
  'exists',
  'not_exists',
  'in',
  'not_in',
] as const;
export type FeatureFlagOperator = (typeof featureFlagOperators)[number];

// Create Feature Flag Schema
export const createFeatureFlagSchema = z.object({
  flagKey: z
    .string()
    .min(1, 'feature_flags.validation.flag_key_required')
    .max(100, 'feature_flags.validation.flag_key_max_length')
    .regex(/^[a-zA-Z][a-zA-Z0-9_-]*$/, 'feature_flags.validation.flag_key_pattern'),
  name: z
    .string()
    .min(1, 'feature_flags.validation.name_required')
    .max(255, 'feature_flags.validation.name_max_length'),
  description: z.string().max(1000, 'feature_flags.validation.description_max_length').optional(),
  valueType: z.enum(featureFlagValueTypes, { message: 'feature_flags.validation.value_type_required' }),
  defaultEnabled: z.boolean(),
  defaultValue: z.any().optional(),
});

export type CreateFeatureFlagFormData = z.infer<typeof createFeatureFlagSchema>;

// Update Feature Flag Schema
export const updateFeatureFlagSchema = z.object({
  name: z
    .string()
    .min(1, 'feature_flags.validation.name_required')
    .max(255, 'feature_flags.validation.name_max_length'),
  description: z.string().max(1000, 'feature_flags.validation.description_max_length').optional(),
  enabled: z.boolean(),
  value: z.any().optional(),
});

export type UpdateFeatureFlagFormData = z.infer<typeof updateFeatureFlagSchema>;

// Segment Rule Schema
export const segmentRuleSchema = z.object({
  field: z
    .string()
    .min(1, 'feature_flags.validation.segment_rule_field_required')
    .max(255, 'feature_flags.validation.segment_rule_field_max_length'),
  operator: z.enum(featureFlagOperators, { message: 'feature_flags.validation.segment_rule_operator_required' }),
  value: z.string().optional(),
});

export type SegmentRuleFormData = z.infer<typeof segmentRuleSchema>;

// Create Segment Schema
export const createSegmentSchema = z.object({
  name: z
    .string()
    .min(1, 'feature_flags.validation.segment_name_required')
    .max(255, 'feature_flags.validation.segment_name_max_length'),
  description: z.string().max(1000, 'feature_flags.validation.segment_description_max_length').optional(),
  rules: z
    .array(segmentRuleSchema)
    .min(1, 'feature_flags.validation.segment_rules_required'),
});

export type CreateSegmentFormData = z.infer<typeof createSegmentSchema>;

// Update Segment Schema
export const updateSegmentSchema = z.object({
  name: z
    .string()
    .min(1, 'feature_flags.validation.segment_name_required')
    .max(255, 'feature_flags.validation.segment_name_max_length'),
  description: z.string().max(1000, 'feature_flags.validation.segment_description_max_length').optional(),
  rules: z
    .array(segmentRuleSchema)
    .min(1, 'feature_flags.validation.segment_rules_required'),
});

export type UpdateSegmentFormData = z.infer<typeof updateSegmentSchema>;

// Flag Rule Schema (for targeting)
export const flagRuleSchema = z.object({
  segmentId: z.string().optional(),
  rolloutPercentage: z.number().min(0).max(100).optional(),
  enabled: z.boolean(),
  value: z.any().optional(),
});

export type FlagRuleFormData = z.infer<typeof flagRuleSchema>;

// Update Flag Rules Schema
export const updateFlagRulesSchema = z.object({
  rules: z.array(flagRuleSchema),
});

export type UpdateFlagRulesFormData = z.infer<typeof updateFlagRulesSchema>;
