import { AppShell, Avatar, Menu, ActionIcon, rem, NavLink, ScrollArea, ThemeIcon, Divider } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Building,
  Users,
  Settings,
  User,
  LogOut,
  Bell,
  Menu as MenuIcon,
  Folder,
  Radio,
  Plus,
  ChevronDown,
  Check,
} from 'lucide-react';
import { useAuth } from '../lib/auth/AuthContext';
import { useCurrentUserQuery } from '../api/queries/user';
import { usePermissions, useCurrentOrganization } from '../hooks';
import { CreateOrganizationModal } from '../../features/organization/create-organization';

export function AppLayout() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const [createOrgModalOpened, { open: openCreateOrgModal, close: closeCreateOrgModal }] = useDisclosure(false);
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { data: user } = useCurrentUserQuery();
  const { currentOrganization, hasOrganizations, organizations } = useCurrentOrganization();
  const permissions = usePermissions();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSwitchOrganization = (subdomain: string) => {
    const protocol = window.location.protocol;
    
  
      // Construct the URL with the subdomain
      const domain = import.meta.env.VITE_APP_DOMAIN;
      const url = `${protocol}//${subdomain}.${domain}/dashboard`;
      window.open(url, '_self');
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const navigationItems = [
    {
      icon: LayoutDashboard,
      label: t('navigation.dashboard'),
      path: '/dashboard',
      permission: null, // Dashboard is accessible to all
    },
    {
      icon: Folder,
      label: t('navigation.apps'),
      path: '/apps',
      permission: permissions.canReadApp,
    },
    {
      icon: Radio,
      label: t('navigation.channels'),
      path: '/channels',
      permission: null, // Channels are accessible to all organization members
    },
    {
      icon: Users,
      label: t('navigation.team'),
      path: '/team',
      permission: permissions.canViewMember,
    },
    {
      icon: Building,
      label: t('navigation.organization'),
      path: '/organization',
      permission: null, // Organization view is accessible to all members
    },
  ];

  // Filter navigation items based on user permissions
  const visibleNavigationItems = navigationItems.filter((item) => item.permission === null || item.permission);

  // Add create organization button if user doesn't have organizations
  const createOrgItem = !hasOrganizations ? {
    icon: Plus,
    label: t('dashboard.create_organization'),
    path: '/create-organization',
    permission: null,
    isCreateOrg: true,
  } : null;

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
      bg="gray.0"
    >
      <AppShell.Header>
        <div className="h-full px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ActionIcon
              onClick={toggleMobile}
              hiddenFrom="sm"
              size="lg"
              variant="subtle"
            >
              <MenuIcon size={20} />
            </ActionIcon>
            <ActionIcon
              onClick={toggleDesktop}
              visibleFrom="sm"
              size="lg"
              variant="subtle"
            >
              <MenuIcon size={20} />
            </ActionIcon>
            <div className="flex items-center gap-2">
              <ThemeIcon
                size={36}
                radius="md"
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
              >
                <Building size={20} />
              </ThemeIcon>
              <span className="text-lg font-bold">
                Kitbase
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ActionIcon variant="light" size="lg" radius="md">
              <Bell size={20} />
            </ActionIcon>

            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Avatar
                  size={36}
                  radius="xl"
                  color="blue"
                  className="cursor-pointer"
                >
                  {user ? getInitials(user.firstName, user.lastName) : ''}
                </Avatar>
              </Menu.Target>

              <Menu.Dropdown>
                {user && (
                  <Menu.Label>
                    {user.firstName} {user.lastName}
                  </Menu.Label>
                )}
                <Menu.Item
                  leftSection={<User style={{ width: rem(14), height: rem(14) }} />}
                  onClick={() => navigate('/profile')}
                >
                  {t('navigation.profile')}
                </Menu.Item>
                <Menu.Item
                  leftSection={<Settings style={{ width: rem(14), height: rem(14) }} />}
                  onClick={() => navigate('/settings')}
                >
                  {t('navigation.settings')}
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={<LogOut style={{ width: rem(14), height: rem(14) }} />}
                  onClick={handleLogout}
                >
                  {t('auth.logout')}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        </div>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow component={ScrollArea}>
          <div>
            {visibleNavigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <NavLink
                  key={item.path}
                  label={item.label}
                  leftSection={<Icon size={20} />}
                  active={isActive}
                  onClick={() => navigate(item.path)}
                  mb="xs"
                  style={{ borderRadius: 'var(--mantine-radius-md)' }}
                />
              );
            })}
            
            {/* Create Organization Button */}
            {createOrgItem && (
              <NavLink
                key={createOrgItem.path}
                label={createOrgItem.label}
                leftSection={<Plus size={20} />}
                active={location.pathname === createOrgItem.path}
                onClick={() => navigate(createOrgItem.path)}
                mb="xs"
                style={{ 
                  borderRadius: 'var(--mantine-radius-md)',
                  backgroundColor: 'var(--mantine-color-blue-0)',
                  border: '1px dashed var(--mantine-color-blue-3)',
                }}
                styles={{
                  label: {
                    color: 'var(--mantine-color-blue-6)',
                    fontWeight: 500,
                  }
                }}
              />
            )}
          </div>
        </AppShell.Section>

        <AppShell.Section>
          <div
            className="p-4"
            style={{
              borderTop: '1px solid var(--mantine-color-gray-3)',
            }}
          >
            {hasOrganizations ? (
              <Menu shadow="md" width={260} position="top">
                <Menu.Target>
                  <div
                    className="cursor-pointer p-3 rounded-md"
                    style={{
                      backgroundColor: 'var(--mantine-color-gray-0)',
                      border: '1px solid var(--mantine-color-gray-3)',
                    }}
                  >
                    <div className="flex gap-3 justify-between items-center">
                      <div className="flex gap-3 items-center flex-1 min-w-0">
                        <ThemeIcon color="violet" variant="light" size="lg" radius="md">
                          <Building size={18} />
                        </ThemeIcon>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">
                            {currentOrganization?.organization.name || t('navigation.no_organizations')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {t('navigation.organization_info')}
                          </p>
                        </div>
                      </div>
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>{t('navigation.switch_organization')}</Menu.Label>
                  {organizations.map((membership) => (
                    <Menu.Item
                      key={membership.organization.id}
                      leftSection={<Building size={14} />}
                      rightSection={
                        currentOrganization?.organization.id === membership.organization.id ? (
                          <Check size={14} />
                        ) : null
                      }
                      onClick={() => handleSwitchOrganization(membership.organization.subdomain)}
                      bg={
                        currentOrganization?.organization.id === membership.organization.id
                          ? 'var(--mantine-color-blue-0)'
                          : undefined
                      }
                    >
                      <span className="text-sm font-medium">
                        {membership.organization.name}
                      </span>
                    </Menu.Item>
                  ))}
                  <Divider my="xs" />
                  <Menu.Item
                    leftSection={<Plus size={14} />}
                    onClick={openCreateOrgModal}
                    c="blue"
                  >
                    {t('navigation.create_new_organization')}
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <div
                className="cursor-pointer p-3 rounded-md"
                style={{
                  backgroundColor: 'var(--mantine-color-blue-0)',
                  border: '1px dashed var(--mantine-color-blue-3)',
                }}
                onClick={openCreateOrgModal}
              >
                <div className="flex gap-3 items-center">
                  <ThemeIcon color="blue" variant="light" size="lg" radius="md">
                    <Plus size={18} />
                  </ThemeIcon>
                  <span className="text-sm font-medium text-blue-600">
                    {t('navigation.create_new_organization')}
                  </span>
                </div>
              </div>
            )}
          </div>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>

      <CreateOrganizationModal
        opened={createOrgModalOpened}
        onClose={closeCreateOrgModal}
      />
    </AppShell>
  );
}
