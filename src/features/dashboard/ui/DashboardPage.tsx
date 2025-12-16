import {
  Paper,
  Button,
  Badge,
  Card,
  ThemeIcon,
  Loader,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import {
  Building,
  User,
  Settings,
  BarChart,
  Users,
  Folder,
} from 'lucide-react';
import { useCurrentUserQuery } from '../../../shared/api/queries/user';
import { useCurrentOrganization } from '../../../shared/hooks';
import { useNavigate } from 'react-router';

export function DashboardPage() {
  const { t } = useTranslation();
  const { data: user, isLoading } = useCurrentUserQuery();
  const { currentOrganization, hasOrganizations } = useCurrentOrganization();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <div className="flex flex-col gap-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {t('dashboard.welcome', { name: user.firstName })}
          </h1>
          <p className="text-lg text-gray-500">
            {t('dashboard.welcome_subtitle')}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card withBorder padding="lg" radius="md">
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">
                  {t('dashboard.stats.active_projects')}
                </p>
                <p className="text-xl font-bold">
                  12
                </p>
              </div>
              <ThemeIcon
                color="blue"
                variant="light"
                size={50}
                radius="md"
              >
                <Folder size={28} />
              </ThemeIcon>
            </div>
          </Card>

          <Card withBorder padding="lg" radius="md">
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">
                  {t('dashboard.stats.team_members')}
                </p>
                <p className="text-xl font-bold">
                  {hasOrganizations ? '8' : '1'}
                </p>
              </div>
              <ThemeIcon
                color="teal"
                variant="light"
                size={50}
                radius="md"
              >
                <Users size={28} />
              </ThemeIcon>
            </div>
          </Card>

          <Card withBorder padding="lg" radius="md">
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">
                  {t('dashboard.stats.revenue')}
                </p>
                <p className="text-xl font-bold">
                  $24.5k
                </p>
              </div>
              <ThemeIcon
                color="violet"
                variant="light"
                size={50}
                radius="md"
              >
                <BarChart size={28} />
              </ThemeIcon>
            </div>
          </Card>

          <Card withBorder padding="lg" radius="md">
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">
                  {t('dashboard.stats.organizations')}
                </p>
                <p className="text-xl font-bold">
                  {hasOrganizations ? '1' : '0'}
                </p>
              </div>
              <ThemeIcon
                color="orange"
                variant="light"
                size={50}
                radius="md"
              >
                <Building size={28} />
              </ThemeIcon>
            </div>
          </Card>
        </div>

        {/* User Info Card */}
        <Paper withBorder p="xl" radius="md">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">{t('dashboard.user_info')}</h3>
              <Badge
                size="lg"
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
              >
                {user.status.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card withBorder p="md" radius="md" bg="gray.0">
                <div className="flex items-center gap-3">
                  <ThemeIcon color="blue" variant="light" size="lg" radius="md">
                    <User size={20} />
                  </ThemeIcon>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-bold uppercase">
                      {t('dashboard.full_name')}
                    </p>
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                </div>
              </Card>

              <Card withBorder p="md" radius="md" bg="gray.0">
                <div className="flex items-center gap-3">
                  <ThemeIcon color="cyan" variant="light" size="lg" radius="md">
                    <User size={20} />
                  </ThemeIcon>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-bold uppercase">
                      {t('dashboard.email')}
                    </p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
              </Card>

              <Card withBorder p="md" radius="md" bg="gray.0">
                <div className="flex items-center gap-3">
                  <ThemeIcon color="violet" variant="light" size="lg" radius="md">
                    <Building size={20} />
                  </ThemeIcon>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-bold uppercase">
                      {t('dashboard.organization')}
                    </p>
                    <p className="font-medium">
                      {currentOrganization?.organization?.name || t('dashboard.no_organization')}
                    </p>
                  </div>
                </div>
              </Card>

              <Card withBorder p="md" radius="md" bg="gray.0">
                <div className="flex items-center gap-3">
                  <ThemeIcon color="teal" variant="light" size="lg" radius="md">
                    <User size={20} />
                  </ThemeIcon>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-bold uppercase">
                      {t('dashboard.created_at')}
                    </p>
                    <p className="font-medium">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Paper>

        {/* Quick Actions */}
        <Paper withBorder p="xl" radius="md">
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold">{t('dashboard.quick_actions')}</h3>
            <div className="flex flex-wrap gap-3">
              <Button
                leftSection={<User size={18} />}
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
                size="md"
                onClick={() => navigate('/profile')}
              >
                {t('dashboard.view_profile')}
              </Button>
              {!hasOrganizations && (
                <Button
                  leftSection={<Building size={18} />}
                  variant="light"
                  size="md"
                  onClick={() => navigate('/create-organization')}
                >
                  {t('dashboard.create_organization')}
                </Button>
              )}
              <Button
                leftSection={<Settings size={18} />}
                variant="outline"
                size="md"
                onClick={() => navigate('/settings')}
              >
                {t('navigation.settings')}
              </Button>
            </div>
          </div>
        </Paper>
      </div>
    </div>
  );
}
