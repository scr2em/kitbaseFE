import { z } from 'zod';

export const createEnvironmentSchema = z.object({
  name: z.string().min(1, 'environments.create.validation.name_required'),
  description: z.string().optional(),
});

export const updateEnvironmentSchema = z.object({
  name: z.string().min(1, 'environments.update.validation.name_required'),
  description: z.string().optional(),
});

export type CreateEnvironmentFormData = z.infer<typeof createEnvironmentSchema>;
export type UpdateEnvironmentFormData = z.infer<typeof updateEnvironmentSchema>;



