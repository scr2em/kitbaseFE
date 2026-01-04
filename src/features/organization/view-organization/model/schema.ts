import { z } from 'zod';

export const updateOrganizationSchema = z.object({
  name: z.string().min(1, 'validation.organization_name_required'),
  description: z.string().optional(),
  require2fa: z.boolean().optional(),
});

export type UpdateOrganizationFormData = z.infer<typeof updateOrganizationSchema>;
