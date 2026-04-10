/**
 * API constants and base URL (aligned with backend API_V1_PREFIX).
 */

import { getApiBaseUrl } from './env';

/** Backend API v1 path prefix. */
export const API_V1_PATH = '/api/v1';

/** Request timeout in milliseconds. */
export const API_TIMEOUT_MS = 30000;

/** Alliance members endpoint (public, no auth). */
export const ALLIANCE_MEMBERS_PATH = '/alliance/members';

/** Contact Us form submission (public POST). */
export const CONTACT_PATH = '/contact';

/** Full API base URL: origin + API_V1_PATH. */
export function getApiBaseURL(): string {
  const origin = getApiBaseUrl();
  return origin ? `${origin}${API_V1_PATH}` : '';
}
