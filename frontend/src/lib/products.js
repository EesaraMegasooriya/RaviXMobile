export const availabilityLabels = { in_stock: 'In stock', out_of_stock: 'Out of stock', pre_order: 'Pre-order' };
export const availabilityOf = product => product.availability || 'in_stock';
export function pricing(product) {
  const original = Number(product.price || 0);
  const sale = product.salePrice == null || product.salePrice === '' ? null : Number(product.salePrice);
  const discounted = Number.isFinite(sale) && sale >= 0 && sale < original;
  const current = discounted ? sale : original;
  const saving = Math.round((original - current) * 100) / 100;
  return { original, current, saving, discounted, percent: original > 0 ? Math.round(saving / original * 100) : 0 };
}
export const formatPrice = value => `LKR ${Number(value || 0).toLocaleString('en-LK', { maximumFractionDigits: 2 })}`;
export function purchaseLabel(product) {
  return availabilityOf(product) === 'out_of_stock' ? 'Ask about availability' : availabilityOf(product) === 'pre_order' ? 'Pre-order on WhatsApp' : 'Buy Now';
}
export function whatsappProductUrl(product, { phone, quantity = 1, origin = 'https://ravixmobile.com' }) {
  const count = Math.max(1, Math.min(99, Math.trunc(Number(quantity)) || 1));
  const price = pricing(product);
  const availability = availabilityOf(product);
  const message = [
    'Hello RaviXMobile,',
    availability === 'out_of_stock' ? 'When will this product be available again?' : availability === 'pre_order' ? 'Can I pre-order this product?' : 'Can I buy this product now?',
    '',
    `Product: ${product.name}`,
    `Brand: ${product.brand || 'N/A'}`,
    `Category: ${product.category || 'N/A'}`,
    `Product ID: ${product._id}`,
    product.description ? `Details: ${product.description}` : '',
    `Availability: ${availabilityLabels[availability] || 'Please confirm'}`,
    price.discounted ? `Regular price: ${formatPrice(price.original)}` : '',
    `${price.discounted ? 'Discounted unit price' : 'Unit price'}: ${formatPrice(price.current)}`,
    price.discounted ? `You save per item: ${formatPrice(price.saving)} (${price.percent}%)` : '',
    `Quantity: ${count}`,
    `Product total: ${formatPrice(Math.round(price.current * count * 100) / 100)}`,
    product.img ? `Image: ${product.img}` : '',
    `Product link: ${origin.replace(/\/$/, '')}/products/${encodeURIComponent(product._id)}`,
    '',
    'Please confirm availability, the final price and delivery charges before placing my order.',
  ].filter(line => line !== '').join('\n');
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}
