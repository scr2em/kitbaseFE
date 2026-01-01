import { z } from 'zod';

const targetingConditionSchema = z.object({
  field: z.string().min(1, 'ota_updates.validation.condition_field_required'),
  op: z.enum(['eq', 'neq']),
  value: z.string().min(1, 'ota_updates.validation.condition_value_required'),
});

const targetingConditionsSchema = z.object({
  operator: z.enum(['and', 'or']),
  conditions: z.array(targetingConditionSchema),
}).optional();

export const createOtaUpdateSchema = z.object({
  name: z.string().min(1, 'ota_updates.validation.name_required'),
  version: z.string().min(1, 'ota_updates.validation.version_required'),
  buildId: z.string().min(1, 'ota_updates.validation.build_required'),
  environmentId: z.string().min(1, 'ota_updates.validation.environment_required'),
  minNativeVersion: z.string().min(1, 'ota_updates.validation.min_native_version_required'),
  updateMode: z.enum(['force', 'silent', 'prompt'], { message: 'ota_updates.validation.update_mode_required' }),
  targetPlatform: z.enum(['ios', 'android', 'both'], { message: 'ota_updates.validation.target_platform_required' }),
  targetingConditions: targetingConditionsSchema,
});

export const updateOtaUpdateSchema = z.object({
  name: z.string().min(1, 'ota_updates.validation.name_required'),
  version: z.string().min(1, 'ota_updates.validation.version_required'),
  buildId: z.string().min(1, 'ota_updates.validation.build_required'),
  environmentId: z.string().min(1, 'ota_updates.validation.environment_required'),
  minNativeVersion: z.string().min(1, 'ota_updates.validation.min_native_version_required'),
  updateMode: z.enum(['force', 'silent', 'prompt'], { message: 'ota_updates.validation.update_mode_required' }),
  targetPlatform: z.enum(['ios', 'android', 'both'], { message: 'ota_updates.validation.target_platform_required' }),
  targetingConditions: targetingConditionsSchema,
});

export type TargetingCondition = z.infer<typeof targetingConditionSchema>;
export type TargetingConditions = z.infer<typeof targetingConditionsSchema>;
export type CreateOtaUpdateFormData = z.infer<typeof createOtaUpdateSchema>;
export type UpdateOtaUpdateFormData = z.infer<typeof updateOtaUpdateSchema>;
