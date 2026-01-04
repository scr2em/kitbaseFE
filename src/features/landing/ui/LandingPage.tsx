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
  BarChart3,
  Smartphone,
  RefreshCw,
  Menu,
  ArrowRight,
  Github,
  ExternalLink,
  Flag,
  Users,
  ChevronRight,
  Check,
  ToggleRight,
  Activity,
  Server,
  Shield,
  Lock,
  Database,
} from 'lucide-react';
import { usePageTitle, useDarkMode } from '../../../shared/hooks';

export function LandingPage() {
  const { t } = useTranslation();
  usePageTitle(t('landing.page_title'));
  const { colorScheme, toggleColorScheme } = useDarkMode();
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);

  const features = [
    {
      icon: Flag,
      title: t('landing.features.feature_flags.title'),
      description: t('landing.features.feature_flags.description'),
      gradient: 'from-violet-500 to-purple-600',
      bgGradient: 'from-violet-500/10 to-purple-600/10',
    },
    {
      icon: BarChart3,
      title: t('landing.features.event_tracking.title'),
      description: t('landing.features.event_tracking.description'),
      gradient: 'from-cyan-500 to-blue-600',
      bgGradient: 'from-cyan-500/10 to-blue-600/10',
    },
    {
      icon: RefreshCw,
      title: t('landing.features.ota_updates.title'),
      description: t('landing.features.ota_updates.description'),
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-500/10 to-teal-600/10',
    },
    {
      icon: Users,
      title: t('landing.features.segments.title'),
      description: t('landing.features.segments.description'),
      gradient: 'from-orange-500 to-amber-600',
      bgGradient: 'from-orange-500/10 to-amber-600/10',
    },
    {
      icon: Smartphone,
      title: t('landing.features.multi_platform.title'),
      description: t('landing.features.multi_platform.description'),
      gradient: 'from-pink-500 to-rose-600',
      bgGradient: 'from-pink-500/10 to-rose-600/10',
    },
    {
      icon: Activity,
      title: t('landing.features.analytics.title'),
      description: t('landing.features.analytics.description'),
      gradient: 'from-indigo-500 to-violet-600',
      bgGradient: 'from-indigo-500/10 to-violet-600/10',
    },
  ];


  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] dark:bg-[#0d1117]">
      {/* Subtle Grid Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30 dark:opacity-20"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Gradient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-[500px] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full opacity-20 dark:opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(6, 182, 212, 0.2) 50%, transparent 70%)' }}
        />
      </div>

      {/* Header */}
      <header className="h-16 border-b sticky top-0 z-50 backdrop-blur-xl bg-[#fafafa]/80 dark:bg-[#161b22]/90 border-zinc-200 dark:border-[#30363d]">
        <div className="max-w-6xl mx-auto h-full px-4 sm:px-6">
          <div className="flex justify-between items-center h-full">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Rocket className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-[#e6edf3]">
                Kitbase
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Anchor 
                component={Link} 
                to="#features" 
                className="text-sm font-medium transition-colors text-zinc-600 hover:text-zinc-900 dark:text-[#8b949e] dark:hover:text-[#e6edf3]"
                underline="never"
              >
                {t('landing.navigation.features')}
              </Anchor>
              <Anchor 
                href="https://docs.kitbase.dev" 
                target="_blank"
                className="text-sm font-medium transition-colors flex items-center gap-1.5 text-zinc-600 hover:text-zinc-900 dark:text-[#8b949e] dark:hover:text-[#e6edf3]"
                underline="never"
                display="flex"
              >
                {t('landing.navigation.docs')}
                <ExternalLink className="w-3 h-3" />
              </Anchor>
              <Anchor 
                component={Link} 
                to="#pricing" 
                className="text-sm font-medium transition-colors text-zinc-600 hover:text-zinc-900 dark:text-[#8b949e] dark:hover:text-[#e6edf3]"
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
          <span className="font-bold text-zinc-900 dark:text-[#e6edf3]">
            Kitbase
          </span>
        }
      >
        <div className="flex flex-col gap-4 pt-4">
              <Anchor 
                component={Link} 
                to="#features" 
                onClick={closeDrawer}
                className="text-base font-medium text-zinc-700 dark:text-[#e6edf3]"
                underline="never"
              >
                {t('landing.navigation.features')}
              </Anchor>
              <Anchor 
                href="https://docs.kitbase.dev" 
                target="_blank"
                className="text-base font-medium flex items-center gap-1.5 text-zinc-700 dark:text-[#e6edf3]"
                underline="never"
              >
                {t('landing.navigation.docs')}
                <ExternalLink className="w-4 h-4" />
              </Anchor>
              <Anchor 
                component={Link} 
                to="#pricing" 
                onClick={closeDrawer}
                className="text-base font-medium text-zinc-700 dark:text-[#e6edf3]"
                underline="never"
              >
                {t('landing.navigation.pricing')}
              </Anchor>
              <hr className="my-2 border-zinc-200 dark:border-[#30363d]" />
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
        <section className="pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-500/20">
                <Flag className="w-4 h-4" />
                <span>{t('landing.hero.badge')}</span>
                <ChevronRight className="w-4 h-4" />
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-zinc-900 dark:text-[#e6edf3] leading-[1.1]">
                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  {t('landing.hero.title_gradient')}
                </span>
                <br />
                <span>{t('landing.hero.title_rest')}</span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 text-zinc-600 dark:text-[#8b949e] leading-relaxed">
                {t('landing.hero.subtitle')}
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  component={Link}
                  to="/signup"
                  radius="xl"
                  rightSection={<ArrowRight size={18} />}
                  className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 border-0 px-8 h-12 text-base shadow-lg shadow-violet-500/25"
                >
                  {t('landing.hero.cta_primary')}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  component="a"
                  href="https://github.com/scr2em/kitbase-sdk"
                  target="_blank"
                  radius="xl"
                  leftSection={<Github size={18} />}
                  className="px-8 h-12 text-base border-zinc-300 dark:border-[#30363d] text-zinc-700 dark:text-[#e6edf3] hover:bg-zinc-100 dark:hover:bg-[#21262d]"
                >
                  {t('landing.hero.cta_secondary')}
                </Button>
              </div>
            </div>
          </div>
        </section>

         {/* Event Tracking Section */}
         <section className="py-16 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-6 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20">
                  <BarChart3 className="w-4 h-4" />
                  <span>{t('landing.showcase.events.label')}</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-zinc-900 dark:text-[#e6edf3]">
                  {t('landing.showcase.events.title')}
                </h2>
                <p className="text-lg mb-8 text-zinc-600 dark:text-[#8b949e] leading-relaxed">
                  {t('landing.showcase.events.description')}
                </p>
                <ul className="space-y-4">
                  {[
                    t('landing.showcase.events.benefit_1'),
                    t('landing.showcase.events.benefit_2'),
                    t('landing.showcase.events.benefit_3'),
                    t('landing.showcase.events.benefit_4'),
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-zinc-700 dark:text-[#e6edf3]">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Events Code Preview */}
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/10 bg-[#0f0f17] border border-zinc-800">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-[#0a0a10]">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-3 text-sm text-zinc-500 font-mono">app.ts</span>
                </div>
                
                <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
                  <div>
                    <span className="text-pink-400">import</span>
                    <span className="text-zinc-300"> {'{ Kitbase }'} </span>
                    <span className="text-pink-400">from</span>
                    <span className="text-emerald-400"> '@kitbase/sdk/events'</span>
                    <span className="text-zinc-400">;</span>
                  </div>
                  
                  <div className="mt-4">
                    <span className="text-pink-400">const</span>
                    <span className="text-zinc-300"> kitbase = </span>
                    <span className="text-pink-400">new</span>
                    <span className="text-cyan-400"> Kitbase</span>
                    <span className="text-zinc-300">{'({'}</span>
                  </div>
                  <div className="pl-4 text-zinc-300">
                    token: <span className="text-emerald-400">'pk_live_...'</span>,
                  </div>
                  <div className="text-zinc-300">{'});'}</div>
                  
                  <div className="mt-4 text-zinc-500">{'// Track a custom event'}</div>
                  <div>
                    <span className="text-pink-400">await</span>
                    <span className="text-zinc-300"> kitbase.</span>
                    <span className="text-amber-400">track</span>
                    <span className="text-zinc-300">{'({'}</span>
                  </div>
                  <div className="pl-4 text-zinc-300">
                    channel: <span className="text-emerald-400">'payments'</span>,
                  </div>
                  <div className="pl-4 text-zinc-300">
                    event: <span className="text-emerald-400">'subscription_created'</span>,
                  </div>
                  <div className="pl-4 text-zinc-300">
                    tags: {'{'}
                  </div>
                  <div className="pl-8 text-zinc-300">
                    plan: <span className="text-emerald-400">'pro'</span>,
                  </div>
                  <div className="pl-8 text-zinc-300">
                    amount: <span className="text-amber-400">99</span>
                  </div>
                  <div className="pl-4 text-zinc-300">{'}'}</div>
                  <div className="text-zinc-300">{'});'}</div>
                  
                  <div className="mt-4 flex items-center gap-2 text-emerald-400">
                    <Check className="w-4 h-4" />
                    <span>Event tracked successfully</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Feature Flags Section */}
        <section className="py-16 sm:py-24 bg-white dark:bg-[#161b22]/50 border-y border-zinc-200 dark:border-[#30363d]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Feature Flags Code Preview */}
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-violet-500/10 bg-[#0f0f17] border border-zinc-800 order-2 lg:order-1">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-[#0a0a10]">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-3 text-sm text-zinc-500 font-mono">app.ts</span>
                </div>
                
                <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
                  <div>
                    <span className="text-pink-400">import</span>
                    <span className="text-zinc-300"> {'{ KitbaseFlags }'} </span>
                    <span className="text-pink-400">from</span>
                    <span className="text-emerald-400"> '@kitbase/sdk/flags'</span>
                    <span className="text-zinc-400">;</span>
                  </div>
                  
                  <div className="mt-4">
                    <span className="text-pink-400">const</span>
                    <span className="text-zinc-300"> flags = </span>
                    <span className="text-pink-400">new</span>
                    <span className="text-cyan-400"> KitbaseFlags</span>
                    <span className="text-zinc-300">{'({'}</span>
                  </div>
                  <div className="pl-4 text-zinc-300">
                    token: <span className="text-emerald-400">'pk_live_...'</span>,
                  </div>
                  <div className="text-zinc-300">{'});'}</div>
                  
                  <div className="mt-4 text-zinc-500">{'// Evaluate a feature flag'}</div>
                  <div>
                    <span className="text-pink-400">const</span>
                    <span className="text-zinc-300"> showNewUI = </span>
                    <span className="text-pink-400">await</span>
                    <span className="text-zinc-300"> flags.</span>
                    <span className="text-amber-400">evaluate</span>
                    <span className="text-zinc-300">{'('}</span>
                  </div>
                  <div className="pl-4 text-emerald-400">'new_dashboard_ui'</div>
                  <div className="text-zinc-300">{');'}</div>
                  
                  <div className="mt-4 text-zinc-500">{'// With user context for targeting'}</div>
                  <div>
                    <span className="text-pink-400">const</span>
                    <span className="text-zinc-300"> premiumFeature = </span>
                    <span className="text-pink-400">await</span>
                    <span className="text-zinc-300"> flags.</span>
                    <span className="text-amber-400">evaluate</span>
                    <span className="text-zinc-300">{'('}</span>
                  </div>
                  <div className="pl-4 text-emerald-400">'premium_analytics'</div>
                  <div className="pl-4 text-zinc-300">{', { '}<span className="text-cyan-300">userId</span>: <span className="text-emerald-400">'user_123'</span>{' }'}</div>
                  <div className="text-zinc-300">{');'}</div>
                  
                  <div className="mt-4 flex items-center gap-2 text-emerald-400">
                    <ToggleRight className="w-4 h-4" />
                    <span>Flag evaluated: true</span>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-6 bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-500/20">
                  <Flag className="w-4 h-4" />
                  <span>{t('landing.showcase.feature_flags.label')}</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-zinc-900 dark:text-[#e6edf3]">
                  {t('landing.showcase.feature_flags.title')}
                </h2>
                <p className="text-lg mb-8 text-zinc-600 dark:text-[#8b949e] leading-relaxed">
                  {t('landing.showcase.feature_flags.description')}
                </p>
                <ul className="space-y-4">
                  {[
                    t('landing.showcase.feature_flags.benefit_1'),
                    t('landing.showcase.feature_flags.benefit_2'),
                    t('landing.showcase.feature_flags.benefit_3'),
                    t('landing.showcase.feature_flags.benefit_4'),
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-zinc-700 dark:text-[#e6edf3]">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* OpenFeature Compatibility */}
                <a 
                  href="https://openfeature.dev" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500/5 to-purple-500/5 border border-violet-200 dark:border-violet-500/20 hover:border-violet-300 dark:hover:border-violet-500/40 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium text-zinc-700 dark:text-[#e6edf3]">
                      100% compatible with
                    </span>
                    <span className="text-sm font-bold text-violet-600 dark:text-violet-400">
                      OpenFeature
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-violet-500 transition-colors" />
                </a>
              </div>
            </div>
          </div>
        </section>

     


        {/* Features Section */}
        <section id="features" className="py-16 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-zinc-900 dark:text-[#e6edf3]">
                {t('landing.features.title')}
              </h2>
              <p className="text-lg max-w-2xl mx-auto text-zinc-600 dark:text-[#8b949e]">
                {t('landing.features.subtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative p-6 rounded-2xl transition-all duration-300 bg-white dark:bg-[#161b22] border border-zinc-200 dark:border-[#30363d] hover:border-zinc-300 dark:hover:border-[#8b949e] hover:shadow-xl hover:shadow-zinc-200/50"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.bgGradient} dark:${feature.bgGradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-6 h-6 bg-gradient-to-r ${feature.gradient} [&>*]:stroke-violet-500`} style={{ color: 'inherit' }} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-[#e6edf3]">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-600 dark:text-[#8b949e]">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* Self-Hosting Section */}
        <section className="py-16 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Visual */}
              <div className="relative order-2 lg:order-1">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 border border-slate-700/50">
                  {/* Background Pattern */}
                  <div 
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                      backgroundSize: '24px 24px',
                    }}
                  />
                  
                  {/* Server Rack Illustration */}
                  <div className="relative z-10 flex flex-col items-center gap-6">
                    {/* Top Icons */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
                        <Shield className="w-7 h-7 text-emerald-400" />
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 flex items-center justify-center">
                        <Lock className="w-7 h-7 text-amber-400" />
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                        <Database className="w-7 h-7 text-blue-400" />
                      </div>
                    </div>

                    {/* Central Server Icon */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-3xl blur-2xl opacity-30" />
                      <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-violet-500/30">
                        <Server className="w-12 h-12 text-white" />
                      </div>
                    </div>

                    {/* Server Racks */}
                    <div className="flex gap-3 w-full justify-center">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex flex-col gap-1.5">
                          {[1, 2, 3, 4].map((j) => (
                            <div 
                              key={j} 
                              className="w-16 h-3 rounded bg-slate-700/80 border border-slate-600/50 flex items-center px-1.5 gap-1"
                            >
                              <div className={`w-1.5 h-1.5 rounded-full ${j === 1 ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                              <div className="flex-1 h-1 bg-slate-600/50 rounded" />
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>

                    {/* Status Text */}
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-sm font-medium text-emerald-400">Your Infrastructure</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-6 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                  <Server className="w-4 h-4" />
                  <span>{t('landing.self_hosting.label')}</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-zinc-900 dark:text-[#e6edf3]">
                  {t('landing.self_hosting.title')}
                </h2>
                <p className="text-lg mb-8 text-zinc-600 dark:text-[#8b949e] leading-relaxed">
                  {t('landing.self_hosting.description')}
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    t('landing.self_hosting.benefit_1'),
                    t('landing.self_hosting.benefit_2'),
                    t('landing.self_hosting.benefit_3'),
                    t('landing.self_hosting.benefit_4'),
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-zinc-700 dark:text-[#e6edf3]">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="md"
                    component="a"
                    href="mailto:sales@kitbase.dev"
                    radius="xl"
                    rightSection={<ArrowRight size={16} />}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 border-0"
                  >
                    {t('landing.self_hosting.cta_primary')}
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    component="a"
                    href="https://docs.kitbase.dev/self-hosting"
                    target="_blank"
                    radius="xl"
                    leftSection={<ExternalLink size={16} />}
                    className="border-zinc-300 dark:border-[#30363d] text-zinc-700 dark:text-[#e6edf3] hover:bg-zinc-100 dark:hover:bg-[#21262d]"
                  >
                    {t('landing.self_hosting.cta_secondary')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Integration Section */}
        <section className="py-16 sm:py-24 bg-white dark:bg-[#161b22]/50 border-y border-zinc-200 dark:border-[#30363d]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-zinc-900 dark:text-[#e6edf3]">
                  {t('landing.integration.title')}
                </h2>
                <p className="text-lg mb-8 text-zinc-600 dark:text-[#8b949e]">
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
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-zinc-700 dark:text-[#e6edf3]">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { name: 'React', icon: Code, gradient: 'from-sky-400 to-cyan-500', href: 'https://docs.kitbase.dev/sdks/react.html' },
                  { name: 'React Native', icon: Smartphone, gradient: 'from-cyan-500 to-blue-500', href: 'https://docs.kitbase.dev/sdks/react.html' },
                  { name: 'Flutter', icon: Smartphone, gradient: 'from-blue-500 to-indigo-500', href: 'https://docs.kitbase.dev/sdks/dart.html' },
                  { name: 'TypeScript', icon: Code, gradient: 'from-violet-500 to-purple-500', href: 'https://docs.kitbase.dev/sdks/typescript.html' },
                  { name: 'REST API', icon: Zap, gradient: 'from-amber-500 to-orange-500', href: 'https://docs.kitbase.dev/reference/api.html' },
                  { name: 'PHP', icon: Code, gradient: 'from-emerald-500 to-green-600', href: 'https://docs.kitbase.dev/sdks/php.html' },
                ].map((tech, index) => (
                  <a 
                    key={index}
                    href={tech.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-zinc-50 dark:bg-[#161b22] border border-zinc-200 dark:border-[#30363d] hover:border-zinc-300 dark:hover:border-[#8b949e] hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                  >
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tech.gradient} flex items-center justify-center`}>
                      <tech.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-zinc-700 dark:text-[#e6edf3]">
                      {tech.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* CTA Section */}
        <section className="py-16 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 text-center bg-gradient-to-br from-violet-600 to-cyan-600">
              {/* Decorative elements */}
              <div className="absolute inset-0 opacity-30">
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                    backgroundSize: '32px 32px',
                  }}
                />
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
              
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
                  {t('landing.cta.title')}
                </h2>
                <p className="text-lg mb-8 text-white/80">
                  {t('landing.cta.subtitle')}
                </p>
                <Button
                  size="lg"
                  component={Link}
                  to="/signup"
                  radius="xl"
                  rightSection={<ArrowRight size={18} />}
                  className="bg-white text-violet-600 hover:bg-zinc-100 border-0 px-8 h-12 text-base shadow-lg"
                >
                  {t('landing.cta.button')}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-white dark:bg-[#0d1117] border-zinc-200 dark:border-[#30363d]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                <Rocket className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-zinc-500">
                © {new Date().getFullYear()} Kitbase. {t('landing.footer.rights')}
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              <Anchor 
                href="#" 
                className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-[#e6edf3]"
                underline="never"
              >
                {t('landing.footer.privacy')}
              </Anchor>
              <Anchor 
                href="#" 
                className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-[#e6edf3]"
                underline="never"
              >
                {t('landing.footer.terms')}
              </Anchor>
              <Anchor 
                href="https://github.com/scr2em/kitbase-sdk" 
                target="_blank"
                className="text-zinc-500 hover:text-zinc-700 dark:hover:text-[#e6edf3]"
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
