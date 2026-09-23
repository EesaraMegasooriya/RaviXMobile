import ServiceError from "../components/ServiceError";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../lib/api';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    axios.get(`${API_BASE_URL}/categories`, { signal: controller.signal })
      .then(({ data }) => setCategories(data.categories || []))
      .catch(error => { if (!axios.isCancel(error)) setError('Something went wrong. Please contact RaviX Mobile for help.'); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [attempt]);
  return (
    <main className="min-h-screen bg-[#05080B] px-6 pb-20 pt-[140px] text-white">
      <section className="mx-auto max-w-[1360px]">
        <h1 className="mb-5 text-center text-4xl font-bold md:text-6xl">Product <span className="text-cyan-400">Categories</span></h1>
        <p className="mb-12 text-center text-gray-400">Explore our mobile accessories by category.</p>
        {loading ? <p role="status">Loading categories...</p> : error ? <ServiceError onRetry={() => { setLoading(true); setError(''); setAttempt(n => n + 1); }} /> : categories.length === 0 ? <p>No categories available yet. Please check back soon.</p> : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(category => (
              <Link key={category._id} to={`/shop?category=${encodeURIComponent(category.name)}`} className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition hover:border-cyan-400">
                <Package className="mb-6 text-cyan-400" size={32} />
                <h2 className="text-2xl font-semibold">{category.name}</h2>
                <p className="mt-3 text-gray-400">{category.productCount} products</p>
                <span className="mt-6 block text-cyan-400">View products →</span>
              </Link>
            ))}
          </div>
        )}
        <Link to="/shop" className="mt-10 inline-block text-cyan-400">Browse all products →</Link>
      </section>
    </main>
  );
}
