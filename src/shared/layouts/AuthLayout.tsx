import { 
  Button, 
  ActionIcon, 
  useMantineColorScheme 
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation } from 'react-router';
import { Sun, Moon } from 'lucide-react';

export function AuthLayout() {
  const { t } = useTranslation();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const location = useLocation();
  
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-[60px] border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto h-full px-4">
          <div className="flex justify-between items-center h-full">
            <Link to="/" className="no-underline">
              <h3 className="text-xl font-semibold text-[var(--mantine-color-brand-7)]">
                Kitbase
              </h3>
            </Link>

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
              
              <Button 
                variant="subtle" 
                component={Link} 
                to={isLoginPage ? '/signup' : '/login'}
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

      <main 
        className="flex-1 flex items-center justify-center p-4"
        style={{
          background: 'linear-gradient(135deg, var(--mantine-color-brand-0) 0%, var(--mantine-color-accent-0) 100%)',
        }}
      >
        <div className="w-full max-w-[480px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

