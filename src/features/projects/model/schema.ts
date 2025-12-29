import { z } from 'zod';

export const createProjectSchema = z.object({
  projectKey: z
    .string()
    .min(1, 'projects.create.validation.project_key_required')
    .regex(
      /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$/i,
      'projects.create.validation.project_key_invalid'
    ),
  name: z.string().min(1, 'projects.create.validation.name_required'),
  description: z.string().optional(),
});

export type CreateProjectFormData = z.infer<typeof createProjectSchema>;



