import { useState } from 'react';
import { getProductImageUrl } from '../lib/api';

export default function ProductImage({ src, alt, className }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const url = getProductImageUrl(src);
  if (!url || failedSrc === url) {
    return <div role="img" aria-label={`${alt}: image unavailable`} className={`${className || ''} flex items-center justify-center bg-slate-100 text-sm text-slate-500`}>Image unavailable</div>;
  }
  return <img src={url} alt={alt} className={className} loading="lazy" referrerPolicy="no-referrer" onError={() => setFailedSrc(url)} />;
}
