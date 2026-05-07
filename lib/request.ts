/**
 * HTTP client: shared base URL, timeout, and error handling.
 */

import {
  getApiBaseURL,
  CONTACT_PATH,
  PARTNERS_PATH,
  PARTNERS_TAGS_PATH,
  API_TIMEOUT_MS,
} from '../config/api';
import { toUserFacingErrorString } from './userFacingError';

/** Public site is English-first; API uses this for `getMsg` / error strings. */
const API_DEFAULT_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  'Accept-Language': 'en-US,en;q=0.9',
};

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

/** GET /partners response item (aligned with API PartnerItem). */
export interface PartnerItem {
  id: number;
  logo: string;
  tag: string | null;
  name: string;
  description: string | null;
  link: string;
  created_at: string;
  updated_at: string;
}

interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
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

function buildApiUrl(path: string): string {
  const baseURL = getApiBaseURL();
  if (!baseURL) {
    throw new Error(
      toUserFacingErrorString(
        'API base URL is not configured. Set NEXT_PUBLIC_API_BASE_URL (e.g. http://127.0.0.1:8000 for local dev).',
      ),
    );
  }
  return `${baseURL.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Perform a GET request. */
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = buildApiUrl(path);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      ...options,
      headers: API_DEFAULT_HEADERS,
    });
    clearTimeout(timeoutId);
    const body = await res.json().catch(() => ({})) as { message?: string };
    if (!res.ok) {
      const raw =
        typeof body?.message === 'string' && body.message.length > 0
          ? body.message
          : `HTTP ${res.status}`;
      throw new Error(toUserFacingErrorString(raw));
    }
    return body as T;
  } catch (e) {
    clearTimeout(timeoutId);
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(toUserFacingErrorString(msg));
  }
}

/** POST JSON body; throws Error with server `message` when not ok. */
export async function postJson<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const url = buildApiUrl(path);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: API_DEFAULT_HEADERS,
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const parsed: { message?: string } = await res.json().catch(() => ({}));
    if (!res.ok) {
      const raw =
        typeof parsed?.message === 'string' && parsed.message.length > 0
          ? parsed.message
          : `HTTP ${res.status}`;
      throw new Error(toUserFacingErrorString(raw));
    }
    return parsed as T;
  } catch (e) {
    clearTimeout(timeoutId);
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(toUserFacingErrorString(msg));
  }
}

/** Contact Us — POST /contact (public). */
export interface ContactSubmitPayload {
  user_name: string;
  email: string;
  content: string;
}

export interface ContactSubmitResponse {
  success: true;
  message: string;
  data: {
    id: number;
    created_at: string;
  };
}

export async function submitContact(
  payload: ContactSubmitPayload,
): Promise<ContactSubmitResponse> {
  return postJson<ContactSubmitResponse>(CONTACT_PATH, {
    user_name: payload.user_name,
    email: payload.email,
    content: payload.content,
  });
}

/** Distinct partner tags (public). */
export async function getPartnerTags(): Promise<string[]> {
  const body = await request<ApiSuccessResponse<string[]>>(PARTNERS_TAGS_PATH);
  return Array.isArray(body.data) ? body.data : [];
}

/** Public partner list; optional exact tag filter. */
export async function getPartners(params?: { tag?: string }): Promise<PartnerItem[]> {
  const sp = new URLSearchParams();
  const t = params?.tag?.trim();
  if (t) sp.set('tag', t);
  const query = sp.toString();
  const path = `${PARTNERS_PATH}${query ? `?${query}` : ''}`;
  const body = await request<ApiSuccessResponse<PartnerItem[]>>(path);
  return Array.isArray(body.data) ? body.data : [];
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

/** Category list item (GET /categories). */
export interface CategoryListItem {
  id: number;
  uid: string;
  name: string;
  description: string | null;
  is_default: boolean;
  created_at: string;
  file_count: number;
}

/** Public paginated categories list. */
export async function getCategoryList(params?: {
  page?: number;
  page_size?: number;
  sort_by?: 'created_at' | 'name';
  order?: 'asc' | 'desc';
}): Promise<ApiPaginatedResponse<CategoryListItem>> {
  const sp = new URLSearchParams();
  if (params?.page != null) sp.set('page', String(params.page));
  if (params?.page_size != null) sp.set('page_size', String(params.page_size));
  if (params?.sort_by != null) sp.set('sort_by', params.sort_by);
  if (params?.order != null) sp.set('order', params.order);
  const query = sp.toString();
  const path = `/categories${query ? `?${query}` : ''}`;
  return request<ApiPaginatedResponse<CategoryListItem>>(path);
}

/** Synapse storage provider row from GET /media/storage-info. */
export interface MediaStorageProviderItem {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  serviceProvider: string;
  pdp: { serviceURL: string };
}

/** Public storage providers list (for upload / filters). */
export async function getMediaStorageInfo(): Promise<{ providers: MediaStorageProviderItem[] }> {
  const body = await request<ApiSuccessResponse<{ providers: MediaStorageProviderItem[] }>>('/media/storage-info');
  const providers = body?.data?.providers;
  return { providers: Array.isArray(providers) ? providers : [] };
}

/** Public paginated media / proof list. */
export async function getMediaList(params?: {
  page?: number;
  page_size?: number;
  word?: string;
  storage_id?: number;
}): Promise<ApiPaginatedResponse<MediaListItem>> {
  const sp = new URLSearchParams();
  if (params?.page != null) sp.set('page', String(params.page));
  if (params?.page_size != null) sp.set('page_size', String(params.page_size));
  if (params?.word != null && params.word.trim() !== '') {
    sp.set('word', params.word.trim().slice(0, 128));
  }
  if (params?.storage_id != null && Number.isFinite(params.storage_id)) {
    sp.set('storage_id', String(params.storage_id));
  }
  const query = sp.toString();
  const path = `/media/list${query ? `?${query}` : ''}`;
  return request<ApiPaginatedResponse<MediaListItem>>(path);
}
