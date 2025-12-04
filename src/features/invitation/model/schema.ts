import { z } from 'zod';

export const inviteUserSchema = z.object({
  email: z.string().email('validation.email_invalid').min(1, 'validation.email_required'),
  role: z.string().min(1, 'validation.role_required'),
});

export type InviteUserFormData = z.infer<typeof inviteUserSchema>;

