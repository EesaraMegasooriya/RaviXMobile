import ServiceError from "../components/ServiceError";
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL, WHATSAPP_NUMBER } from '../lib/api';
import { pricing, formatPrice, purchaseLabel, whatsappProductUrl } from '../lib/products';
import ProductImage from '../components/ProductImage';
import ProductPrice, { Availability } from '../components/ProductPrice';

function ProductContent({ id }) {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    axios.get(`${API_BASE_URL}/products/${encodeURIComponent(id)}`, { signal: controller.signal })
      .then(({ data }) => setProduct(data.product))
      .catch(error => { if (!axios.isCancel(error)) setError(error.response?.status === 404 ? 'This product is no longer available.' : 'Something went wrong. Please try again in a moment, or contact RaviX Mobile for help.'); });
    return () => controller.abort();
  }, [id]);
  async function copyLink() {
    try { await navigator.clipboard.writeText(window.location.href); setCopied('Product link copied.'); }
    catch { setCopied('Copy the page address from your browser to share this product.'); }
  }
  if (error) return <ServiceError message={error} onRetry={() => window.location.reload()} />;
  if (!product) return <p role="status">Loading product...</p>;
  const validQuantity = Number.isInteger(Number(quantity)) && Number(quantity) >= 1 && Number(quantity) <= 99;
  return <div className="grid gap-10 lg:grid-cols-2">
    <ProductImage src={product.img} alt={product.name} className="h-72 w-full sm:h-96 lg:h-[420px] rounded-3xl bg-white object-contain p-8" />
    <div className="min-w-0 space-y-5">
      <p className="text-sm font-bold uppercase tracking-wider text-cyan-400">{product.brand} · {product.category}</p>
      <h1 className="break-words text-3xl font-bold md:text-4xl">{product.name}</h1>
      <Availability product={product} />
      <ProductPrice product={product} />
      {product.description && <p className="whitespace-pre-wrap break-words leading-relaxed text-gray-300">{product.description}</p>}
      <label className="flex items-center gap-4">Quantity<input type="number" min="1" max="99" step="1" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-24 rounded-xl border border-white/20 bg-slate-900 p-3" /></label>
      {validQuantity ? <>
        <p className="font-bold">Product total: {formatPrice(Math.round(pricing(product).current * Number(quantity) * 100) / 100)}</p>
        <a href={whatsappProductUrl(product, { phone: WHATSAPP_NUMBER, quantity, origin: window.location.origin })} target="_blank" rel="noreferrer" className="inline-block rounded-xl bg-[#25D366] px-6 py-4 font-bold text-black">{purchaseLabel(product)}</a>
      </> : <p role="alert" className="text-red-300">Enter a whole quantity from 1 to 99.</p>}
      <p className="text-sm text-gray-400">WhatsApp opens with your product details. Send the message to confirm your order, availability, and delivery charges.</p>
      <button onClick={copyLink} className="block text-cyan-400 underline">Copy product link</button>
      {copied && <p role="status" className="text-sm text-gray-300">{copied}</p>}
    </div>
  </div>;
}
export default function ProductDetails() {
  const { id } = useParams();
  return <main className="min-h-screen bg-[#05080B] px-6 pb-20 pt-32 text-white"><div className="mx-auto max-w-6xl"><Link to="/shop" className="mb-8 inline-block text-cyan-400">← Back to shop</Link><ProductContent key={id} id={id} /></div></main>;
}
