import {
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001/api";

const SERVER_BASE_URL = API_BASE_URL.replace(
  /\/api\/?$/,
  ""
);

const WHATSAPP_NUMBER = "94703280480";

const getProductImageUrl = (imagePath) => {
  if (!imagePath) {
    return "";
  }

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("blob:")
  ) {
    return imagePath;
  }

  return `${SERVER_BASE_URL}${imagePath}`;
};

const formatPrice = (price) => {
  const numericPrice = Number(price || 0);

  return `LKR ${numericPrice.toLocaleString("en-LK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

/* -------------------------------------------------------------------------- */
/*                                   Icons                                    */
/* -------------------------------------------------------------------------- */

function SearchIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function CartIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
      <path d="M3 4h2l2.5 11h10l2-7H6" />
    </svg>
  );
}

function FilterIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  );
}

function CloseIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function ArrowIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function PackageIcon({ className = "h-10 w-10" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="m12 3 8 4-8 4-8-4 8-4Z" />
      <path d="M4 7v10l8 4 8-4V7" />
      <path d="M12 11v10" />
    </svg>
  );
}

function WhatsAppIcon({
  className = "h-6 w-6",
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.03 3C8.84 3 3 8.77 3 15.88c0 2.27.6 4.49 1.73 6.43L3 29l6.88-1.77a13.18 13.18 0 0 0 6.15 1.54C23.21 28.77 29 23 29 15.88S23.21 3 16.03 3Zm0 23.56c-1.94 0-3.84-.51-5.5-1.47l-.39-.23-4.08 1.05 1.09-3.96-.26-.41a10.54 10.54 0 0 1-1.66-5.66c0-5.85 4.84-10.66 10.8-10.66 5.95 0 10.78 4.81 10.78 10.66 0 5.87-4.83 10.68-10.78 10.68Zm5.92-7.98c-.32-.16-1.91-.93-2.21-1.04-.3-.1-.51-.16-.73.16-.21.32-.83 1.04-1.02 1.25-.19.21-.38.24-.7.08-.33-.16-1.38-.5-2.62-1.6a9.83 9.83 0 0 1-1.82-2.23c-.19-.32-.02-.5.14-.66.15-.14.33-.37.49-.56.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.73-1.73-1-2.37-.26-.63-.53-.54-.73-.55h-.62c-.22 0-.57.08-.87.4-.3.32-1.13 1.09-1.13 2.66 0 1.57 1.16 3.08 1.32 3.3.16.21 2.28 3.44 5.52 4.82.77.33 1.37.52 1.84.67.77.24 1.47.21 2.03.13.62-.09 1.91-.77 2.18-1.51.27-.74.27-1.37.19-1.51-.08-.13-.3-.21-.62-.37Z" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Product Image                                 */
/* -------------------------------------------------------------------------- */

function ProductImage({ product }) {
  const [imageFailed, setImageFailed] =
    useState(false);

  if (!product.img || imageFailed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-slate-600">
        <PackageIcon className="h-14 w-14" />

        <span className="text-xs font-semibold uppercase tracking-[0.18em]">
          No image
        </span>
      </div>
    );
  }

  return (
    <img
      src={getProductImageUrl(product.img)}
      alt={product.name}
      loading="lazy"
      onError={() => setImageFailed(true)}
      className="h-full w-full object-contain p-5 transition duration-500 group-hover:scale-105"
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                              Product Card                                  */
/* -------------------------------------------------------------------------- */

function ProductCard({
  product,
  onBuyNow,
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.045] shadow-[0_20px_70px_rgba(0,0,0,0.3)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_20px_70px_rgba(0,190,255,0.12)]">
      <div className="relative h-60 overflow-hidden bg-gradient-to-br from-white/[0.07] to-transparent">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(0,190,255,0.13),transparent_55%)]" />

        <ProductImage product={product} />

        {product.badge && (
          <span className="absolute left-4 top-4 rounded-full border border-cyan-300/20 bg-cyan-400 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#041014] shadow-[0_8px_30px_rgba(0,190,255,0.25)]">
            {product.badge}
          </span>
        )}

        <span className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs font-semibold text-slate-200 backdrop-blur-md">
          ★ {Number(product.rating || 0).toFixed(1)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-cyan-400">
            {product.brand}
          </span>

          {product.category && (
            <>
              <span className="h-1 w-1 rounded-full bg-slate-600" />

              <span className="text-xs font-medium text-slate-400">
                {product.category}
              </span>
            </>
          )}
        </div>

        <h3 className="line-clamp-2 min-h-[52px] text-lg font-bold leading-6 text-white">
          {product.name}
        </h3>

        <div className="mt-auto pt-6">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Price
          </p>

          <p className="mt-1 text-2xl font-black text-white">
            {formatPrice(product.price)}
          </p>

          <button
            type="button"
            onClick={() => onBuyNow(product)}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3.5 text-sm font-extrabold text-white transition duration-300 hover:bg-[#20bd5a] hover:shadow-[0_12px_35px_rgba(37,211,102,0.25)]"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Buy Now
          </button>
        </div>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Shop                                     */
/* -------------------------------------------------------------------------- */

function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("");
  const [sortBy, setSortBy] = useState("newest");

  const [showMobileFilters, setShowMobileFilters] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

 

  const fetchShopData = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const [productsResponse, categoriesResponse] =
        await Promise.all([
          axios.get(`${API_BASE_URL}/products`),
          axios.get(`${API_BASE_URL}/categories`),
        ]);

      setProducts(
        productsResponse.data.products || []
      );

      setCategories(
        categoriesResponse.data.categories || []
      );
    } catch (error) {
      console.error("Unable to load shop:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to load products. Please check the backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopData();
  }, []);





  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    const filtered = products.filter((product) => {
      const matchesCategory =
        !selectedCategory ||
        product.category === selectedCategory;

      if (!matchesCategory) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchableContent = [
        product.brand,
        product.name,
        product.category,
        product.badge,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableContent.includes(
        normalizedSearch
      );
    });

    return [...filtered].sort(
      (firstProduct, secondProduct) => {
        switch (sortBy) {
          case "price-low":
            return (
              Number(firstProduct.price || 0) -
              Number(secondProduct.price || 0)
            );

          case "price-high":
            return (
              Number(secondProduct.price || 0) -
              Number(firstProduct.price || 0)
            );

          case "rating":
            return (
              Number(secondProduct.rating || 0) -
              Number(firstProduct.rating || 0)
            );

          case "name":
            return String(
              firstProduct.name || ""
            ).localeCompare(
              String(secondProduct.name || "")
            );

          case "newest":
          default:
            return (
              new Date(
                secondProduct.createdAt || 0
              ).getTime() -
              new Date(
                firstProduct.createdAt || 0
              ).getTime()
            );
        }
      }
    );
  }, [
    products,
    searchTerm,
    selectedCategory,
    sortBy,
  ]);

  const handleAddToCart = (product) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item._id === product._id
      );

      if (existingProduct) {
        return currentCart.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity:
                  Number(item.quantity || 0) + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    setAddedProductId(product._id);

    window.setTimeout(() => {
      setAddedProductId(null);
    }, 1200);
  };

  const handleBuyNow = (product) => {
  const productImage = getProductImageUrl(product.img);

  const message = [
    "Hello RaviXMobile,",
    "",
    "I am interested in purchasing this product:",
    "",
    `Product: ${product.name}`,
    `Brand: ${product.brand || "N/A"}`,
    `Category: ${product.category || "N/A"}`,
    `Price: ${formatPrice(product.price)}`,
    `Rating: ${Number(product.rating || 0).toFixed(1)} / 5`,
    "",
    productImage
      ? `Product image: ${productImage}`
      : "",
    "",
    "Please let me know whether this product is available and how I can place the order.",
  ]
    .filter(Boolean)
    .join("\n");

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message
  )}`;

  window.open(
    whatsappUrl,
    "_blank",
    "noopener,noreferrer"
  );
};

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchTerm ||
    selectedCategory ||
    sortBy !== "newest";

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#05080B] text-white">
      {/* Background effects */}

      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-200px] top-[-100px] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />

        <div className="absolute bottom-[-200px] right-[-150px] h-[550px] w-[550px] rounded-full bg-blue-700/10 blur-[160px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
      </div>

      {/* Navigation */}

     

      {/* Hero */}

      <section className="mt-10 relative z-10 border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
              RaviX Collection
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Upgrade your mobile
              <span className="block bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                experience.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              Explore premium mobile accessories,
              wireless earbuds, chargers, cables, power
              banks and more from trusted brands.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <a
                href="#products"
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3.5 text-sm font-extrabold text-[#031015] transition hover:bg-cyan-300"
              >
                Browse products
                <ArrowIcon />
              </a>

              <p className="text-sm text-slate-500">
                <span className="font-bold text-white">
                  {products.length}
                </span>{" "}
                products available
              </p>
            </div>
          </div>

          <div className="relative hidden min-h-[320px] lg:block">
            <div className="absolute inset-0 rounded-[32px] border border-white/10 bg-gradient-to-br from-cyan-400/10 via-white/[0.03] to-blue-700/10 shadow-[0_30px_100px_rgba(0,190,255,0.1)]" />

            <div className="absolute inset-5 overflow-hidden rounded-[26px] border border-white/10 bg-[#080D12]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(0,190,255,0.22),transparent_55%)]" />

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <PackageIcon className="h-24 w-24 text-cyan-400" />

                <p className="mt-5 text-xl font-black">
                  Premium Mobile Accessories
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Quality products. Modern technology.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop content */}

      <section
        id="products"
        className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
      >
        {/* Search and sort */}

        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative min-w-0 flex-1">
              <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search products, brands or categories..."
                className="w-full rounded-xl border border-white/10 bg-black/30 py-3.5 pl-12 pr-11 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-400/10"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                setShowMobileFilters(
                  (currentValue) => !currentValue
                )
              }
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/30 px-5 py-3.5 text-sm font-bold text-slate-200 lg:hidden"
            >
              <FilterIcon />
              Filters
            </button>

            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value)
              }
              className="hidden min-w-[210px] rounded-xl border border-white/10 bg-[#0B1015] px-4 py-3.5 text-sm font-semibold text-slate-200 outline-none focus:border-cyan-400/50 lg:block"
            >
              <option value="newest">
                Newest first
              </option>

              <option value="price-low">
                Price: low to high
              </option>

              <option value="price-high">
                Price: high to low
              </option>

              <option value="rating">
                Highest rated
              </option>

              <option value="name">
                Product name
              </option>
            </select>
          </div>

          {/* Mobile controls */}

          {showMobileFilters && (
            <div className="mt-4 border-t border-white/10 pt-4 lg:hidden">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Sort products
              </label>

              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-[#0B1015] px-4 py-3.5 text-sm font-semibold text-slate-200 outline-none"
              >
                <option value="newest">
                  Newest first
                </option>

                <option value="price-low">
                  Price: low to high
                </option>

                <option value="price-high">
                  Price: high to low
                </option>

                <option value="rating">
                  Highest rated
                </option>

                <option value="name">
                  Product name
                </option>
              </select>
            </div>
          )}
        </div>

        {/* Dynamic categories */}

        <div className="mt-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-400">
                Categories
              </p>

              <h2 className="mt-1 text-2xl font-black">
                Find what you need
              </h2>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-bold text-slate-400 transition hover:text-cyan-400"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="mt-5 flex gap-3 overflow-x-auto pb-3">
            <button
              type="button"
              onClick={() =>
                setSelectedCategory("")
              }
              className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-bold transition ${
                !selectedCategory
                  ? "border-cyan-400 bg-cyan-400 text-[#031015]"
                  : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-cyan-400/40 hover:text-cyan-400"
              }`}
            >
              All products
              <span className="ml-2 opacity-70">
                {products.length}
              </span>
            </button>

            {categories.map((category) => (
              <button
                key={category._id}
                type="button"
                onClick={() =>
                  setSelectedCategory(category.name)
                }
                className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-bold transition ${
                  selectedCategory === category.name
                    ? "border-cyan-400 bg-cyan-400 text-[#031015]"
                    : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-cyan-400/40 hover:text-cyan-400"
                }`}
              >
                {category.name}

                <span className="ml-2 opacity-70">
                  {category.productCount ?? ""}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results title */}

        <div className="mt-9 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-black sm:text-3xl">
              {selectedCategory || "All Products"}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {filteredProducts.length} product
              {filteredProducts.length === 1
                ? ""
                : "s"}{" "}
              found
              {searchTerm
                ? ` for "${searchTerm}"`
                : ""}
            </p>
          </div>

          {selectedCategory && (
            <button
              type="button"
              onClick={() =>
                setSelectedCategory("")
              }
              className="self-start text-sm font-bold text-cyan-400 transition hover:text-cyan-300 sm:self-auto"
            >
              View all products
            </button>
          )}
        </div>

        {/* Product states */}

        {loading ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-cyan-400" />

            <p className="mt-5 text-sm font-semibold text-slate-500">
              Loading RaviX products...
            </p>
          </div>
        ) : errorMessage ? (
          <div className="mt-8 rounded-[24px] border border-red-400/20 bg-red-500/10 px-6 py-14 text-center">
            <p className="text-lg font-bold text-red-300">
              Unable to load the shop
            </p>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-400">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={fetchShopData}
              className="mt-6 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-extrabold text-[#031015] transition hover:bg-cyan-300"
            >
              Try again
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="mt-8 flex min-h-[360px] flex-col items-center justify-center rounded-[24px] border border-white/10 bg-white/[0.035] px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] text-slate-500">
              <PackageIcon />
            </div>

            <h3 className="mt-6 text-xl font-black">
              No products found
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              No products match your current search and
              category filters.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-bold text-cyan-400 transition hover:bg-cyan-400 hover:text-[#031015]"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
  key={product._id}
  product={product}
  onBuyNow={handleBuyNow}
/>
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
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_15px_45px_rgba(37,211,102,0.35)] transition hover:scale-105"
      >
        <WhatsAppIcon />
      </a>
    </main>
  );
}

export default Shop;