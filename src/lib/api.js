// Full URL of GET /api/v4/survey on the Laravel API domain, set at build time
// (Vercel environment variable). In `npm run dev` it falls back to the proxied path.
const ENDPOINT = (import.meta.env.VITE_SURVEY_API_URL || '/api/v4/survey').replace(/\/+$/, '');

const NETWORK_ERROR = 'تعذّر الاتصال بالخادم، تحقّق من الإنترنت ثم حاول مجدداً.';

export class ApiError extends Error {
  constructor(message, { status = 0, reason = null, errors = null } = {}) {
    super(message);
    this.status = status;
    this.reason = reason;
    this.errors = errors;
  }
}

async function request(url, options = {}) {
  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers: { Accept: 'application/json', ...(options.headers || {}) },
    });
  } catch {
    throw new ApiError(NETWORK_ERROR);
  }

  const body = await response.json().catch(() => null);

  if (response.ok && body?.success) {
    return body.data;
  }

  if (response.status === 429) {
    throw new ApiError('محاولات كثيرة خلال وقت قصير، انتظر دقيقة ثم حاول مجدداً.', { status: 429 });
  }

  throw new ApiError(body?.message || NETWORK_ERROR, {
    status: response.status,
    reason: body?.data?.reason ?? null,
    errors: body?.data?.errors ?? null,
  });
}

export function fetchSurvey() {
  return request(ENDPOINT);
}

export function submitResponse(payload) {
  return request(`${ENDPOINT}/responses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}
