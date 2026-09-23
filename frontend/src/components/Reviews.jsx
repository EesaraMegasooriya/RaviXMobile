import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../lib/api';

const emptyForm = { name: '', rating: '5', comment: '' };
export default function Reviews({ adminToken, onAuthError }) {
  const [form, setForm] = useState(emptyForm);
  const [result, setResult] = useState({ reviews: [], total: 0, pages: 0 });
  const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    axios.get(`${API_BASE_URL}/reviews?page=${page}`, { signal: controller.signal })
      .then(({ data }) => { setResult(data); setLoadError(''); })
      .catch(error => { if (!axios.isCancel(error)) setLoadError('Unable to load reviews. Please try again.'); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [page, revision]);
  function reload(nextPage = page) {
    setLoading(true);
    setPage(nextPage);
    setRevision(value => value + 1);
  }
  async function submit(event) {
    event.preventDefault();
    setBusy(true); setError(''); setMessage('');
    try {
      await axios.post(`${API_BASE_URL}/reviews`, { name: form.name.trim(), rating: Number(form.rating), comment: form.comment.trim() });
      setForm(emptyForm);
      setMessage('Thank you! Your review has been published.');
      reload(1);
    } catch (error) { setError(error.response?.data?.message || 'Unable to submit your review. Please try again.'); }
    finally { setBusy(false); }
  }
  async function remove(review) {
    if (!window.confirm(`Delete the review by ${review.name}?`)) return;
    setBusy(true); setError(''); setMessage('');
    try {
      await axios.delete(`${API_BASE_URL}/admin/reviews/${review._id}`, { headers: { Authorization: `Bearer ${adminToken}` } });
      setMessage('Review deleted.');
      reload(result.reviews.length === 1 ? Math.max(1, page - 1) : page);
    } catch (error) {
      if (error.response?.status === 401) onAuthError?.(error, 'Your session has expired.');
      setError(error.response?.data?.message || 'Unable to delete this review.');
    } finally { setBusy(false); }
  }
  const inputClass = 'w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900';
  return <section className={adminToken ? 'mb-8 rounded-2xl bg-white p-6 text-slate-900 shadow-sm' : 'mx-auto max-w-[1360px] px-6 py-20 text-white md:px-10'}>
    <h2 className="mb-3 text-3xl font-bold">Customer Reviews</h2>
    <p className="mb-8 opacity-70">{adminToken ? 'Manage reviews submitted by visitors.' : 'Share your experience with RaviX Mobile.'}</p>
    {message && <p role="status" className="mb-4 text-green-600">{message}</p>}
    {error && <p role="alert" className="mb-4 text-red-500">{error}</p>}
    {!adminToken && <form onSubmit={submit} className="mb-10 grid max-w-2xl gap-4">
      <label className="grid gap-2">Your name<input required maxLength={80} autoComplete="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass} /></label>
      <label className="grid gap-2">Rating<select value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} className={inputClass}>{[5,4,3,2,1].map(n => <option key={n} value={n}>{n} {n === 1 ? 'star' : 'stars'}</option>)}</select></label>
      <label className="grid gap-2">Your review<textarea required minLength={3} maxLength={1000} rows={4} value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} className={inputClass} /></label>
      <p className="text-sm opacity-70">Your name and review will be public. Please don’t include private contact details.</p>
      <button disabled={busy} className="rounded-xl bg-cyan-400 px-6 py-3 font-bold text-black disabled:opacity-50">{busy ? 'Submitting...' : 'Submit review'}</button>
    </form>}
    {loading ? <p role="status">Loading reviews...</p> : loadError ? <p role="alert">{loadError} <button onClick={() => reload()} className="underline">Retry</button></p> : <>
      <p className="mb-4 opacity-70">{result.total} {result.total === 1 ? 'review' : 'reviews'}</p>
      {result.reviews.length === 0 ? <p>No reviews yet.</p> : <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{result.reviews.map(review => <article key={review._id} className="rounded-2xl border border-slate-400/30 p-5">
        <div className="flex flex-wrap justify-between gap-2"><h3 className="break-words font-bold">{review.name}</h3><span aria-label={`${review.rating} out of 5 stars`} className="text-amber-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span></div>
        <time dateTime={review.createdAt} className="mt-2 block text-sm opacity-60">{new Date(review.createdAt).toLocaleDateString()}</time>
        <p className="mt-4 whitespace-pre-wrap break-words">{review.comment}</p>
        {adminToken && <button disabled={busy} onClick={() => remove(review)} className="mt-4 text-red-600 underline disabled:opacity-50">Delete review</button>}
      </article>)}</div>}
      {result.pages > 1 && <nav aria-label="Review pages" className="mt-6 flex items-center gap-5"><button disabled={page <= 1 || busy} onClick={() => reload(page - 1)} className="disabled:opacity-40">Previous</button><span>Page {page} of {result.pages}</span><button disabled={page >= result.pages || busy} onClick={() => reload(page + 1)} className="disabled:opacity-40">Next</button></nav>}
    </>}
  </section>;
}
