import { useCurrentUserQuery } from '../api/queries/user';
import type { PermissionCode } from '../../generated-api';

/**
 * Hook to check if the user has specific permissions in the current organization
 * @returns Object with permission checker function and individual permission flags
 * 
 * @example
 * const { hasPermission, canCreateApp, canUpdateOrganization } = usePermissions();
 * 
 * if (canCreateApp) {
 *   // Show create button
 * }
 * 
 * // Or dynamically check
 * if (hasPermission('app.delete')) {
 *   // Show delete button
 * }
 */
export function usePermissions() {
  const { data: user } = useCurrentUserQuery();
  const permissions = user?.currentOrganizationRole?.permissions || [];

  const hasPermission = (permission: PermissionCode) => {
    return permissions.includes(permission);
  };

  return {
    hasPermission,
    // Organization permissions
    canUpdateOrganization: hasPermission('organization.update'),
    // Member permissions
    canViewMember: hasPermission('member.view'),
    canInviteMember: hasPermission('member.invite'),
    canRemoveMember: hasPermission('member.remove'),
    canUpdateMemberRole: hasPermission('member.update_role'),
    // App permissions
    canReadApp: hasPermission('app.read'),
    canCreateApp: hasPermission('app.create'),
    canUpdateApp: hasPermission('app.update'),
    canDeleteApp: hasPermission('app.delete'),
    // Channel permissions
    canReadChannel: hasPermission('channel.read'),
    canCreateChannel: hasPermission('channel.create'),
    canUpdateChannel: hasPermission('channel.update'),
    canDeleteChannel: hasPermission('channel.delete'),
    // Webhook permissions
    canViewWebhook: hasPermission('webhook.view'),
    canCreateWebhook: hasPermission('webhook.create'),
    canUpdateWebhook: hasPermission('webhook.update'),
    canDeleteWebhook: hasPermission('webhook.delete'),
    // Analytics & Support
    canViewAnalytics: hasPermission('analytics.view'),
    canOperateSupport: hasPermission('support.operations'),
  };
}