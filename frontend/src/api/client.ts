const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
export const API_BASE_URL =
  import.meta.env.DEV
    ? ''
    : configuredApiBaseUrl?.replace(/\/+$/, '') || '';

export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

export function isValidIndianMobile(value: string): boolean {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length === 12) {
    digits = digits.slice(2);
  } else if (digits.startsWith('0') && digits.length === 11) {
    digits = digits.slice(1);
  }
  return /^[6-9]\d{9}$/.test(digits);
}

export type ContactPayload = {
  name: string;
  phone: string;
  email?: string;
  location?: string;
  service?: string;
  message?: string;
  language?: string;
};

export type ContactApiResponse = {
  success: boolean;
  message: string;
  id: number;
  reference_number?: string;
  status: string;
};

export type QuotationPayload = {
  need?: string;
  drone?: string;
  landArea?: string;
  crop?: string;
  timeline?: string;
  name?: string;
  phone?: string;
  email?: string;
  location?: string;
  message?: string;
  language?: string;
};

export type QuotationApiResponse = {
  success: boolean;
  message: string;
  reference_number: string;
  id: number;
  status: string;
};

async function postJson<T>(path: string, payload: object): Promise<T> {
  let response: Response;
  try {
    response = await fetch(apiUrl(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Unable to reach the enquiry service. Please check that the backend is running and try again.');
    }
    throw error;
  }

  if (!response.ok) {
    const body = await response.text();
    let detail: unknown;
    try {
      const parsed: unknown = JSON.parse(body);
      if (typeof parsed === 'object' && parsed !== null) {
        const errorBody = parsed as { detail?: unknown; message?: unknown };
        detail = errorBody.detail ?? errorBody.message;
      }
    } catch {
      detail = undefined;
    }

    const message = typeof detail === 'string'
      ? detail
      : detail === undefined
        ? `Request failed (${response.status}). Please try again.`
        : JSON.stringify(detail);
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export function submitContactForm(payload: ContactPayload): Promise<ContactApiResponse> {
  return postJson<ContactApiResponse>('/api/contact', payload);
}

export function submitQuotationForm(payload: QuotationPayload): Promise<QuotationApiResponse> {
  return postJson<QuotationApiResponse>('/api/quotations', payload);
}
