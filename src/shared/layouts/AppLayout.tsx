import { AppShell, Avatar, Menu, ActionIcon, rem, ScrollArea, ThemeIcon, Divider, Kbd, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Building,
  Settings,
  User,
  LogOut,
  Menu as MenuIcon,
  Folder,
  Plus,
  Check,
  Search,
} from 'lucide-react';
import { useAuth } from '../lib/auth/AuthContext';
import { useCurrentUserQuery } from '../api/queries/user';
import { usePermissions, useCurrentOrganization } from '../hooks';
import { CreateOrganizationModal } from '../../features/organization/create-organization';
import { NotificationDropdown } from '../components/NotificationDropdown';
import { spotlight } from '@mantine/spotlight';

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

  const navigationCategories = [
    {
      id: 'general',
      label: t('navigation.categories.general'),
      items: [
        {
          icon: LayoutDashboard,
          label: t('navigation.dashboard'),
          path: '/dashboard',
          permission: null, // Dashboard is accessible to all
        },
      ],
    },
    {
      id: 'product',
      label: t('navigation.categories.product'),
      items: [
        {
          icon: Folder,
          label: t('navigation.projects'),
          path: '/projects',
          permission: permissions.canReadProject,
        },
      ],
    },
    {
      id: 'administration',
      label: t('navigation.categories.administration'),
      items: [
        {
          icon: Building,
          label: t('navigation.organization'),
          path: '/organization',
          permission: null, // Organization view is accessible to all members
        },
      ],
    },
  ];

  // Filter navigation categories and their items based on user permissions
  const visibleNavigationCategories = navigationCategories
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => item.permission === null || item.permission),
    }))
    .filter((category) => category.items.length > 0);

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
        width: 72,
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
            {/* Global Search Button */}
            <button
              onClick={() => spotlight.open()}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Search size={16} />
              <span className="hidden sm:inline">{t('search.placeholder')}</span>
              <div className="hidden sm:flex items-center gap-0.5">
                <Kbd size="xs">⌘</Kbd>
                <Kbd size="xs">K</Kbd>
              </div>
            </button>

            <NotificationDropdown />

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

      <AppShell.Navbar p="xs">
        <AppShell.Section grow component={ScrollArea}>
          <div className="flex flex-col items-center gap-2">
            {visibleNavigationCategories.map((category) => (
              <div key={category.id} className="flex flex-col items-center gap-1 w-full">
                {category.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                  
                  return (
                    <Tooltip key={item.path} label={item.label} position="right" withArrow>
                      <ActionIcon
                        size="xl"
                        variant={isActive ? 'light' : 'subtle'}
                        color={isActive ? 'blue' : 'gray'}
                        onClick={() => navigate(item.path)}
                        radius="md"
                      >
                        <Icon size={22} />
                      </ActionIcon>
                    </Tooltip>
                  );
                })}
              </div>
            ))}
            
            {/* Create Organization Button */}
            {createOrgItem && (
              <Tooltip label={createOrgItem.label} position="right" withArrow>
                <ActionIcon
                  size="xl"
                  variant="light"
                  color="blue"
                  onClick={() => navigate(createOrgItem.path)}
                  radius="md"
                  style={{ 
                    border: '1px dashed var(--mantine-color-blue-3)',
                  }}
                >
                  <Plus size={22} />
                </ActionIcon>
              </Tooltip>
            )}
          </div>
        </AppShell.Section>

        <AppShell.Section>
          <div
            className="flex justify-center py-3"
            style={{
              borderTop: '1px solid var(--mantine-color-gray-3)',
            }}
          >
            {hasOrganizations ? (
              <Menu shadow="md" width={260} position="right-end">
                <Menu.Target>
                  <Tooltip label={currentOrganization?.organization.name || t('navigation.no_organizations')} position="right" withArrow>
                    <ActionIcon
                      size="xl"
                      variant="light"
                      color="violet"
                      radius="md"
                    >
                      <Building size={22} />
                    </ActionIcon>
                  </Tooltip>
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
              <Tooltip label={t('navigation.create_new_organization')} position="right" withArrow>
                <ActionIcon
                  size="xl"
                  variant="light"
                  color="blue"
                  radius="md"
                  onClick={openCreateOrgModal}
                  style={{
                    border: '1px dashed var(--mantine-color-blue-3)',
                  }}
                >
                  <Plus size={22} />
                </ActionIcon>
              </Tooltip>
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
