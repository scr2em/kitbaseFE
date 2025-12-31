import { z } from 'zod';

export const webhookEventTypes = [
  'invitation_received',
  'build_completed',
  'member_joined',
  'member_removed',
  'log_rate_exceeded',
] as const;

export const createWebhookSchema = z.object({
  name: z.string().min(1, 'webhooks.validation.name_required').max(255),
  url: z.string().min(1, 'webhooks.validation.url_required').url('webhooks.validation.url_invalid'),
  secret: z.string().max(255).optional(),
  events: z.array(z.enum(webhookEventTypes)).min(1, 'webhooks.validation.events_required'),
  enabled: z.boolean(),
});

export const updateWebhookSchema = z.object({
  name: z.string().min(1, 'webhooks.validation.name_required').max(255).optional(),
  url: z.string().url('webhooks.validation.url_invalid').optional(),
  secret: z.string().max(255).optional(),
  events: z.array(z.enum(webhookEventTypes)).min(1, 'webhooks.validation.events_required').optional(),
  enabled: z.boolean().optional(),
});

export type CreateWebhookFormData = z.infer<typeof createWebhookSchema>;
export type UpdateWebhookFormData = z.infer<typeof updateWebhookSchema>;

