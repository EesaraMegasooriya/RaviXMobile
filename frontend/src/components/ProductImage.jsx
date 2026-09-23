import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { getProductImageUrl } from '../lib/api';

export default function ProductImage({ src, alt, className }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const url = getProductImageUrl(src);
  if (!url || failedSrc === url) {
    return (
      <div
        role="img"
        aria-label={`${alt}: image unavailable`}
        className={`${className || ''} flex flex-col items-center justify-center gap-2 bg-[#0D1319] text-gray-500`}
      >
        <ImageOff size={22} className="text-gray-600" />
        <span className="text-xs">Image unavailable</span>
      </div>
    );
  }
  return <img src={url} alt={alt} className={className} loading="lazy" referrerPolicy="no-referrer" onError={() => setFailedSrc(url)} />;
}