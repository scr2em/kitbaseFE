import { z } from 'zod';

export const twoFactorVerifySchema = z.object({
  code: z
    .string()
    .min(6, 'validation.two_factor.code_min')
    .max(10, 'validation.two_factor.code_max'),
  type: z.enum(['totp', 'backup']),
});

export type TwoFactorVerifyFormData = z.infer<typeof twoFactorVerifySchema>;
