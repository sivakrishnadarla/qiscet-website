'use client';

/** Shared client helpers for all lead / enquiry forms. */
export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'msclkid'] as const;
export type Utm = Partial<Record<(typeof UTM_KEYS)[number], string>>;

const STORAGE_KEY = 'qiscet_attribution';

/** Capture UTM/click IDs from the first landing URL and persist them (first-touch attribution). */
export function captureAttribution(): Utm {
  if (typeof window === 'undefined') return {};
  try {
    const params = new URLSearchParams(window.location.search);
    const found: Utm = {};
    for (const k of UTM_KEYS) {
      const v = params.get(k);
      if (v) found[k] = v.slice(0, 200);
    }
    const stored = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || '{}') as Utm & { landing?: string; referrer?: string };
    if (Object.keys(found).length) {
      const merged = { ...stored, ...found, landing: stored.landing || window.location.href, referrer: stored.referrer || document.referrer };
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
    if (!stored.landing) {
      const merged = { ...stored, landing: window.location.href, referrer: document.referrer };
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
    return stored;
  } catch {
    return {};
  }
}

export type SubmitResult = { ok: true; id?: string; message?: string } | { ok: false; error: string };

export async function submitForm(endpoint: string, data: Record<string, unknown>): Promise<SubmitResult> {
  const attribution = captureAttribution();
  const payload = {
    ...data,
    attribution,
    page: typeof window !== 'undefined' ? window.location.pathname : undefined,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 250) : undefined,
  };
  try {
    const res = await fetch(`/api/${endpoint.replace(/^\/+/, '')}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = Array.isArray(body?.message) ? body.message.join(', ') : body?.message || body?.error || `Request failed (${res.status})`;
      return { ok: false, error: msg };
    }
    pushDataLayer(endpoint, data);
    return { ok: true, id: body?.id, message: body?.message };
  } catch {
    return { ok: false, error: 'Network error – please check your connection and try again, or call us directly.' };
  }
}

function pushDataLayer(endpoint: string, data: Record<string, unknown>) {
  try {
    const w = window as unknown as { dataLayer?: unknown[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: 'form_submit', form_id: endpoint, programme: data.programme || data.branch || undefined });
  } catch {
    /* noop */
  }
}

export const isValidIndianMobile = (v: string) => /^[6-9]\d{9}$/.test(v.replace(/\D/g, '').slice(-10));
export const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
