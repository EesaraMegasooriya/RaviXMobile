import ServiceError from "../components/ServiceError";
import ProductPrice, { Availability } from "../components/ProductPrice";
import { pricing, availabilityOf, purchaseLabel, whatsappProductUrl } from "../lib/products";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE_URL, WHATSAPP_NUMBER, getProductImageUrl } from "../lib/api";
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowRight,
  Package,
  MessageCircle,
  Star,
} from "lucide-react";

const SURFACE = "border border-white/[0.06] bg-[#0B0F16]";
const RADIUS = "rounded-2xl";

/* -------------------------------------------------------------------------- */
/*                              Product Image                                 */
/* -------------------------------------------------------------------------- */

function ProductImage({ product }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!product.img || imageFailed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-gray-600">
        <Package size={32} strokeWidth={1.6} />
        <span className="text-xs font-medium">No image</span>
      </div>
    );
  }

  return (
    <img
      src={getProductImageUrl(product.img)}
      alt={product.name}
      loading="lazy"
      onError={() => setImageFailed(true)}
      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                              Product Card                                  */
/* -------------------------------------------------------------------------- */

function ProductCard({ product }) {
  const navigate = useNavigate();
  const productHref = `/products/${product._id}`;
  const goToProduct = () => navigate(productHref);
  // Stop the WhatsApp/Details clicks from also triggering the card's own navigation.
  const stopBubble = (event) => event.stopPropagation();

  return (
    <article
      onClick={goToProduct}
      onKeyDown={(event) => {
        if (event.key === "Enter") goToProduct();
      }}
      role="link"
      tabIndex={0}
      aria-label={product.name}
      className={`group flex h-full cursor-pointer flex-col overflow-hidden ${RADIUS} ${SURFACE} transition hover:border-cyan-400/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60`}
    >
      <div className="relative aspect-square shrink-0 bg-black">
        <ProductImage product={product} />

        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-cyan-400 px-3 py-1 text-xs font-bold text-black">
            {product.badge}
          </span>
        )}

        <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-xs font-medium text-gray-200 backdrop-blur-sm">
          <Star size={12} className="fill-cyan-300 text-cyan-300" />
          {Number(product.rating || 0).toFixed(1)}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <span className="min-w-0 truncate font-medium text-gray-300">{product.brand}</span>
          {product.category && (
            <>
              <span className="h-1 w-1 shrink-0 rounded-full bg-gray-700" />
              <span className="truncate">{product.category}</span>
            </>
          )}
        </div>

        <h3 className="line-clamp-2 min-h-11 text-base font-semibold leading-6 group-hover:text-cyan-300">
          {product.name}
        </h3>

        <Availability product={product} />

        <div className="mt-auto space-y-3 pt-2">
          <ProductPrice product={product} />
          <div className="flex gap-2">
            <Link
              to={productHref}
              onClick={stopBubble}
              className="flex-1 rounded-lg border border-white/10 py-2.5 text-center text-sm font-medium text-gray-300 transition hover:border-cyan-400/40 hover:text-cyan-300"
            >
              Details
            </Link>
            <a
              href={whatsappProductUrl(product, { phone: WHATSAPP_NUMBER, origin: window.location.origin })}
              target="_blank"
              rel="noreferrer"
              onClick={stopBubble}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#25D366] py-2.5 text-sm font-semibold text-black transition hover:brightness-105"
            >
              <MessageCircle size={15} />
              {purchaseLabel(product)}
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Shop                                     */
/* -------------------------------------------------------------------------- */

function Shop() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [onSaleOnly, setOnSaleOnly] = useState(searchParams.get("sale") === "true");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchShopData = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const [productsResponse, categoriesResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/products`),
        axios.get(`${API_BASE_URL}/categories`),
      ]);

      setProducts(productsResponse.data.products || []);
      setCategories(categoriesResponse.data.categories || []);
    } catch (error) {
      console.error("Unable to load shop:", error);
      setErrorMessage("Something went wrong. Please contact RaviX Mobile for help.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial API synchronization also sets the loading indicators.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchShopData();
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = products.filter((product) => {
      if (onSaleOnly && !pricing(product).discounted) return false;
      if (inStockOnly && availabilityOf(product) !== "in_stock") return false;

      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!normalizedSearch) return true;

      const searchableContent = [product.brand, product.name, product.category, product.badge, product.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableContent.includes(normalizedSearch);
    });

    return [...filtered].sort((firstProduct, secondProduct) => {
      switch (sortBy) {
        case "price-low":
          return pricing(firstProduct).current - pricing(secondProduct).current;
        case "price-high":
          return pricing(secondProduct).current - pricing(firstProduct).current;
        case "rating":
          return Number(secondProduct.rating || 0) - Number(firstProduct.rating || 0);
        case "name":
          return String(firstProduct.name || "").localeCompare(String(secondProduct.name || ""));
        case "newest":
        default:
          return new Date(secondProduct.createdAt || 0).getTime() - new Date(firstProduct.createdAt || 0).getTime();
      }
    });
  }, [products, searchTerm, selectedCategory, sortBy, onSaleOnly, inStockOnly]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSortBy("newest");
    setOnSaleOnly(false);
    setInStockOnly(false);
  };

  const hasActiveFilters = searchTerm || onSaleOnly || inStockOnly || selectedCategory || sortBy !== "newest";

  const sortOptions = [
    ["newest", "Newest first"],
    ["price-low", "Price: low to high"],
    ["price-high", "Price: high to low"],
    ["rating", "Highest rated"],
    ["name", "Product name"],
  ];

  return (
    <main className="min-h-screen bg-[#05080B] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.06] pt-32 pb-16 md:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:56px_56px]" />
        <div className="pointer-events-none absolute -top-32 left-1/3 h-[420px] w-[560px] rounded-full bg-cyan-500/10 blur-[150px]" />

        <div className="relative mx-auto max-w-[1360px] px-6 md:px-10">
          <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Every RaviX accessory, in one place.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-gray-400">
            Wireless earbuds, chargers, cables and power banks from trusted
            brands — filter by category or search for exactly what you need.
          </p>
          <p className="mt-5 text-sm text-gray-500">
            <span className="font-semibold text-white">{products.length}</span> products in the catalog
          </p>
        </div>
      </section>

      {/* Shop content */}
      <section className="mx-auto max-w-[1360px] px-6 py-14 md:px-10">
        {/* Search and sort */}
        <div className={`${RADIUS} ${SURFACE} p-4 sm:p-5`}>
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search products, brands or categories…"
                className="w-full rounded-xl border border-white/10 bg-black/30 py-3.5 pl-11 pr-11 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/50"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowMobileFilters((v) => !v)}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/30 px-5 py-3.5 text-sm font-medium text-gray-300 lg:hidden"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>

            <select
              aria-label="Sort products"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="hidden min-w-[200px] rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm font-medium text-gray-300 outline-none focus:border-cyan-400/50 lg:block"
            >
              {sortOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex flex-wrap gap-6 text-sm text-gray-300">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={onSaleOnly} onChange={(e) => setOnSaleOnly(e.target.checked)} />
              On sale
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
              In stock only
            </label>
          </div>

          {showMobileFilters && (
            <div className="mt-4 border-t border-white/[0.06] pt-4 lg:hidden">
              <label className="mb-2 block text-xs font-medium text-gray-500">Sort products</label>
              <select
                aria-label="Sort products"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm font-medium text-gray-300 outline-none"
              >
                {sortOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold">Categories</h2>
            {hasActiveFilters && (
              <button type="button" onClick={clearFilters} className="text-sm font-medium text-gray-400 hover:text-cyan-300">
                Clear filters
              </button>
            )}
          </div>

          <div className="mt-4 flex gap-2.5 overflow-x-auto pb-2">
            <button
              type="button"
              onClick={() => setSelectedCategory("")}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                !selectedCategory
                  ? "border-cyan-400 bg-cyan-400 text-black"
                  : "border-white/10 text-gray-300 hover:border-cyan-400/40 hover:text-cyan-300"
              }`}
            >
              All products <span className="opacity-70">{products.length}</span>
            </button>

            {categories.map((category) => (
              <button
                key={category._id}
                type="button"
                onClick={() => setSelectedCategory(category.name)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                  selectedCategory === category.name
                    ? "border-cyan-400 bg-cyan-400 text-black"
                    : "border-white/10 text-gray-300 hover:border-cyan-400/40 hover:text-cyan-300"
                }`}
              >
                {category.name} <span className="opacity-70">{category.productCount ?? ""}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="mt-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold">{selectedCategory || "All products"}</h2>
            <p className="mt-1.5 text-sm text-gray-500">
              {filteredProducts.length} product{filteredProducts.length === 1 ? "" : "s"} found
              {searchTerm ? ` for "${searchTerm}"` : ""}
            </p>
          </div>

          {selectedCategory && (
            <button
              type="button"
              onClick={() => setSelectedCategory("")}
              className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-cyan-300 hover:text-cyan-200 sm:self-auto"
            >
              View all products <ArrowRight size={14} />
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/10 border-t-cyan-400" />
            <p className="mt-4 text-sm text-gray-500">Loading RaviX products…</p>
          </div>
        ) : errorMessage ? (
          <div className="mt-8">
            <ServiceError message={errorMessage} onRetry={fetchShopData} />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className={`mt-8 flex min-h-[300px] flex-col items-center justify-center px-6 text-center ${RADIUS} ${SURFACE}`}>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 text-gray-500">
              <Package size={24} />
            </div>
            <h3 className="mt-5 text-lg font-semibold">No products found</h3>
            <p className="mt-2 max-w-md text-sm text-gray-500">
              No products match your current search and category filters.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2.5 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400 hover:text-black"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Floating WhatsApp */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
          "Hello RaviXMobile, I would like to know more about your products."
        )}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Contact RaviXMobile on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white transition hover:brightness-105"
      >
        <MessageCircle size={26} />
      </a>
    </main>
  );
}

export default Shop;