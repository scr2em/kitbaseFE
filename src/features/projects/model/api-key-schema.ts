import { z } from 'zod';

export const createApiKeySchema = z.object({
  name: z.string().min(1, 'projects.detail.api_keys.create.validation.name_required'),
});

export type CreateApiKeyFormData = z.infer<typeof createApiKeySchema>;










