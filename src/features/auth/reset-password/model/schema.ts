import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'validation.email_required').email('validation.email_invalid'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, 'validation.password_min'),
  confirmPassword: z.string().min(1, 'validation.confirm_password_required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'validation.passwords_must_match',
  path: ['confirmPassword'],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

