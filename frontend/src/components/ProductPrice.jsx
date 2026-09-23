import { pricing, formatPrice, availabilityLabels, availabilityOf } from '../lib/products';
export function Availability({ product }) {
  const status = availabilityOf(product);
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${status === 'out_of_stock' ? 'bg-red-100 text-red-800' : status === 'pre_order' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>{availabilityLabels[status]}</span>;
}
export default function ProductPrice({ product }) {
  const price = pricing(product);
  return <div className="space-y-1">
    {price.discounted && <p className="text-sm opacity-60"><span className="sr-only">Original price: </span><del>{formatPrice(price.original)}</del></p>}
    <p className="text-xl font-extrabold"><span className="sr-only">{price.discounted ? 'Sale price: ' : 'Price: '}</span>{formatPrice(price.current)}</p>
    {price.discounted && <p className="text-sm font-semibold text-emerald-600">Save {formatPrice(price.saving)} ({price.percent}%)</p>}
  </div>;
}
