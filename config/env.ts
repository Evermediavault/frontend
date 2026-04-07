/**
 * Environment (NEXT_PUBLIC_* only, client-safe).
 * Prefer `window.__PUBLIC_ENV__` from root layout so values work when webpack inlining does not.
 */

declare global {
  interface Window {
    __PUBLIC_ENV__?: { NEXT_PUBLIC_API_BASE_URL?: string };
  }
}

function getEnv(key: string, defaultValue: string = ''): string {
  if (typeof process === 'undefined' || !process.env) return defaultValue;
  const v = process.env[key];
  return typeof v === 'string' ? v : defaultValue;
}

/** True when running in development. */
export function isDev(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * API origin only (no path), e.g. http://127.0.0.1:8000.
 * Order: layout-injected `window.__PUBLIC_ENV__` → `process.env` → localhost default.
 */
export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined' && window.__PUBLIC_ENV__?.NEXT_PUBLIC_API_BASE_URL) {
    const v = window.__PUBLIC_ENV__.NEXT_PUBLIC_API_BASE_URL.trim().replace(/\/$/, '');
    if (v) return v;
  }
  const fromEnv = getEnv('NEXT_PUBLIC_API_BASE_URL', '').trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  if (typeof window !== 'undefined' && (window.location?.hostname === 'localhost' || window.location?.hostname === '127.0.0.1')) {
    return 'http://127.0.0.1:8000';
  }
  return '';
}
