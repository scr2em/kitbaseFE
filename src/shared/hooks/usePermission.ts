import { useCurrentUserQuery } from '../api/queries/user';
import type { PermissionCode } from '../../generated-api';

/**
 * Hook to check if the user has specific permissions in the current organization
 * @returns Object with permission checker function and individual permission flags
 * 
 * @example
 * const { hasPermission, canCreateProject, canUpdateOrganization } = usePermissions();
 * 
 * if (canCreateProject) {
 *   // Show create button
 * }
 * 
 * // Or dynamically check
 * if (hasPermission('project.delete')) {
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
    // Project permissions
    canReadProject: hasPermission('project.read'),
    canCreateProject: hasPermission('project.create'),
    canUpdateProject: hasPermission('project.update'),
    canDeleteProject: hasPermission('project.delete'),
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
