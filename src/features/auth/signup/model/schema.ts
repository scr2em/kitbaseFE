import { z } from 'zod';

export const initiateSignupSchema = z.object({
  email: z.string().min(1, 'validation.email_required').email('validation.email_invalid'),
});

export type InitiateSignupFormData = z.infer<typeof initiateSignupSchema>;

export const completeSignupSchema = z.object({
  firstName: z.string().min(2, 'validation.first_name_required'),
  lastName: z.string().min(2, 'validation.last_name_required'),
  password: z.string().min(8, 'validation.password_min'),
  confirmPassword: z.string().min(1, 'validation.confirm_password_required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'validation.passwords_must_match',
  path: ['confirmPassword'],
});

export type CompleteSignupFormData = z.infer<typeof completeSignupSchema>;

