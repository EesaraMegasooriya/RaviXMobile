import { Link } from 'react-router-dom';
import { WHATSAPP_NUMBER } from '../lib/api';

const SERVICE_ERROR_MESSAGE = 'Something went wrong. Please try again in a moment, or contact RaviX Mobile for help.';
export function ContactSupport({ light = false }) {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent('Hello RaviX Mobile, I need help using your website. Can you please assist me?')}`;
  return <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-semibold">
    <a href={whatsappUrl} target="_blank" rel="noreferrer" className={`rounded-xl border px-4 py-2.5 ${light ? 'border-slate-300 text-slate-700 hover:bg-slate-50' : 'border-white/20 text-white hover:bg-white/5'}`}>Contact us on WhatsApp</a>
    <Link to="/contact" className={`px-2 py-2.5 underline ${light ? 'text-blue-700' : 'text-cyan-400'}`}>Other contact options</Link>
  </div>;
}
export default function ServiceError({ onRetry, message = SERVICE_ERROR_MESSAGE, light = false }) {
  return <div role="alert" className={`rounded-2xl border p-5 sm:p-6 ${light ? 'border-red-200 bg-red-50 text-red-800' : 'border-red-400/20 bg-red-400/5 text-red-200'}`}>
    <h3 className="text-lg font-bold">Something went wrong</h3>
    <p className="mt-2 text-sm leading-6">{message}</p>
    <ContactSupport light={light} />
    {onRetry && <button type="button" onClick={onRetry} className={`mt-4 min-h-11 rounded-xl px-5 py-2.5 text-sm font-bold ${light ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-cyan-400 text-black hover:bg-cyan-300'}`}>Try again</button>}
  </div>;
}
