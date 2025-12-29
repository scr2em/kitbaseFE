import { z } from 'zod';

export const projectTypeOptions = [
  { value: 'react', label: 'React' },
  { value: 'angular', label: 'Angular' },
  { value: 'vue', label: 'Vue' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'ionic', label: 'Ionic' },
  { value: 'flutter', label: 'Flutter' },
  { value: 'others', label: 'Others' },
] as const;

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
  projectType: z.enum(['react', 'angular', 'vue', 'nextjs', 'ionic', 'flutter', 'others'], {
    message: 'projects.create.validation.project_type_required',
  }),
});

export type CreateProjectFormData = z.infer<typeof createProjectSchema>;



