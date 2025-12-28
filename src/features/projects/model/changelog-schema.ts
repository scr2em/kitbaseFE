import { z } from 'zod';

export const changelogSchema = z.object({
  version: z
    .string()
    .min(1, 'validation.version_required')
    .regex(/^\d+\.\d+\.\d+$/, 'validation.version_format'),
  markdown: z.string().min(1, 'validation.markdown_required'),
  isPublished: z.boolean(),
});

export type ChangelogFormData = z.infer<typeof changelogSchema>;
