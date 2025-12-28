import { z } from 'zod';

export const changelogSchema = z.object({
  version: z
    .string()
    .min(1, 'validation.version_required')
    .regex(/^\d+\.\d+\.\d+$/, 'validation.version_format'),
  markdown: z.string().min(1, 'validation.markdown_required'),
  is_published: z.boolean(),
});

export type ChangelogFormData = z.infer<typeof changelogSchema>;

export interface Changelog {
  id: string;
  version: string;
  markdown: string;
  is_published: boolean;
  projectKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChangelogListResponse {
  data: Changelog[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

