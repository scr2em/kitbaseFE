import { 
  Button, 
  Anchor,
  ActionIcon,
  Drawer,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { 
  Sun, 
  Moon, 
  Rocket, 
  Code,
  Zap,
  Shield,
  BarChart3,
  Smartphone,
  RefreshCw,
  Bell,
  Menu,
  ArrowRight,
  Github,
  ExternalLink,
} from 'lucide-react';
import { usePageTitle, useDarkMode } from '../../../shared/hooks';

export function LandingPage() {
  const { t } = useTranslation();
  usePageTitle(t('landing.page_title'));
  const { colorScheme, toggleColorScheme } = useDarkMode();
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);

  const features = [
    {
      icon: '📊',
      lucideIcon: BarChart3,
      title: t('landing.features.event_tracking.title'),
      description: t('landing.features.event_tracking.description'),
    },
    {
      icon: '📝',
      lucideIcon: RefreshCw,
      title: t('landing.features.ota_updates.title'),
      description: t('landing.features.ota_updates.description'),
    },
    {
      icon: '🔒',
      lucideIcon: Shield,
      title: t('landing.features.fully_typed.title'),
      description: t('landing.features.fully_typed.description'),
    },
    {
      icon: '📱',
      lucideIcon: Smartphone,
      title: t('landing.features.multi_platform.title'),
      description: t('landing.features.multi_platform.description'),
    },
    {
      icon: '🔔',
      lucideIcon: Bell,
      title: t('landing.features.notifications.title'),
      description: t('landing.features.notifications.description'),
    },
    {
      icon: '⚡',
      lucideIcon: Zap,
      title: t('landing.features.simple_integration.title'),
      description: t('landing.features.simple_integration.description'),
    },
  ];

  const stats = [
    { value: '10K+', label: t('landing.stats.events') },
    { value: '99.9%', label: t('landing.stats.uptime') },
    { value: '<50ms', label: t('landing.stats.latency') },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0a0a0f]">
      {/* Animated Background Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.08) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Gradient Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)' }}
        />
        <div 
          className="absolute top-1/2 -left-40 w-96 h-96 rounded-full blur-3xl opacity-15"
          style={{ background: 'linear-gradient(135deg, #f472b6 0%, #8b5cf6 100%)' }}
        />
      </div>

      {/* Header */}
      <header className="h-16 border-b sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-[#0a0a0f]/80 border-gray-100 dark:border-white/5">
        <div className="max-w-6xl mx-auto h-full px-4 sm:px-6">
          <div className="flex justify-between items-center h-full">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                <Rocket className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Kitbase
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Anchor 
                component={Link} 
                to="#features" 
                className="text-sm font-medium transition-colors text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                underline="never"
              >
                {t('landing.navigation.features')}
              </Anchor>
              <Anchor 
                href="https://docs.kitbase.dev" 
                target="_blank"
                className=" text-sm font-medium transition-colors flex items-center gap-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                underline="never"
                display="flex"
              >
                {t('landing.navigation.docs')}
             <div>   <ExternalLink className="w-3 h-3" /></div>
              </Anchor>
              <Anchor 
                component={Link} 
                to="#pricing" 
                className="text-sm font-medium transition-colors text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                underline="never"
              >
                {t('landing.navigation.pricing')}
              </Anchor>
            </nav>

            <div className="flex items-center gap-3">
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={toggleColorScheme}
                size="lg"
                radius="lg"
                aria-label="Toggle color scheme"
              >
                {colorScheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </ActionIcon>
              
              <div className="hidden sm:flex items-center gap-2">
                <Button 
                  variant="subtle" 
                  component={Link} 
                  to="/login"
                  color="dark"
                  radius="lg"
                >
                  {t('landing.navigation.login')}
                </Button>
                <Button 
                  component={Link} 
                  to="/signup"
                  radius="lg"
                  className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 border-0"
                >
                  {t('landing.navigation.signup')}
                </Button>
              </div>

              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={openDrawer}
                size="lg"
                radius="lg"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </ActionIcon>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        position="right"
        size="xs"
        title={
          <span className="font-bold text-gray-900 dark:text-white">
            Kitbase
          </span>
        }
      >
        <div className="flex flex-col gap-4 pt-4">
          <Anchor 
            component={Link} 
            to="#features" 
            onClick={closeDrawer}
            className="text-base font-medium text-gray-700 dark:text-gray-300"
            underline="never"
          >
            {t('landing.navigation.features')}
          </Anchor>
          <Anchor 
            href="https://docs.kitbase.dev" 
            target="_blank"
            className="text-base font-medium flex items-center gap-1 text-gray-700 dark:text-gray-300"
            underline="never"
          >
            {t('landing.navigation.docs')}
            <ExternalLink className="w-4 h-4" />
          </Anchor>
          <Anchor 
            component={Link} 
            to="#pricing" 
            onClick={closeDrawer}
            className="text-base font-medium text-gray-700 dark:text-gray-300"
            underline="never"
          >
            {t('landing.navigation.pricing')}
          </Anchor>
          <hr className="my-2 border-gray-200 dark:border-gray-800" />
          <Button 
            component={Link} 
            to="/login" 
            variant="subtle"
            fullWidth
            onClick={closeDrawer}
          >
            {t('landing.navigation.login')}
          </Button>
          <Button 
            component={Link} 
            to="/signup" 
            fullWidth
            onClick={closeDrawer}
            className="bg-gradient-to-r from-violet-500 to-cyan-500"
          >
            {t('landing.navigation.signup')}
          </Button>
        </div>
      </Drawer>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-8 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
                </span>
                {t('landing.hero.badge')}
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900 dark:text-white">
                <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
                  {t('landing.hero.title_gradient')}
                </span>
                <br />
                <span>{t('landing.hero.title_rest')}</span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 text-gray-600 dark:text-gray-400">
                {t('landing.hero.subtitle')}
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  component={Link}
                  to="/signup"
                  radius="lg"
                  rightSection={<ArrowRight size={18} />}
                  className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 border-0 px-8 h-12 text-base"
                >
                  {t('landing.hero.cta_primary')}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  component="a"
                  href="https://github.com/scr2em/kitbase-sdk"
                  target="_blank"
                  radius="lg"
                  leftSection={<Github size={18} />}
                  className="px-8 h-12 text-base border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {t('landing.hero.cta_secondary')}
                </Button>
              </div>
            </div>

            {/* Code Preview */}
            <div className="mt-16 sm:mt-20 max-w-2xl mx-auto">
              <div className="rounded-xl overflow-hidden shadow-2xl bg-gray-900 dark:bg-[#0d0d14] dark:border dark:border-white/10">
                {/* Window Controls */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800 dark:border-white/5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-3 text-sm text-gray-500 font-mono">
                    app.ts
                  </span>
                </div>
                
                {/* Code Content */}
                <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
                  <div>
                    <span className="text-fuchsia-400">import</span>
                    <span className="text-gray-300"> {'{ Kitbase }'} </span>
                    <span className="text-fuchsia-400">from</span>
                    <span className="text-green-400"> '@kitbase/sdk/events'</span>
                    <span className="text-gray-300">;</span>
                  </div>
                  
                  <div className="mt-4">
                    <span className="text-fuchsia-400">const</span>
                    <span className="text-gray-300"> kitbase = </span>
                    <span className="text-fuchsia-400">new</span>
                    <span className="text-cyan-400"> Kitbase</span>
                    <span className="text-gray-300">{'({'}</span>
                  </div>
                  <div className="pl-4 text-gray-300">
                    token: <span className="text-green-400">'&lt;YOUR_API_KEY&gt;'</span>,
                  </div>
                  <div className="text-gray-300">{'});'}</div>
                  
                  <div className="mt-4">
                    <span className="text-fuchsia-400">await</span>
                    <span className="text-gray-300"> kitbase.</span>
                    <span className="text-yellow-400">track</span>
                    <span className="text-gray-300">{'({'}</span>
                  </div>
                  <div className="pl-4 text-gray-300">
                    channel: <span className="text-green-400">'payments'</span>,
                  </div>
                  <div className="pl-4 text-gray-300">
                    event: <span className="text-green-400">'New Subscription'</span>,
                  </div>
                  <div className="pl-4 text-gray-300 ">
                    tags: {'{'}
                  </div>
                  <div className="pl-8 text-gray-300">
                    plan: <span className="text-green-400">'pro'</span>,
                  </div>
                  <div className="pl-8 text-gray-300">
                    source: <span className="text-green-400">'landing_page'</span>
                  </div>
                  <div className="pl-4 text-gray-300">{'}'}</div>
                  <div className="text-gray-300">{'});'}</div>
                  
                  <div className="mt-4 text-green-400">
                    ✓ Event tracked successfully
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-16 sm:mt-20 grid grid-cols-3 gap-8 max-w-xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold mb-1 text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 sm:py-28 bg-gray-50/50 dark:bg-[#0d0d14]/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                {t('landing.features.title')}
              </h2>
              <p className="text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
                {t('landing.features.subtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-6 rounded-xl transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:shadow-lg hover:shadow-gray-100/50 dark:hover:bg-white/[0.04] dark:hover:border-white/10 dark:hover:shadow-none"
                >
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Section */}
        <section className="py-20 sm:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                  {t('landing.integration.title')}
                </h2>
                <p className="text-lg mb-8 text-gray-600 dark:text-gray-400">
                  {t('landing.integration.description')}
                </p>
                <ul className="space-y-4">
                  {[
                    t('landing.integration.benefit_1'),
                    t('landing.integration.benefit_2'),
                    t('landing.integration.benefit_3'),
                    t('landing.integration.benefit_4'),
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-center gap-6 flex-wrap">
                {[
                  { name: 'React Native', icon: Code },
                  { name: 'Flutter', icon: Smartphone },
                  { name: 'TypeScript', icon: Code },
                  { name: 'REST API', icon: Zap },
                ].map((tech, index) => (
                  <div 
                    key={index}
                    className="flex flex-col items-center gap-3 p-6 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5"
                  >
                    <tech.icon className="w-8 h-8 text-violet-500 dark:text-violet-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-28 bg-gray-50/50 dark:bg-[#0d0d14]/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-2xl p-8 sm:p-12 text-center bg-gradient-to-br from-violet-50 to-cyan-50 dark:from-violet-500/10 dark:to-cyan-500/10 border border-violet-100/50 dark:border-white/10">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-500/20 to-transparent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cyan-500/20 to-transparent rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
              
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  {t('landing.cta.title')}
                </h2>
                <p className="text-lg mb-8 text-gray-600 dark:text-gray-400">
                  {t('landing.cta.subtitle')}
                </p>
                <Button
                  size="lg"
                  component={Link}
                  to="/signup"
                  radius="lg"
                  rightSection={<ArrowRight size={18} />}
                  className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 border-0 px-8 h-12 text-base"
                >
                  {t('landing.cta.button')}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-white dark:bg-[#0a0a0f] border-gray-100 dark:border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                <Rocket className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-gray-500">
                © {new Date().getFullYear()} Kitbase. {t('landing.footer.rights')}
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              <Anchor 
                href="#" 
                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                underline="never"
              >
                {t('landing.footer.privacy')}
              </Anchor>
              <Anchor 
                href="#" 
                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                underline="never"
              >
                {t('landing.footer.terms')}
              </Anchor>
              <Anchor 
                href="https://github.com/scr2em/kitbase-sdk" 
                target="_blank"
                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                underline="never"
              >
                <Github size={18} />
              </Anchor>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
