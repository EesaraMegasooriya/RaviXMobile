import ServiceError from "../components/ServiceError";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ArrowRight } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../lib/api";

const SURFACE = "border border-white/[0.06] bg-[#0B0F16]";
const RADIUS = "rounded-2xl";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(`${API_BASE_URL}/categories`, { signal: controller.signal })
      .then(({ data }) => setCategories(data.categories || []))
      .catch((error) => {
        if (!axios.isCancel(error)) setError("Something went wrong. Please contact RaviX Mobile for help.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt]);

  return (
    <main className="min-h-screen bg-[#05080B] px-6 pb-24 pt-32 text-white md:pt-40">
      <section className="mx-auto max-w-[1360px]">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            Product <span className="text-cyan-300">categories</span>
          </h1>
          <p className="mt-5 text-lg text-gray-400">
            Explore our mobile accessories by category.
          </p>
        </div>

        {loading ? (
          <p role="status" className="text-center text-gray-400">
            Loading categories…
          </p>
        ) : error ? (
          <ServiceError
            message={error}
            onRetry={() => {
              setLoading(true);
              setError("");
              setAttempt((n) => n + 1);
            }}
          />
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-400">No categories available yet. Please check back soon.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/shop?category=${encodeURIComponent(category.name)}`}
                className={`group ${RADIUS} ${SURFACE} p-7 transition hover:border-cyan-400/30`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/5 text-cyan-300">
                  <Package size={22} />
                </div>
                <h2 className="mt-6 text-xl font-semibold">{category.name}</h2>
                <p className="mt-2 text-gray-500">{category.productCount} products</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-300">
                  View products
                  <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        )}

        <Link
          to="/shop"
          className="mt-12 inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-cyan-300"
        >
          Browse all products <ArrowRight size={14} />
        </Link>
      </section>
    </main>
  );
}