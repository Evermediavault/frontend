/**
 * Map raw API/network errors to safe user-visible strings (no route paths, stack traces, etc.).
 */

export const USER_FACING_API_ERROR = 'Server error. Please try again later.';

/** True when the message should not be shown to end users. */
export function isUnsafeApiMessage(message: string): boolean {
  const m = message.trim();
  if (!m) return true;
  if (m.length > 600) return true;
  if (/Route\s+(?:GET|POST|PUT|PATCH|DELETE):/i.test(m)) return true;
  if (/\bRoute\b.*\bnot\s+found\b/i.test(m)) return true;
  if (/\/api\/v\d+\//i.test(m) && /not\s*found/i.test(m)) return true;
  if (/NEXT_PUBLIC_|process\.env|ECONNREFUSED|PrismaClient|socket hang up/i.test(m)) return true;
  if (/Failed to fetch|NetworkError|Load failed|Network request failed/i.test(m)) return true;
  if (/\n/.test(m) && /^\s*at\s+/m.test(m)) return true;
  if (/AbortError|aborted|The operation was aborted/i.test(m)) return true;
  return false;
}

/** Normalize a single message string for UI. */
export function toUserFacingErrorString(raw: string): string {
  if (isUnsafeApiMessage(raw)) return USER_FACING_API_ERROR;
  return raw.trim() || USER_FACING_API_ERROR;
}

/** Normalize any thrown value to a safe display string. */
export function toUserFacingError(err: unknown): string {
  if (err instanceof Error && err.message) {
    return toUserFacingErrorString(err.message);
  }
  if (typeof err === 'string') {
    return toUserFacingErrorString(err);
  }
  return USER_FACING_API_ERROR;
}
