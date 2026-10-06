import { useRef, useState } from 'react';
import ProductImage from './ProductImage.jsx';
import StarRating from './StarRating.jsx';
import { Flourish } from './Ornaments.jsx';
import { Arrow } from './VoteStep.jsx';
import { num } from '../lib/format.js';

const COMMENT_MAX = 1000;

/** Page 2 — a rating for every product, and an optional opinion on each. */
export default function RateStep({ products, vote, ratings, comments, onRate, onComment, onBack, onNext }) {
  const [showMissing, setShowMissing] = useState(false);
  const cardRefs = useRef({});

  const rated = products.filter((p) => ratings[p.id]).length;
  const complete = rated === products.length;

  function next() {
    if (complete) {
      onNext();
      return;
    }
    setShowMissing(true);
    const first = products.find((p) => !ratings[p.id]);
    cardRefs.current[first.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return (
    <>
      <div className="step__head">
        <h1 className="step__title">قيّم منتجاتنا</h1>
        <Flourish />
        <p className="step__lead">أعطِ كل منتج من نجمة إلى خمس نجوم، واكتب رأيك فيه إن أحببت.</p>
      </div>

      <p className={`rate-progress ${complete ? 'is-complete' : ''}`} aria-live="polite">
        <span className="rate-progress__bar" style={{ '--p': rated / products.length }} aria-hidden="true" />
        قيّمت {num(rated)} من {num(products.length)}
      </p>

      <div className="rate-list">
        {products.map((product, index) => {
          const missing = showMissing && !ratings[product.id];
          const comment = comments[product.id] || '';
          const titleId = `rate-title-${product.id}`;

          return (
            <section
              key={product.id}
              ref={(el) => (cardRefs.current[product.id] = el)}
              className={`rate-card reveal ${ratings[product.id] ? 'is-rated' : ''} ${missing ? 'is-missing' : ''}`}
              style={{ '--i': index }}
              aria-labelledby={titleId}
            >
              <ProductImage src={product.image} />
              <div className="rate-card__body">
                <h2 className="rate-card__name" id={titleId}>
                  {product.name}
                </h2>
                {product.id === vote ? <span className="tag">منتجك المفضل</span> : null}
                <StarRating
                  name={`rating-${product.id}`}
                  value={ratings[product.id] || 0}
                  onChange={(value) => onRate(product.id, value)}
                  labelledBy={titleId}
                />
                {missing ? <p className="rate-card__error">يرجى تقييم هذا المنتج</p> : null}
              </div>
              <label className="comment">
                <span className="sr-only">{`رأيك في ${product.name}`}</span>
                <textarea
                  rows={2}
                  maxLength={COMMENT_MAX}
                  value={comment}
                  placeholder={`ما رأيك في ${product.name}؟ (اختياري)`}
                  onChange={(e) => onComment(product.id, e.target.value)}
                />
                {comment.length > COMMENT_MAX - 150 ? (
                  <span className="comment__count">
                    {num(comment.length)} / {num(COMMENT_MAX)}
                  </span>
                ) : null}
              </label>
            </section>
          );
        })}
      </div>

      <div className="actions">
        <button type="button" className="btn btn--ghost" onClick={onBack}>
          رجوع
        </button>
        <button type="button" className="btn btn--primary" aria-disabled={!complete} onClick={next}>
          التالي: بياناتك
          <Arrow />
        </button>
      </div>
    </>
  );
}
