import { Link } from "react-router-dom";
import ProductPrice, { Availability } from "../components/ProductPrice";
import { purchaseLabel, whatsappProductUrl } from "../lib/products";
import Reviews from "../components/Reviews";
import ServiceError from "../components/ServiceError";
import ProductImage from "../components/ProductImage";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, WHATSAPP_NUMBER, getProductImageUrl } from "../lib/api";
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  Headphones,
  Sparkles,
  Star,
  Smartphone,
} from "lucide-react";
import { FloatingWhatsApp } from "react-floating-whatsapp";
import Logo from "../assets/Logo.png";
import Image from "../assets/image.png";

// Shared tokens so spacing/radius/border stay consistent across every section.
// Same palette as the reference file — bg-[#05080B]/#0B0F16 + cyan-400 accent.
const SURFACE = "bg-[#0B0F16] border border-white/[0.06]";
const RADIUS = "rounded-2xl";

function Home() {
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [failedHeroUrl, setFailedHeroUrl] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(`${API_BASE_URL}/settings`, { signal: controller.signal })
      .then(({ data }) => setHeroImageUrl(getProductImageUrl(data.settings.heroImageUrl)))
      .catch(() => {
        /* Keep the bundled hero when settings are unavailable. */
      });
    return () => controller.abort();
  }, []);

  const [products, setProducts] = useState([]);
  const [catalogCategories, setCatalogCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      axios.get(`${API_BASE_URL}/products`, { signal: controller.signal }),
      axios.get(`${API_BASE_URL}/categories`, { signal: controller.signal }),
    ])
      .then(([productsResult, categoriesResult]) => {
        setProducts(productsResult.data.products.slice(0, 8));
        setCatalogCategories(categoriesResult.data.categories);
      })
      .catch((error) => {
        if (!axios.isCancel(error))
          setError("Something went wrong. Please try again in a moment, or contact RaviX Mobile for help.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const features = [
    [Truck, "Free shipping", "On orders over 10,000 LKR"],
    [ShieldCheck, "2-year warranty", "On every RaviX product"],
    [Headphones, "24/7 support", "Real humans, real fast"],
    [Sparkles, "Trusted brands", "Apple, Samsung, Anker"],
  ];

  const categories = catalogCategories.map((category) => [
    Smartphone,
    category.name,
    category.productCount,
  ]);

  const heroSrc = heroImageUrl && failedHeroUrl !== heroImageUrl ? heroImageUrl : Image;

  return (
    <main className="min-h-screen bg-[#05080B] text-white">
      {/* HERO — full-bleed banner, image fills the section edge-to-edge ---- */}
      <section className="relative h-[86vh] min-h-[560px] w-full overflow-hidden">
        <img
          src={heroSrc}
          onError={() => setFailedHeroUrl(heroImageUrl)}
          alt="Premium RaviX mobile accessories including earbuds, chargers, power banks, and smart wearables"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        {/* Scrim: dark on the left for legible text, opens up toward the image on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#05080B] via-[#05080B]/80 to-[#05080B]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05080B] via-transparent to-transparent" />

        <div className="relative mx-auto flex h-full max-w-[1360px] items-center px-6 md:px-10">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/5 px-4 py-1.5 text-sm text-cyan-300">
              <Sparkles size={14} />
              New this season
            </div>

            <h1 className="max-w-xl text-[2.75rem] font-bold leading-[1.08] tracking-tight md:text-6xl">
              Gear built for how you actually use your phone.
            </h1>

            <p className="mt-6 max-w-md text-lg leading-relaxed text-gray-300">
              Wireless audio, fast charging and wearables from brands people
              already trust — picked for daily use, not just the spec sheet.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="/shop"
                className="inline-flex items-center gap-2.5 rounded-full bg-cyan-400 px-7 py-3.5 font-semibold text-black transition hover:bg-cyan-300"
              >
                Shop now <ArrowRight size={17} />
              </a>
              <a
                href="/categories"
                className="inline-flex items-center rounded-full px-7 py-3.5 font-semibold text-gray-200 transition hover:text-cyan-300"
              >
                Browse categories
              </a>
            </div>
          </div>
        </div>

        {/* Stats sit on the banner itself, anchored to its bottom edge */}
        <div className="absolute inset-x-0 bottom-0">
          <dl className="mx-auto flex max-w-[1360px] flex-wrap gap-8 border-t border-white/10 bg-[#05080B]/70 px-6 py-6 backdrop-blur-sm md:px-10">
            {[
              ["10K+", "Happy customers"],
              ["500+", "Products"],
              ["4.9", "Average rating"],
            ].map(([num, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="text-2xl font-bold text-cyan-300">{num}</dd>
                <dd className="mt-1 text-sm text-gray-400">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* FEATURE STRIP ---------------------------------------------------- */}
      <section className="mx-auto max-w-[1360px] px-6 pt-16 md:px-10">
        <div className={`grid divide-y divide-white/[0.06] sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4 ${SURFACE} ${RADIUS}`}>
          {features.map(([Icon, title, desc]) => (
            <div key={title} className="flex items-center gap-4 px-7 py-6">
              <Icon size={20} className="shrink-0 text-cyan-300" />
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LATEST PRODUCTS --------------------------------------------------- */}
      <section className="mx-auto max-w-[1360px] px-6 py-28 md:px-10">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-bold md:text-5xl">Latest products</h2>
            <p className="mt-4 max-w-md text-lg text-gray-400">
              Fresh arrivals from our shop, updated regularly.
            </p>
          </div>
          <a href="/shop" className="inline-flex items-center gap-2 font-semibold text-cyan-300 hover:text-cyan-200">
            View all <ArrowRight size={17} />
          </a>
        </div>

        {loading && <p role="status" className="mb-6 text-gray-400">Loading products…</p>}
        {error && (
          <div className="mb-6">
            <ServiceError message={error} onRetry={() => window.location.reload()} />
          </div>
        )}
        {!loading && !error && products.length === 0 && (
          <p className="text-gray-400">Our collection is being updated. Please check back soon.</p>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => {
            const productHref = `/products/${p._id}`;
            return (
              <article
                key={p._id}
                className={`group flex h-full min-w-0 flex-col overflow-hidden ${RADIUS} bg-[#0B0F16] border border-white/[0.06] transition hover:border-cyan-400/30`}
              >
                {/* Whole visual + title is one real link — avoids the
                    div[role=link]-wrapping-real-links pattern from the
                    reference file, which double-exposes navigation to
                    screen readers and keyboard users. */}
                <Link
                  to={productHref}
                  className="flex min-w-0 flex-1 flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                >
                  <div className="relative aspect-square shrink-0 bg-black">
                    <ProductImage
                      src={getProductImageUrl(p.img)}
                      alt={p.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                    {p.badge && (
                      <span className="absolute left-3 top-3 rounded-full bg-cyan-400 px-3 py-1 text-xs font-bold text-black">
                        {p.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-col gap-3 p-5 pb-0">
                    <div className="flex items-start justify-between gap-3 text-sm text-gray-500">
                      <span className="min-w-0 truncate">{p.brand}</span>
                      <span className="flex shrink-0 items-center gap-1 text-gray-300">
                        <Star size={13} className="fill-cyan-300 text-cyan-300" />
                        {p.rating}
                      </span>
                    </div>

                    <h3 className="line-clamp-2 min-h-11 text-base font-semibold leading-6 group-hover:text-cyan-300">
                      {p.name}
                    </h3>

                    <Availability product={p} />
                  </div>
                </Link>

                {/* Sibling action, not nested inside the link above */}
                <div className="mt-3 space-y-3 p-5 pt-0">
                  <ProductPrice product={p} />
                  <a
                    href={whatsappProductUrl(p, { phone: WHATSAPP_NUMBER, origin: window.location.origin })}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-lg bg-cyan-400 py-2.5 text-center text-sm font-semibold text-black transition hover:bg-cyan-300"
                  >
                    {purchaseLabel(p)}
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* PROMO -------------------------------------------------------------- */}
      <section className="mx-auto max-w-[1360px] px-6 md:px-10">
        <div className="relative overflow-hidden rounded-[28px] border border-cyan-400/20 bg-[#0A1119] px-8 py-14 md:px-16 md:py-20">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/15 blur-[110px]" />
          <div className="relative max-w-xl">
            <span className="inline-block rounded-full bg-cyan-400 px-4 py-1.5 text-xs font-bold text-black">
              Current offers
            </span>
            <h2 className="mt-6 text-3xl font-bold leading-tight md:text-4xl">
              Save on select accessories, no code needed.
            </h2>
            <p className="mt-5 text-lg text-gray-400">
              Discounts are applied automatically and shown on each product page.
            </p>
            <a
              href="/shop?sale=true"
              className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-cyan-400 px-7 py-3.5 font-semibold text-black transition hover:bg-cyan-300"
            >
              View discounted products <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>

      {/* CATEGORIES ----------------------------------------------------------- */}
      <section className="mx-auto max-w-[1360px] px-6 py-28 md:px-10">
        <div className="mb-12">
          <h2 className="text-4xl font-bold md:text-5xl">Shop by category</h2>
          <p className="mt-4 max-w-md text-lg text-gray-400">
            Find exactly what you need across our curated collections.
          </p>
        </div>

        <div className={`divide-y divide-white/[0.06] ${SURFACE} ${RADIUS}`}>
          {categories.map(([Icon, title, count]) => (
            <a
              key={title}
              href={`/shop?category=${encodeURIComponent(title)}`}
              className="group flex items-center justify-between gap-6 px-7 py-6 transition hover:bg-white/[0.02]"
            >
              <div className="flex items-center gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/5 text-cyan-300">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold group-hover:text-cyan-300">{title}</h3>
                  <p className="text-sm text-gray-500">{count} products</p>
                </div>
              </div>
              <ArrowRight size={18} className="shrink-0 text-gray-600 transition group-hover:translate-x-1 group-hover:text-cyan-300" />
            </a>
          ))}
        </div>
      </section>

      <Reviews />

      <FloatingWhatsApp
        phoneNumber={WHATSAPP_NUMBER}
        accountName="RavixMobile"
        chatMessage="Hello there! 🤝 How can I help?"
        avatar={Logo}
        statusMessage="Online"
        inputStyle={{
          color: "#000000",
          backgroundColor: "#ffffff",
        }}
      />
    </main>
  );
}

export default Home;