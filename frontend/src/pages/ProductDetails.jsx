import ServiceError from "../components/ServiceError";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Minus, Plus, Link2, MessageCircle } from "lucide-react";
import { API_BASE_URL, WHATSAPP_NUMBER } from "../lib/api";
import { pricing, formatPrice, purchaseLabel, whatsappProductUrl } from "../lib/products";
import ProductImage from "../components/ProductImage";
import ProductPrice, { Availability } from "../components/ProductPrice";

const RADIUS = "rounded-2xl";

function ProductContent({ id }) {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(`${API_BASE_URL}/products/${encodeURIComponent(id)}`, { signal: controller.signal })
      .then(({ data }) => setProduct(data.product))
      .catch((error) => {
        if (!axios.isCancel(error))
          setError(
            error.response?.status === 404
              ? "This product is no longer available."
              : "Something went wrong. Please try again in a moment, or contact RaviX Mobile for help."
          );
      });
    return () => controller.abort();
  }, [id]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied("Product link copied.");
    } catch {
      setCopied("Copy the page address from your browser to share this product.");
    }
  }

  function adjustQuantity(delta) {
    setQuantity((q) => {
      const next = Number(q) + delta;
      return Math.min(99, Math.max(1, Number.isFinite(next) ? next : 1));
    });
  }

  if (error) return <ServiceError message={error} onRetry={() => window.location.reload()} />;
  if (!product) return <p role="status" className="text-gray-400">Loading product…</p>;

  const validQuantity = Number.isInteger(Number(quantity)) && Number(quantity) >= 1 && Number(quantity) <= 99;

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div className={`${RADIUS} border border-white/[0.06] bg-white p-8`}>
        <ProductImage
          src={product.img}
          alt={product.name}
          className="h-72 w-full object-contain sm:h-96 lg:h-[420px]"
        />
      </div>

      <div className="min-w-0 space-y-6">
        <div>
          <p className="text-sm font-medium text-cyan-300">
            {product.brand} · {product.category}
          </p>
          <h1 className="mt-2 break-words text-3xl font-bold leading-tight md:text-4xl">
            {product.name}
          </h1>
        </div>

        <div className="space-y-3">
          <Availability product={product} />
          <ProductPrice product={product} />
        </div>

        {product.description && (
          <p className="whitespace-pre-wrap break-words leading-relaxed text-gray-400">
            {product.description}
          </p>
        )}

        <div className={`${RADIUS} border border-white/[0.06] bg-[#0B0F16] p-6`}>
          <div className="flex items-center justify-between gap-6">
            <span className="font-medium text-gray-300">Quantity</span>
            <div className="flex items-center rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => adjustQuantity(-1)}
                disabled={Number(quantity) <= 1}
                aria-label="Decrease quantity"
                className="flex h-11 w-11 items-center justify-center text-gray-300 transition hover:text-cyan-300 disabled:opacity-30 disabled:hover:text-gray-300"
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                min="1"
                max="99"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                aria-label="Quantity"
                className="h-11 w-14 border-x border-white/10 bg-transparent text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button
                type="button"
                onClick={() => adjustQuantity(1)}
                disabled={Number(quantity) >= 99}
                aria-label="Increase quantity"
                className="flex h-11 w-11 items-center justify-center text-gray-300 transition hover:text-cyan-300 disabled:opacity-30 disabled:hover:text-gray-300"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {validQuantity ? (
            <>
              <p className="mt-5 flex items-baseline justify-between border-t border-white/[0.06] pt-5">
                <span className="text-gray-400">Product total</span>
                <span className="text-xl font-bold">
                  {formatPrice(Math.round(pricing(product).current * Number(quantity) * 100) / 100)}
                </span>
              </p>

              <a
                href={whatsappProductUrl(product, { phone: WHATSAPP_NUMBER, quantity, origin: window.location.origin })}
                target="_blank"
                rel="noreferrer"
                className="mt-5 flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 font-semibold text-black transition hover:brightness-105"
              >
                <MessageCircle size={18} />
                {purchaseLabel(product)}
              </a>
            </>
          ) : (
            <p role="alert" className="mt-5 border-t border-white/[0.06] pt-5 text-sm text-red-300">
              Enter a whole quantity from 1 to 99.
            </p>
          )}
        </div>

        <p className="text-sm text-gray-500">
          WhatsApp opens with your product details. Send the message to confirm your order, availability, and delivery charges.
        </p>

        <button
          onClick={copyLink}
          className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300 hover:text-cyan-200"
        >
          <Link2 size={15} />
          Copy product link
        </button>
        {copied && <p role="status" className="text-sm text-gray-500">{copied}</p>}
      </div>
    </div>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  return (
    <main className="min-h-screen bg-[#05080B] px-6 pb-24 pt-32 text-white">
      <div className="mx-auto max-w-6xl">
        <Link to="/shop" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-cyan-300">
          ← Back to shop
        </Link>
        <ProductContent key={id} id={id} />
      </div>
    </main>
  );
}