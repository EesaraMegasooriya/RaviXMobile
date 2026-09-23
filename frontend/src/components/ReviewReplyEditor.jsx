import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../lib/api';
export default function ReviewReplyEditor({ review, adminToken, onAuthError, onSaved }) {
  const [reply, setReply] = useState(review.reply || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function save(event, remove = false) {
    event.preventDefault();
    if (remove && !window.confirm('Remove this admin reply?')) return;
    setBusy(true); setError('');
    try {
      const config = { headers: { Authorization: `Bearer ${adminToken}` } };
      const url = `${API_BASE_URL}/admin/reviews/${review._id}/reply`;
      const { data } = remove ? await axios.delete(url, config) : await axios.put(url, { reply: reply.trim() }, config);
      setReply(data.review.reply || '');
      onSaved(data.review);
    } catch (error) {
      if (error.response?.status === 401) onAuthError?.(error, 'Your session has expired.');
      setError(error.response?.data?.message || 'Unable to save your reply.');
    } finally { setBusy(false); }
  }
  return <form onSubmit={save} className="min-w-0 space-y-3">
    <label className="block text-sm font-semibold [overflow-wrap:anywhere]">Reply to {review.name}<textarea aria-label={`Reply to ${review.name}`} required maxLength={2000} rows={3} value={reply} onChange={e => setReply(e.target.value)} disabled={busy} className="mt-2 min-h-28 w-full min-w-0 resize-y rounded-xl border border-slate-300 bg-white p-3 text-base font-normal leading-6 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></label>
    <p className="text-xs text-slate-500">Published as “RaviX Mobile”.</p>
    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    <div className="grid gap-2 sm:grid-cols-2"><button disabled={busy || !reply.trim()} className="min-h-11 rounded-xl bg-blue-600 px-3 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50">{busy ? 'Saving...' : review.reply ? 'Update reply' : 'Post reply'}</button>{review.reply && <button type="button" disabled={busy} onClick={event => save(event, true)} className="min-h-11 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50">Remove reply</button>}</div>
  </form>;
}
