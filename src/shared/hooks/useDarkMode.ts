import { useMantineColorScheme } from '@mantine/core';
import { useLayoutEffect } from 'react';

/**
 * Hook that syncs Mantine's color scheme with Tailwind's dark mode.
 * Adds/removes the 'dark' class on the <html> element.
 */
export function useDarkMode() {
  const mantineColorScheme = useMantineColorScheme();
  const { colorScheme } = mantineColorScheme;

  useLayoutEffect(() => {
    const root = document.documentElement;
    
    if (colorScheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [colorScheme]);

  return mantineColorScheme;
}

