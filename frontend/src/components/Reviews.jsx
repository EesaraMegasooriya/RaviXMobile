import ServiceError, { ContactSupport } from "./ServiceError";
import ReviewReplyEditor from "./ReviewReplyEditor";
import { useEffect, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";
import { API_BASE_URL } from "../lib/api";

const emptyForm = { name: "", rating: "5", comment: "" };
const MAX_COMMENT_LENGTH = 1000;

export default function Reviews({ adminToken, onAuthError, onInitialLoad }) {
  const [form, setForm] = useState(emptyForm);
  const [hoverRating, setHoverRating] = useState(0);
  const [result, setResult] = useState({ reviews: [], total: 0, pages: 0 });
  const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(`${API_BASE_URL}/reviews?page=${page}`, {
        signal: controller.signal,
        timeout: 20000,
      })
      .then(({ data }) => {
        setResult(data);
        setLoadError("");
      })
      .catch((error) => {
        if (!axios.isCancel(error))
          setLoadError("Unable to load reviews. Please try again.");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
          onInitialLoad?.(false);
        }
      });
    return () => controller.abort();
  }, [page, revision, onInitialLoad]);
  function reload(nextPage = page) {
    setLoading(true);
    setPage(nextPage);
    setRevision((value) => value + 1);
  }
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await axios.post(`${API_BASE_URL}/reviews`, {
        name: form.name.trim(),
        rating: Number(form.rating),
        comment: form.comment.trim(),
      });
      setForm(emptyForm);
      setMessage("Thank you! Your review has been published.");
      reload(1);
    } catch (error) {
      setError(
        error.response?.status === 400
          ? "Please check your name, rating and review, then try again."
          : error.response?.status === 429
            ? "Please wait a few minutes before submitting another review."
            : "Something went wrong. Your review could not be submitted. Please try again or contact RaviX Mobile for help.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function remove(review) {
    if (!window.confirm(`Delete the review by ${review.name}?`)) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await axios.delete(`${API_BASE_URL}/admin/reviews/${review._id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setMessage("Review deleted.");
      reload(result.reviews.length === 1 ? Math.max(1, page - 1) : page);
    } catch (error) {
      if (error.response?.status === 401)
        onAuthError?.(error, "Your session has expired.");
      setError(
        error.response?.data?.message || "Unable to delete this review.",
      );
    } finally {
      setBusy(false);
    }
  }
  const isAdmin = Boolean(adminToken);
  const inputClass =
    "min-w-0 w-full rounded-xl border border-white/15 bg-[#05080B] px-4 py-3 text-base text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20";
  const panelClass = isAdmin
    ? "border-slate-200 bg-slate-50 text-slate-600"
    : "border-white/10 bg-[#0D111A] text-gray-400";
  const activeRating = hoverRating || Number(form.rating);
  const skeletonClass = isAdmin
    ? "border-slate-200 bg-slate-100"
    : "border-white/10 bg-[#0D111A]";

  return (
    <section
      aria-labelledby={
        isAdmin ? "admin-reviews-title" : "customer-reviews-title"
      }
      className={
        isAdmin
          ? "mb-8 min-w-0 rounded-2xl bg-white p-4 text-slate-900 shadow-sm sm:p-6"
          : "mx-auto w-full max-w-[1360px] px-6 py-16 text-white md:px-10 md:py-20"
      }
    >
      <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2
            id={isAdmin ? "admin-reviews-title" : "customer-reviews-title"}
            className="text-2xl font-bold tracking-tight sm:text-3xl"
          >
            Customer reviews
          </h2>
          <p
            className={`mt-2 text-sm leading-6 sm:text-base ${isAdmin ? "text-slate-500" : "text-gray-400"}`}
          >
            {isAdmin
              ? "Manage customer feedback and reply to reviews."
              : "Share your experience with RaviX Mobile."}
          </p>
        </div>
        {!loading && !loadError && (
          <span
            className={`w-fit shrink-0 rounded-full border px-4 py-2 text-sm font-semibold ${panelClass}`}
          >
            {result.total} {result.total === 1 ? "review" : "reviews"}
          </span>
        )}
      </header>
      {message && (
        <p
          role="status"
          className={`mb-6 rounded-xl border px-4 py-3 text-sm leading-6 ${isAdmin ? "border-green-200 bg-green-50 text-green-800" : "border-green-400/20 bg-green-400/10 text-green-300"}`}
        >
          {message}
        </p>
      )}
      {error && (
        <div
          role="alert"
          className={`mb-6 rounded-xl border px-4 py-3 text-sm leading-6 ${isAdmin ? "border-red-200 bg-red-50 text-red-700" : "border-red-400/20 bg-red-400/10 text-red-300"}`}
        >
          <p>{error}</p>
          <ContactSupport light={isAdmin} />
        </div>
      )}
      <div
        className={
          isAdmin
            ? "min-w-0"
            : "grid items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)] xl:gap-8"
        }
      >
        {!isAdmin && (
          <form
            onSubmit={submit}
            className="grid min-w-0 gap-5 rounded-2xl border border-white/10 bg-[#0D111A] p-5 sm:p-6"
          >
            <div>
              <h3 className="text-xl font-bold">Write a review</h3>
              <p className="mt-2 text-sm leading-6 text-gray-400">
                Tell us how your shopping experience went.
              </p>
            </div>

            <label className="grid min-w-0 gap-2 text-sm font-semibold">
              Your name
              <input
                aria-label="Your name"
                required
                maxLength={80}
                autoComplete="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
            </label>

            {/* Star picker replaces the numeric dropdown so the input matches
                the star display used everywhere the rating is shown. */}
            <fieldset className="grid min-w-0 gap-2">
              <legend className="text-sm font-semibold">Rating</legend>
              <div
                className="flex items-center gap-1"
                onMouseLeave={() => setHoverRating(0)}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <label
                    key={n}
                    className="cursor-pointer p-0.5"
                    onMouseEnter={() => setHoverRating(n)}
                  >
                    <input
                      type="radio"
                      name="rating"
                      value={n}
                      checked={Number(form.rating) === n}
                      onChange={() => setForm({ ...form, rating: String(n) })}
                      className="sr-only"
                      aria-label={`${n} ${n === 1 ? "star" : "stars"}`}
                    />
                    <Star
                      size={26}
                      className={
                        n <= activeRating
                          ? "fill-cyan-400 text-cyan-400 transition"
                          : "text-white/15 transition"
                      }
                    />
                  </label>
                ))}
                <span className="ml-2 text-sm text-gray-400">
                  {form.rating} {Number(form.rating) === 1 ? "star" : "stars"}
                </span>
              </div>
            </fieldset>

            <label className="grid min-w-0 gap-2 text-sm font-semibold">
              <span className="flex items-baseline justify-between gap-3">
                Your review
                <span className="text-xs font-normal text-gray-500">
                  {form.comment.length}/{MAX_COMMENT_LENGTH}
                </span>
              </span>
              <textarea
                aria-label="Your review"
                required
                minLength={3}
                maxLength={MAX_COMMENT_LENGTH}
                rows={5}
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                className={`${inputClass} min-h-32 resize-y`}
              />
            </label>

            <p className="text-xs leading-5 text-gray-400">
              Your name and review will be public. Please don't include private
              contact details.
            </p>
            <button
              disabled={busy}
              className="min-h-12 w-full rounded-xl bg-cyan-400 px-5 py-3 font-bold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "Submitting..." : "Submit review"}
            </button>
          </form>
        )}
        <div className="min-w-0">
          {loading ? (
            <div role="status" aria-live="polite">
              <span className="sr-only">Loading reviews…</span>
              <div
                className={`grid items-stretch gap-5 ${isAdmin ? "md:grid-cols-2 2xl:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"}`}
              >
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-44 animate-pulse rounded-2xl border ${skeletonClass}`}
                  />
                ))}
              </div>
            </div>
          ) : loadError ? (
            <ServiceError light={isAdmin} onRetry={() => reload()} />
          ) : (
            <>
              {result.reviews.length === 0 ? (
                <div
                  className={`rounded-2xl border border-dashed p-8 text-center ${panelClass}`}
                >
                  <p className="font-semibold">No reviews yet</p>
                  <p className="mt-2 text-sm leading-6">
                    {isAdmin
                      ? "Customer reviews will appear here."
                      : "Be the first to share your experience."}
                  </p>
                </div>
              ) : (
                <div
                  className={`grid items-stretch gap-5 ${isAdmin ? "md:grid-cols-2 2xl:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"}`}
                >
                  {result.reviews.map((review) => (
                    <article
                      key={review._id}
                      className={`flex h-full min-w-0 flex-col rounded-2xl border p-5 sm:p-6 ${isAdmin ? "border-slate-200 bg-white" : "border-white/10 bg-[#0D111A]"}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="min-w-0 flex-1 font-bold leading-6 [overflow-wrap:anywhere]">
                          {review.name}
                        </h3>
                        <span
                          aria-label={`${review.rating} out of 5 stars`}
                          className={`shrink-0 whitespace-nowrap text-base leading-6 tracking-wide ${isAdmin ? "text-amber-500" : "text-cyan-400"}`}
                        >
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </span>
                      </div>
                      <time
                        dateTime={review.createdAt}
                        className={`mt-2 block text-xs ${isAdmin ? "text-slate-500" : "text-gray-400"}`}
                      >
                        {new Date(review.createdAt).toLocaleDateString()}
                      </time>
                      <p
                        className={`mt-5 flex-1 whitespace-pre-wrap text-sm leading-7 [overflow-wrap:anywhere] ${isAdmin ? "text-slate-700" : "text-white/80"}`}
                      >
                        {review.comment}
                      </p>
                      {review.reply && (
                        <div
                          className={`mt-5 min-w-0 rounded-xl border p-4 ${isAdmin ? "border-cyan-100 bg-cyan-50" : "border-cyan-400/15 bg-cyan-400/5"}`}
                        >
                          <p
                            className={`text-sm font-bold ${isAdmin ? "text-cyan-800" : "text-cyan-300"}`}
                          >
                            RaviX Mobile
                          </p>
                          {review.repliedAt && (
                            <time
                              dateTime={review.repliedAt}
                              className={`mt-1 block text-xs ${isAdmin ? "text-slate-500" : "text-gray-400"}`}
                            >
                              {new Date(review.repliedAt).toLocaleDateString()}
                            </time>
                          )}
                          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 [overflow-wrap:anywhere]">
                            {review.reply}
                          </p>
                        </div>
                      )}
                      {isAdmin && (
                        <div className="mt-5 border-t border-slate-200 pt-5">
                          <ReviewReplyEditor
                            review={review}
                            adminToken={adminToken}
                            onAuthError={onAuthError}
                            onSaved={(updated) => {
                              setResult((current) => ({
                                ...current,
                                reviews: current.reviews.map((item) =>
                                  item._id === updated._id ? updated : item,
                                ),
                              }));
                              setMessage(
                                updated.reply
                                  ? "Reply published."
                                  : "Reply removed.",
                              );
                            }}
                          />
                          <button
                            disabled={busy}
                            onClick={() => remove(review)}
                            className="mt-4 min-h-11 w-full rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            Delete review
                          </button>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
              {result.pages > 1 && (
                <nav
                  aria-label="Review pages"
                  className={`mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-5 ${isAdmin ? "border-slate-200" : "border-white/10"}`}
                >
                  <button
                    disabled={page <= 1 || busy}
                    onClick={() => reload(page - 1)}
                    className={`min-h-11 rounded-xl border px-4 py-2 text-sm font-semibold disabled:opacity-40 ${isAdmin ? "border-slate-200" : "border-white/15"}`}
                  >
                    Previous
                  </button>
                  <span className="text-sm">
                    Page {page} of {result.pages}
                  </span>
                  <button
                    disabled={page >= result.pages || busy}
                    onClick={() => reload(page + 1)}
                    className={`min-h-11 rounded-xl border px-4 py-2 text-sm font-semibold disabled:opacity-40 ${isAdmin ? "border-slate-200" : "border-white/15"}`}
                  >
                    Next
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
