import { useState } from 'react';
import { num, RATING_LABELS } from '../lib/format.js';

const STAR = 'M12 2.6l2.82 5.92 6.5.8-4.78 4.47 1.22 6.44L12 17.1l-5.76 3.13 1.22-6.44L2.68 9.32l6.5-.8z';

/**
 * 1-5 stars as a radio group: arrows move between stars, hover previews the
 * value. In RTL the first star sits on the right, so the bar fills right to left.
 */
export default function StarRating({ name, value, onChange, labelledBy }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  return (
    <div className="stars" role="radiogroup" aria-labelledby={labelledBy} onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <label key={n} className={`star ${n <= shown ? 'is-on' : ''}`} onMouseEnter={() => setHover(n)}>
          <input
            className="sr-only"
            type="radio"
            name={name}
            value={n}
            checked={value === n}
            onChange={() => onChange(n)}
          />
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={STAR} />
          </svg>
          <span className="sr-only">{`${num(n)} من ${num(5)} — ${RATING_LABELS[n]}`}</span>
        </label>
      ))}
      <span className={`stars__label ${shown ? 'is-set' : ''}`} aria-hidden="true">
        {shown ? RATING_LABELS[shown] : 'اختر تقييمك'}
      </span>
    </div>
  );
}
