import Cookies from 'universal-cookie';

const cookies = new Cookies();

// Get the domain for cookie storage
// This allows cookies to be accessible across subdomains
const getCookieDomain = (): string => {
  const hostname = window.location.hostname;
  // For production domains, extract the main domain
  // e.g., org1.myapp.com -> .myapp.com
  const parts = hostname.split('.');
  if (parts.length > 2) {
    return `.${parts.slice(-2).join('.')}`;
  }
  
  return "." + hostname;
};

const COOKIE_OPTIONS = {
  domain: getCookieDomain(),
  path: '/',
  secure: window.location.protocol === 'https:',
  sameSite: 'lax' as const,
  httpOnly: false, // We need to access these from JavaScript
};

export const tokenStorage = {
  // Access token
  getAccessToken: (): string | null => {
    return cookies.get('accessToken') || null;
  },

  setAccessToken: (token: string): void => {
    cookies.set('accessToken', token, {
      ...COOKIE_OPTIONS,
      maxAge: 60 * 60, // 1 hour (access token expiry)
    });
  },

  removeAccessToken: (): void => {
    cookies.remove('accessToken', { domain: COOKIE_OPTIONS.domain, path: COOKIE_OPTIONS.path });
  },

  // Refresh token
  getRefreshToken: (): string | null => {
    return cookies.get('refreshToken') || null;
  },

  setRefreshToken: (token: string): void => {
    cookies.set('refreshToken', token, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60, // 7 days (refresh token expiry)
    });
  },

  removeRefreshToken: (): void => {
    cookies.remove('refreshToken', { domain: COOKIE_OPTIONS.domain, path: COOKIE_OPTIONS.path });
  },

  // Clear all tokens
  clearTokens: (): void => {
    tokenStorage.removeAccessToken();
    tokenStorage.removeRefreshToken();
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!tokenStorage.getAccessToken();
  },
};
