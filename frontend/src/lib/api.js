export const API_BASE_URL = (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5001/api')).replace(/\/+$/, '');
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '94703280480';
export function getProductImageUrl(value) {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
  } catch { return ''; }
}
