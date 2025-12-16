import { 
  Button, 
  Card,
  Anchor,
  Burger,
  useMantineColorScheme,
  ActionIcon,
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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="h-[60px] border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto h-full px-4">
          <div className="flex justify-between items-center h-full">
            <h3 className="text-xl font-semibold text-[var(--mantine-color-brand-7)]">
              Kitbase
            </h3>
            
            <div className="hidden sm:flex items-center gap-4">
              <Anchor component={Link} to="#features" c="dimmed">
                {t('landing.navigation.features')}
              </Anchor>
              <Anchor component={Link} to="#pricing" c="dimmed">
                {t('landing.navigation.pricing')}
              </Anchor>
              <Anchor component={Link} to="#docs" c="dimmed">
                {t('landing.navigation.docs')}
              </Anchor>
            </div>

            <div className="flex items-center gap-2">
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={toggleColorScheme}
                size="lg"
                aria-label="Toggle color scheme"
              >
                {colorScheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </ActionIcon>
              
              <div className="flex items-center gap-2">
                <Button variant="subtle" component={Link} to="/login">
                  {t('landing.navigation.login')}
                </Button>
                <Button component={Link} to="/signup">
                  {t('landing.navigation.signup')}
                </Button>
              </div>

              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                hiddenFrom="sm"
                size="sm"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section
          className="min-h-[80vh] flex items-center py-16"
          style={{
            background: 'linear-gradient(135deg, var(--mantine-color-brand-0) 0%, var(--mantine-color-accent-0) 100%)',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col gap-6">
                <h1
                  className="text-4xl md:text-5xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, var(--mantine-color-brand-7) 0%, var(--mantine-color-accent-7) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {t('landing.hero.title')}
                </h1>
                
                <p className="text-xl text-gray-500 max-w-[500px]">
                  {t('landing.hero.subtitle')}
                </p>
                
                <div className="flex gap-4">
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
                </div>
              </div>
              
              <div
                className="p-6 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, var(--mantine-color-brand-1) 0%, var(--mantine-color-accent-1) 100%)',
                  border: '1px solid var(--mantine-color-brand-2)',
                  boxShadow: 'var(--mantine-shadow-lg)',
                }}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500 font-mono">
                      $ kitbase deploy --channel production
                    </p>
                    <p className="text-sm text-green-600 font-mono">
                      ✓ Build uploaded successfully
                    </p>
                    <p className="text-sm text-green-600 font-mono">
                      ✓ Channel updated
                    </p>
                    <p className="text-sm text-green-600 font-mono">
                      ✓ Team notified
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col gap-8 items-center">
              <div className="flex flex-col gap-4 items-center max-w-[600px]">
                <h2 className="text-3xl font-semibold text-center">
                  {t('landing.features.title')}
                </h2>
                <p className="text-lg text-gray-500 text-center">
                  {t('landing.features.subtitle')}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {features.map((feature, index) => (
                  <Card
                    key={index}
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    className="h-full hover:shadow-md transition-shadow"
                    style={{
                      border: '1px solid var(--mantine-color-gray-2)',
                    }}
                  >
                    <div className="flex flex-col gap-4 h-full">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: 'var(--mantine-color-brand-1)',
                        }}
                      >
                        <feature.icon size={24} color="var(--mantine-color-brand-7)" />
                      </div>
                      
                      <div className="flex flex-col gap-2 flex-1">
                        <h4 className="text-lg font-semibold">
                          {feature.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col gap-8 items-center">
              <div className="flex flex-col gap-4 items-center max-w-[600px]">
                <h2 className="text-3xl font-semibold text-center">
                  {t('landing.benefits.title')}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: 'var(--mantine-color-brand-1)',
                      }}
                    >
                      <benefit.icon size={20} color="var(--mantine-color-brand-7)" />
                    </div>
                    
                    <div className="flex flex-col gap-2 flex-1">
                      <h4 className="text-lg font-semibold">
                        {benefit.title}
                      </h4>
                      <p className="text-gray-500">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div
              className="p-8 rounded-xl text-center"
              style={{
                background: 'linear-gradient(135deg, var(--mantine-color-brand-1) 0%, var(--mantine-color-accent-1) 100%)',
                border: '1px solid var(--mantine-color-brand-2)',
              }}
            >
              <div className="flex flex-col gap-6 items-center max-w-[600px] mx-auto">
                <h2 className="text-3xl font-semibold text-center">
                  {t('landing.cta.title')}
                </h2>
                
                <p className="text-lg text-gray-500 text-center">
                  {t('landing.cta.subtitle')}
                </p>
                
                <Button
                  size="lg"
                  component={Link}
                  to="/signup"
                  leftSection={<Rocket size={20} />}
                >
                  {t('landing.cta.button')}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2024 Kitbase. All rights reserved.
            </p>
            
            <div className="flex gap-4">
              <Anchor size="sm" c="dimmed">
                Privacy Policy
              </Anchor>
              <Anchor size="sm" c="dimmed">
                Terms of Service
              </Anchor>
              <Anchor size="sm" c="dimmed">
                Support
              </Anchor>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
