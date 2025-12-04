import { useRolePermissionsQuery } from '../api/queries/permission';
import { useCurrentOrganization } from './useCurrentOrganization';


/**
 * Convert permission code to camelCase property name
 * e.g., "mobile_app.create" -> "canCreateMobileApp"
 */
function permissionCodeToCamelCase(code: string): string {
  const parts = code.split('.');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    console.warn(`Invalid permission code format: ${code}`);
    return 'canUnknown';
  }
  
  const category = parts[0];
  const action = parts[1];
  const categoryParts = category.split('_');
  const actionParts = action.split('_');
  
  const camelCategory = categoryParts
    .map((part, index) => index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  
  const camelAction = actionParts
    .map((part, index) => index === 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  
  return `can${camelAction}${camelCategory.charAt(0).toUpperCase() + camelCategory.slice(1)}`;
}

/**
 * Hook to get all permissions as boolean values
 * @returns Object with all permissions as boolean values (e.g., { canCreateMobileApp: true, canDeleteMobileApp: false, ... })
 * 
 * @example
 * const { canCreateMobileApp, canDeleteMobileApp, canUpdateOrganization } = usePermissions();
 * 
 * if (canCreateMobileApp) {
 *   // Show create button
 * }
 */
export function usePermissions() {
  const { currentOrganization } = useCurrentOrganization();
  const roleId = currentOrganization?.role?.id;
  const { data: rolePermissions } = useRolePermissionsQuery(roleId);

  // Default all permissions to false
  const defaultPermissions = {
    canUpdateOrganization: false,
    canViewMember: false,
    canAddMember: false,
    canRemoveMember: false,
    canUpdateRoleMember: false,
    canViewRole: false,
    canCreateRole: false,
    canUpdateRole: false,
    canDeleteRole: false,
    canAssignPermissionsRole: false,
    canViewPermission: false,
    canViewInvitation: false,
    canCreateInvitation: false,
    canCancelInvitation: false,
    canViewUser: false,
    canUpdateUser: false,
    canDeleteUser: false,
    canCreateDeployment: false,
    canViewDeployment: false,
    canRollbackDeployment: false,
    canViewBilling: false,
    canManageBilling: false,
    canReadMobileApp: false,
    canCreateMobileApp: false,
    canUpdateMobileApp: false,
    canDeleteMobileApp: false,
    canViewBuild: false,
    canUploadBuild: false,
    canDeleteBuild: false,
    canViewApiKey: false,
    canCreateApiKey: false,
    canDeleteApiKey: false,
    canViewChannel: false,
    canCreateChannel: false,
    canUpdateChannel: false,
    canDeleteChannel: false,
  };

  // If we have role permissions, set them to true
  if (rolePermissions) {
    for (const permission of rolePermissions) {
      const key = permissionCodeToCamelCase(permission.code);
      if (key in defaultPermissions) {
        (defaultPermissions as Record<string, boolean>)[key] = true;
      }
    }
  }

  return defaultPermissions;
}