// VITE_API_URL is the server origin. Accept older /api values too,
// so every caller gets exactly one API prefix.
const serverUrl = (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://api.ravixmobile.com' : 'http://localhost:5001')).trim().replace(/\/+$/, '');
export const API_BASE_URL = serverUrl.endsWith('/api') ? serverUrl : `${serverUrl}/api`;
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '94703280480';
export function getProductImageUrl(value) {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
  } catch { return ''; }
}
