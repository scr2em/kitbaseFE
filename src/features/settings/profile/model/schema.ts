import { z } from 'zod';

export const updateProfileSchema = z.object({
  firstName: z.string().min(2, 'validation.first_name_required'),
  lastName: z.string().min(2, 'validation.last_name_required'),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

