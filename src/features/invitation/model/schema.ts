import { z } from 'zod';

export const inviteUserSchema = z.object({
  email: z.string().email('validation.email_invalid').min(1, 'validation.email_required'),
  role: z.string().min(1, 'validation.role_required'),
});

export type InviteUserFormData = z.infer<typeof inviteUserSchema>;

export const invitationSignupSchema = z.object({
  firstName: z.string().min(2, 'validation.first_name_required'),
  lastName: z.string().min(2, 'validation.last_name_required'),
  password: z.string().min(8, 'validation.password_min'),
  confirmPassword: z.string().min(1, 'validation.confirm_password_required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'validation.passwords_must_match',
  path: ['confirmPassword'],
});

export type InvitationSignupFormData = z.infer<typeof invitationSignupSchema>;

