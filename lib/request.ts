/**
 * HTTP client: shared base URL, timeout, and error handling.
 */

import { getApiBaseURL } from '../config/api';
import { API_TIMEOUT_MS } from '../config/api';

export interface ApiPaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta?: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

export interface AllianceMemberItem {
  username: string;
  logo: string;
  project_name: string;
  intro: string;
  website: string;
  twitter: string;
}

/** Media list item shape (matches GET /media/list `data` entries). */
export interface MediaListItem {
  id: number;
  name: string;
  file_type: string;
  synapse_index_id: string;
  synapse_data_set_id?: number;
  storage_id?: number;
  uploaded_at: string;
  category_uid?: string;
  category_name?: string;
  uploader_username?: string;
}

/** Perform a GET request. */
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const baseURL = getApiBaseURL();
  if (!baseURL) {
    throw new Error(
      'API base URL is not configured. Set NEXT_PUBLIC_API_BASE_URL (e.g. http://127.0.0.1:8000 for local dev).',
    );
  }
  const url = `${baseURL.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      ...options,
    });
    clearTimeout(timeoutId);
    const body = await res.json();
    if (!res.ok) {
      throw new Error(body?.message || `HTTP ${res.status}`);
    }
    return body as T;
  } catch (e) {
    clearTimeout(timeoutId);
    if (e instanceof Error) throw e;
    throw new Error(String(e));
  }
}

/** Public paginated alliance members list. */
export async function getAllianceMembers(params?: { page?: number; page_size?: number }): Promise<ApiPaginatedResponse<AllianceMemberItem>> {
  const sp = new URLSearchParams();
  if (params?.page != null) sp.set('page', String(params.page));
  if (params?.page_size != null) sp.set('page_size', String(params.page_size));
  const query = sp.toString();
  const path = `/alliance/members${query ? `?${query}` : ''}`;
  return request<ApiPaginatedResponse<AllianceMemberItem>>(path);
}

/** Public paginated media / proof list. */
export async function getMediaList(params?: { page?: number; page_size?: number }): Promise<ApiPaginatedResponse<MediaListItem>> {
  const sp = new URLSearchParams();
  if (params?.page != null) sp.set('page', String(params.page));
  if (params?.page_size != null) sp.set('page_size', String(params.page_size));
  const query = sp.toString();
  const path = `/media/list${query ? `?${query}` : ''}`;
  return request<ApiPaginatedResponse<MediaListItem>>(path);
}
