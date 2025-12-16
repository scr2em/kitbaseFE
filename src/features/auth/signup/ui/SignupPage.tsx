import { 
  Paper, 
  Title, 
  Text, 
  Stack, 
  Box, 
  Group, 
  Container,
  AppShell,
  Button,
  ActionIcon,
  useMantineColorScheme
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useSearchParams, Link } from 'react-router';
import { Sun, Moon } from 'lucide-react';
import { InitiateSignupForm } from './InitiateSignupForm';
import { CompleteSignupForm } from './CompleteSignupForm';

export function SignupPage() {
  const { t } = useTranslation();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [searchParams] = useSearchParams();
  
  const token = searchParams.get('token');
  const isCompleteStep = !!token;

  return (
    <AppShell
      header={{ height: 60 }}
      padding={0}
    >
      <AppShell.Header>
        <Container size="xl" h="100%">
          <Group justify="space-between" h="100%">
            <Group>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <Title order={3} c="brand.7">
                  Kitbase
                </Title>
              </Link>
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
              
              <Button variant="subtle" component={Link} to="/login">
                {t('landing.navigation.login')}
              </Button>
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Box
          style={{
            minHeight: 'calc(100vh - 60px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--mantine-color-brand-0) 0%, var(--mantine-color-accent-0) 100%)',
          }}
          p="md"
        >
          <Box w="100%" maw="480px">
            <Paper
              withBorder
              shadow="xl"
              p="xl"
              radius="lg"
            >
              <Stack gap="md">
                <div>
                  <Title ta="center" order={2} mb="xs">
                    {isCompleteStep 
                      ? t('auth.signup.complete.title') 
                      : t('auth.signup.initiate.title')
                    }
                  </Title>
                  <Text c="dimmed" size="sm" ta="center">
                    {isCompleteStep 
                      ? t('auth.signup.complete.subtitle') 
                      : t('auth.signup.initiate.subtitle')
                    }
                  </Text>
                </div>
                
                {isCompleteStep ? (
                  <CompleteSignupForm token={token} />
                ) : (
                  <InitiateSignupForm />
                )}
              </Stack>
            </Paper>
          </Box>
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
