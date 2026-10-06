import { useState } from 'react';

/** The product photo on a cream "plate". Falls back to an empty plate when the image fails. */
export default function ProductImage({ src, size }) {
  const [failed, setFailed] = useState(false);

  return (
    <span className="plate" style={size ? { width: size } : undefined}>
      {src && !failed ? (
        <img src={src} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)} />
      ) : (
        <svg className="plate__empty" viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="15" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="24" cy="24" r="9" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2.5" />
        </svg>
      )}
    </span>
  );
}
