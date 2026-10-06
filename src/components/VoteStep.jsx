import ProductImage from './ProductImage.jsx';
import { Flourish, Seal } from './Ornaments.jsx';
import { num } from '../lib/format.js';

/** Page 1 — one vote among the products. Native radios: one choice only, keyboard included. */
export default function VoteStep({ products, vote, onVote, onNext }) {
  const chosen = products.find((p) => p.id === vote);

  return (
    <>
      <div className="step__head">
        <h1 className="step__title">صوّت لمنتجك المفضل</h1>
        <Flourish />
        <p className="step__lead">اختر منتجاً واحداً فقط من بين {num(products.length)} منتجات: المنتج الذي لا تستغني عنه.</p>
      </div>

      <fieldset className={`vote-grid ${vote ? 'has-choice' : ''}`}>
        <legend className="sr-only">المنتجات</legend>
        {products.map((product, index) => {
          const selected = product.id === vote;
          return (
            <label
              key={product.id}
              className={`vote-card reveal ${selected ? 'is-selected' : ''}`}
              style={{ '--i': index }}
            >
              <input
                className="sr-only"
                type="radio"
                name="vote"
                value={product.id}
                checked={selected}
                onChange={() => onVote(product.id)}
              />
              {selected ? <Seal className="vote-card__seal" /> : null}
              <ProductImage src={product.image} />
              <span className="vote-card__name">{product.name}</span>
            </label>
          );
        })}
      </fieldset>

      <p className="vote-choice" aria-live="polite">
        {chosen ? (
          <>
            اخترت <strong>{chosen.name}</strong>
          </>
        ) : (
          'اضغط على صورة المنتج لاختياره'
        )}
      </p>

      <div className="actions">
        <button type="button" className="btn btn--primary" disabled={!vote} onClick={onNext}>
          التالي: قيّم المنتجات
          <Arrow />
        </button>
      </div>
    </>
  );
}

export function Arrow() {
  return (
    <svg className="btn__arrow" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 12H5m6-6-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
