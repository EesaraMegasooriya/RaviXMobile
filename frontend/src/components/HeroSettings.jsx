import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL, getProductImageUrl } from '../lib/api';
import ProductImage from './ProductImage';
import defaultHero from '../assets/image.png';

export default function HeroSettings({ adminToken, onAuthError }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    axios.get(`${API_BASE_URL}/admin/settings`, { headers: { Authorization: `Bearer ${adminToken}` }, signal: controller.signal })
      .then(({ data }) => { setUrl(data.settings.heroImageUrl); setLoaded(true); setError(''); })
      .catch(error => {
        if (axios.isCancel(error)) return;
        if (error.response?.status === 401) onAuthError(error, 'Your session has expired.');
        setError('Unable to load hero settings. Please retry.');
      }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [adminToken, onAuthError, attempt]);
  async function save(event) {
    event.preventDefault();
    if (url.trim() && !getProductImageUrl(url.trim())) { setError('Enter a valid HTTP or HTTPS image link.'); return; }
    setBusy(true); setError(''); setMessage('');
    try {
      const { data } = await axios.put(`${API_BASE_URL}/admin/settings`, { heroImageUrl: url.trim() }, { headers: { Authorization: `Bearer ${adminToken}` } });
      setUrl(data.settings.heroImageUrl);
      setMessage('Homepage hero image saved.');
    } catch (error) {
      if (error.response?.status === 401) onAuthError(error, 'Your session has expired.');
      setError(error.response?.data?.message || 'Unable to save the hero image.');
    } finally { setBusy(false); }
  }
  return <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
    <h2 className="mb-3 text-xl font-bold text-slate-900">Homepage hero image</h2>
    {error && <p role="alert" className="mb-4 text-red-600">{error}</p>}
    {message && <p role="status" className="mb-4 text-green-700">{message}</p>}
    {loading ? <p role="status">Loading hero settings...</p> : !loaded ? <button onClick={() => { setLoading(true); setAttempt(n => n + 1); }} className="text-blue-600">Retry</button> : <form onSubmit={save} className="grid gap-4 md:grid-cols-2">
      <div className="space-y-4">
        <label className="block font-semibold text-slate-700">Direct image link<input type="url" maxLength={4096} value={url} disabled={busy} onChange={e => { setUrl(e.target.value); setMessage(''); }} placeholder="https://example.com/hero.jpg" className="mt-2 w-full rounded-xl border border-slate-300 p-3" /></label>
        <p className="text-sm text-slate-500">Paste a public image link. Leave it empty to use the default image.</p>
        <div className="flex flex-wrap gap-3"><button disabled={busy} className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white disabled:opacity-50">{busy ? 'Saving...' : 'Save hero image'}</button><button type="button" disabled={busy} onClick={() => { setUrl(''); setMessage('Default selected. Save to apply.'); }} className="rounded-xl bg-slate-100 px-5 py-3">Use default</button></div>
      </div>
      {url.trim() ? <ProductImage src={url.trim()} alt="Hero image preview" className="h-52 w-full rounded-xl object-contain" /> : <img src={defaultHero} alt="Default hero image" className="h-52 w-full rounded-xl object-contain" />}
    </form>}
  </section>;
}
