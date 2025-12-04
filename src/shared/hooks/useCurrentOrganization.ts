import { useMemo } from 'react';
import { useCurrentUserQuery } from '../api/queries/user';

/**
 * Hook to get the current organization based on the subdomain from the URL
 * @returns The current organization membership or null if not found
 */
export function useCurrentOrganization() {
  const { data: user, isLoading, isError } = useCurrentUserQuery();

  const currentOrganization = useMemo(() => {
    if (!user?.organizations || user.organizations.length === 0) {
      return null;
    }

    // Get subdomain from current URL
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];

    // If we're on localhost or the main domain, return the first organization
    if (hostname === 'localhost' || hostname === import.meta.env.VITE_APP_DOMAIN) {
      return user.organizations[0] || null;
    }

    // Find organization by subdomain
    const org = user.organizations.find(
      (membership) => 
        membership.organization.subdomain === subdomain
    );

    return org || null;
  }, [user?.organizations]);

  return {
    currentOrganization,
    isLoading,
    isError,
    hasOrganizations: user?.organizations && user.organizations.length > 0,
    organizations: user?.organizations || [],
  };
}
