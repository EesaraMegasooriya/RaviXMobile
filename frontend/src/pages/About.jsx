import React, { useEffect, useState } from "react";
import { Award, Truck, Shield, Heart, Star } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../lib/api";

const SURFACE = "border border-white/[0.06] bg-[#0B0F16]";
const RADIUS = "rounded-2xl";
const FEATURED_REVIEW_COUNT = 3;

function About() {
  const reasons = [
    {
      icon: Award,
      title: "Premium quality",
      desc: "Hand-tested products from trusted brands worldwide.",
    },
    {
      icon: Truck,
      title: "Fast delivery",
      desc: "Same-day dispatch with tracked, insured shipping.",
    },
    {
      icon: Shield,
      title: "2-year warranty",
      desc: "Confidence with every purchase, hassle-free returns.",
    },
    {
      icon: Heart,
      title: "Customer love",
      desc: "10,000+ five-star reviews from happy customers.",
    },
  ];

  const brands = ["Apple", "Samsung", "Anker", "RaviX", "Phison"];

  const delivery = [
    ["24h", "Order processing"],
    ["2-5 days", "Standard delivery"],
    ["Free", "Shipping over 10,000 LKR"],
  ];

  // Real customer reviews, fetched from the same endpoint the reviews page
  // uses — replaces the hardcoded testimonial array.
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(`${API_BASE_URL}/reviews?page=1`, { signal: controller.signal })
      .then(({ data }) => {
        const featured = [...(data.reviews || [])]
          .sort((a, b) => b.rating - a.rating || new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, FEATURED_REVIEW_COUNT);
        setReviews(featured);
        setLoadFailed(false);
      })
      .catch((error) => {
        if (!axios.isCancel(error)) setLoadFailed(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const showReviewsSection = loading || (!loadFailed && reviews.length > 0);

  return (
    <main className="min-h-screen bg-[#05080B] text-white">
      {/* HERO */}
      <section className="relative overflow-hidden pt-32 pb-24 md:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:56px_56px]" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[700px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[150px]" />

        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Powering your devices with <span className="text-cyan-300">premium accessories</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-gray-400">
            RaviX Mobile Accessories was founded to deliver high-quality mobile
            accessories at honest prices, backed by service you can trust —
            from earbuds to power banks, every product passes our quality
            checklist before it ships.
          </p>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="mx-auto max-w-[1360px] px-6 py-24 md:px-10">
        <h2 className="mb-12 text-4xl font-bold md:text-5xl">Why choose RaviX</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map(({ icon: Icon, title, desc }) => (
            <div key={title} className={`${RADIUS} ${SURFACE} p-7 transition hover:border-cyan-400/30`}>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/5 text-cyan-300">
                <Icon size={22} />
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2.5 leading-relaxed text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DELIVERY INFO */}
      <section className="mx-auto max-w-[1360px] px-6 md:px-10">
        <div className={`grid divide-y divide-white/[0.06] sm:grid-cols-3 sm:divide-y-0 sm:divide-x ${SURFACE} ${RADIUS}`}>
          {delivery.map(([number, label]) => (
            <div key={label} className="px-8 py-10 text-center">
              <p className="text-4xl font-bold text-cyan-300 md:text-5xl">{number}</p>
              <p className="mt-2.5 text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TRUSTED BRANDS */}
      <section className="mx-auto max-w-[1360px] px-6 py-24 md:px-10">
        <h2 className="mb-12 text-4xl font-bold md:text-5xl">Trusted brands</h2>

        <div className="flex flex-wrap gap-4">
          {brands.map((brand) => (
            <div
              key={brand}
              className={`${RADIUS} ${SURFACE} px-8 py-4 text-base font-semibold text-gray-300 transition hover:border-cyan-400/30 hover:text-cyan-300`}
            >
              {brand}
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS — real data, fetched; the section simply doesn't render if
          the fetch fails or there's nothing to feature yet, rather than
          showing an empty or broken-looking block on a marketing page. */}
      {showReviewsSection && (
        <section className="mx-auto max-w-[1360px] px-6 pb-28 md:px-10">
          <h2 className="mb-12 text-4xl font-bold md:text-5xl">What customers say</h2>

          <div className="grid gap-6 md:grid-cols-3">
            {loading
              ? Array.from({ length: FEATURED_REVIEW_COUNT }).map((_, i) => (
                  <div key={i} className={`${RADIUS} ${SURFACE} h-56 animate-pulse`} />
                ))
              : reviews.map((review) => (
                  <figure key={review._id} className={`${RADIUS} ${SURFACE} flex flex-col p-7 transition hover:border-cyan-400/30`}>
                    <div className="mb-4 flex gap-1">
                      {Array.from({ length: review.rating }).map((_, index) => (
                        <Star key={index} size={15} className="fill-cyan-300 text-cyan-300" />
                      ))}
                    </div>
                    <blockquote className="flex-1 leading-relaxed text-gray-300">"{review.comment}"</blockquote>
                    <figcaption className="mt-6 border-t border-white/[0.06] pt-4 font-semibold">
                      {review.name}
                    </figcaption>
                  </figure>
                ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default About;