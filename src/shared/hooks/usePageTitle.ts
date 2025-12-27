import { useDocumentTitle } from '@mantine/hooks';

const APP_NAME = 'Kitbase';

export function usePageTitle(title: string) {
  useDocumentTitle(`${title} | ${APP_NAME}`);
}

