import { 
  Container, 
  Title, 
  Text, 
  Button, 
  Group, 
  Stack, 
  Grid, 
  Card, 
  Box,
  Anchor,
  AppShell,
  Burger,
  useMantineColorScheme,
  ActionIcon,
  rem
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { 
  Sun, 
  Moon, 
  Rocket, 
  Users, 
  Settings, 
  Code,
  Zap,
  Shield,
  TrendingUp
} from 'lucide-react';
import { useState } from 'react';

export function LandingPage() {
  const { t } = useTranslation();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [opened, setOpened] = useState(false);

  const features = [
    {
      icon: Rocket,
      title: t('landing.features.build_management.title'),
      description: t('landing.features.build_management.description'),
    },
    {
      icon: Settings,
      title: t('landing.features.channel_distribution.title'),
      description: t('landing.features.channel_distribution.description'),
    },
    {
      icon: Users,
      title: t('landing.features.team_collaboration.title'),
      description: t('landing.features.team_collaboration.description'),
    },
    {
      icon: Code,
      title: t('landing.features.api_integration.title'),
      description: t('landing.features.api_integration.description'),
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: t('landing.benefits.faster_deployments.title'),
      description: t('landing.benefits.faster_deployments.description'),
    },
    {
      icon: TrendingUp,
      title: t('landing.benefits.better_organization.title'),
      description: t('landing.benefits.better_organization.description'),
    },
    {
      icon: Users,
      title: t('landing.benefits.team_efficiency.title'),
      description: t('landing.benefits.team_efficiency.description'),
    },
    {
      icon: Shield,
      title: t('landing.benefits.reliable_platform.title'),
      description: t('landing.benefits.reliable_platform.description'),
    },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      padding={0}
    >
      <AppShell.Header>
        <Container size="xl" h="100%">
          <Group justify="space-between" h="100%">
            <Group>
              <Title order={3} c="brand.7">
                Kitbase
              </Title>
            </Group>
            
            <Group visibleFrom="sm">
              <Anchor component={Link} to="#features" c="dimmed">
                {t('landing.navigation.features')}
              </Anchor>
              <Anchor component={Link} to="#pricing" c="dimmed">
                {t('landing.navigation.pricing')}
              </Anchor>
              <Anchor component={Link} to="#docs" c="dimmed">
                {t('landing.navigation.docs')}
              </Anchor>
            </Group>

            <Group>
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={toggleColorScheme}
                size="lg"
                aria-label="Toggle color scheme"
              >
                {colorScheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </ActionIcon>
              
              <Group gap="xs">
                <Button variant="subtle" component={Link} to="/login">
                  {t('landing.navigation.login')}
                </Button>
                <Button component={Link} to="/signup">
                  {t('landing.navigation.signup')}
                </Button>
              </Group>

              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                hiddenFrom="sm"
                size="sm"
              />
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        {/* Hero Section */}
        <Box
          style={{
            background: 'linear-gradient(135deg, var(--mantine-color-brand-0) 0%, var(--mantine-color-accent-0) 100%)',
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Container size="xl">
            <Grid align="center" gutter="xl">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Stack gap="lg">
                  <Title
                    order={1}
                    size="h1"
                    fw={700}
                    style={{
                      background: 'linear-gradient(135deg, var(--mantine-color-brand-7) 0%, var(--mantine-color-accent-7) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {t('landing.hero.title')}
                  </Title>
                  
                  <Text size="xl" c="dimmed" maw={500}>
                    {t('landing.hero.subtitle')}
                  </Text>
                  
                  <Group gap="md">
                    <Button
                      size="lg"
                      component={Link}
                      to="/signup"
                      leftSection={<Rocket size={20} />}
                    >
                      {t('landing.hero.cta_primary')}
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      component={Link}
                      to="#features"
                    >
                      {t('landing.hero.cta_secondary')}
                    </Button>
                  </Group>
                </Stack>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Box
                  style={{
                    background: 'linear-gradient(135deg, var(--mantine-color-brand-1) 0%, var(--mantine-color-accent-1) 100%)',
                    borderRadius: 'var(--mantine-radius-xl)',
                    padding: 'var(--mantine-spacing-xl)',
                    border: '1px solid var(--mantine-color-brand-2)',
                    boxShadow: 'var(--mantine-shadow-lg)',
                  }}
                >
                  <Stack gap="md">
                    <Group>
                      <Box
                        style={{
                          width: rem(12),
                          height: rem(12),
                          borderRadius: '50%',
                          backgroundColor: 'var(--mantine-color-red-5)',
                        }}
                      />
                      <Box
                        style={{
                          width: rem(12),
                          height: rem(12),
                          borderRadius: '50%',
                          backgroundColor: 'var(--mantine-color-yellow-5)',
                        }}
                      />
                      <Box
                        style={{
                          width: rem(12),
                          height: rem(12),
                          borderRadius: '50%',
                          backgroundColor: 'var(--mantine-color-green-5)',
                        }}
                      />
                    </Group>
                    
                    <Stack gap="xs">
                      <Text size="sm" c="dimmed" ff="monospace">
                        $ kitbase deploy --channel production
                      </Text>
                      <Text size="sm" c="green" ff="monospace">
                        ✓ Build uploaded successfully
                      </Text>
                      <Text size="sm" c="green" ff="monospace">
                        ✓ Channel updated
                      </Text>
                      <Text size="sm" c="green" ff="monospace">
                        ✓ Team notified
                      </Text>
                    </Stack>
                  </Stack>
                </Box>
              </Grid.Col>
            </Grid>
          </Container>
        </Box>

        {/* Features Section */}
        <Container size="xl" py="xl">
          <Stack gap="xl" align="center">
            <Stack gap="md" align="center" maw={600}>
              <Title order={2} ta="center">
                {t('landing.features.title')}
              </Title>
              <Text size="lg" c="dimmed" ta="center">
                {t('landing.features.subtitle')}
              </Text>
            </Stack>
            
            <Grid gutter="xl">
              {features.map((feature, index) => (
                <Grid.Col key={index} span={{ base: 12, sm: 6, md: 3 }}>
                  <Card
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    h="100%"
                    style={{
                      border: '1px solid var(--mantine-color-gray-2)',
                      transition: 'all 0.2s ease',
                    }}
                    className="hover:shadow-md"
                  >
                    <Stack gap="md" h="100%">
                      <Box
                        style={{
                          width: rem(48),
                          height: rem(48),
                          borderRadius: 'var(--mantine-radius-md)',
                          backgroundColor: 'var(--mantine-color-brand-1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <feature.icon size={24} color="var(--mantine-color-brand-7)" />
                      </Box>
                      
                      <Stack gap="xs" style={{ flex: 1 }}>
                        <Title order={4}>
                          {feature.title}
                        </Title>
                        <Text size="sm" c="dimmed">
                          {feature.description}
                        </Text>
                      </Stack>
                    </Stack>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        </Container>

        {/* Benefits Section */}
        <Box
          style={{
            backgroundColor: 'var(--mantine-color-gray-0)',
          }}
        >
          <Container size="xl" py="xl">
            <Stack gap="xl" align="center">
              <Stack gap="md" align="center" maw={600}>
                <Title order={2} ta="center">
                  {t('landing.benefits.title')}
                </Title>
              </Stack>
              
              <Grid gutter="xl">
                {benefits.map((benefit, index) => (
                  <Grid.Col key={index} span={{ base: 12, sm: 6 }}>
                    <Group gap="md" align="flex-start">
                      <Box
                        style={{
                          width: rem(40),
                          height: rem(40),
                          borderRadius: 'var(--mantine-radius-md)',
                          backgroundColor: 'var(--mantine-color-brand-1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <benefit.icon size={20} color="var(--mantine-color-brand-7)" />
                      </Box>
                      
                      <Stack gap="xs" style={{ flex: 1 }}>
                        <Title order={4}>
                          {benefit.title}
                        </Title>
                        <Text c="dimmed">
                          {benefit.description}
                        </Text>
                      </Stack>
                    </Group>
                  </Grid.Col>
                ))}
              </Grid>
            </Stack>
          </Container>
        </Box>

        {/* CTA Section */}
        <Container size="xl" py="xl">
          <Box
            style={{
              background: 'linear-gradient(135deg, var(--mantine-color-brand-1) 0%, var(--mantine-color-accent-1) 100%)',
              borderRadius: 'var(--mantine-radius-xl)',
              padding: 'var(--mantine-spacing-xl)',
              border: '1px solid var(--mantine-color-brand-2)',
              textAlign: 'center',
            }}
          >
            <Stack gap="lg" align="center" maw={600} mx="auto">
              <Title order={2} ta="center">
                {t('landing.cta.title')}
              </Title>
              
              <Text size="lg" c="dimmed" ta="center">
                {t('landing.cta.subtitle')}
              </Text>
              
              <Button
                size="lg"
                component={Link}
                to="/signup"
                leftSection={<Rocket size={20} />}
              >
                {t('landing.cta.button')}
              </Button>
            </Stack>
          </Box>
        </Container>

        {/* Footer */}
        <Box
          style={{
            backgroundColor: 'var(--mantine-color-gray-1)',
            borderTop: '1px solid var(--mantine-color-gray-2)',
          }}
        >
          <Container size="xl" py="lg">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                © 2024 Kitbase. All rights reserved.
              </Text>
              
              <Group gap="md">
                <Anchor size="sm" c="dimmed">
                  Privacy Policy
                </Anchor>
                <Anchor size="sm" c="dimmed">
                  Terms of Service
                </Anchor>
                <Anchor size="sm" c="dimmed">
                  Support
                </Anchor>
              </Group>
            </Group>
          </Container>
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
