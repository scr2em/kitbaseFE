import { 
  Button, 
  ActionIcon,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation } from 'react-router';
import { Sun, Moon, Rocket } from 'lucide-react';
import { useDarkMode } from '../hooks';

export function AuthLayout() {
  const { t } = useTranslation();
  const { colorScheme, toggleColorScheme } = useDarkMode();
  const location = useLocation();
  
  const isLoginPage = location.pathname === '/login';

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
        <div 
          className="absolute -bottom-20 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-10"
          style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)' }}
        />
      </div>

      {/* Header */}
      <header className="h-16 border-b sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-[#0a0a0f]/80 border-gray-100 dark:border-white/5">
        <div className="max-w-6xl mx-auto h-full px-4 sm:px-6">
          <div className="flex justify-between items-center h-full">
            <Link to="/" className="flex items-center gap-2 no-underline">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                <Rocket className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Kitbase
              </span>
            </Link>

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
              
              <Button 
                variant="subtle" 
                component={Link} 
                to={isLoginPage ? '/signup' : '/login'}
                color="dark"
                radius="lg"
              >
                {isLoginPage 
                  ? t('landing.navigation.signup') 
                  : t('landing.navigation.login')
                }
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-[440px]">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 relative z-10">
        <div className="text-center">
          <span className="text-sm text-gray-500">
            © {new Date().getFullYear()} Kitbase
          </span>
        </div>
      </footer>
    </div>
  );
}
