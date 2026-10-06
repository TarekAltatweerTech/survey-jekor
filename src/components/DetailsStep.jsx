import { useState } from 'react';
import ProductImage from './ProductImage.jsx';
import { Flourish } from './Ornaments.jsx';
import { isValidPhone, num, toLatinDigits } from '../lib/format.js';

/** Page 3 — optionally who is answering, then send everything. */
export default function DetailsStep({
  votedProduct,
  averageRating,
  ratedCount,
  name,
  phone,
  onName,
  onPhone,
  onBack,
  onSubmit,
  submitting,
  serverError,
  fieldErrors,
}) {
  const [touched, setTouched] = useState({ name: false, phone: false });
  const [tried, setTried] = useState(false);

  // Both fields are optional: only something typed is checked.
  const nameError = name.trim() && name.trim().length < 2 ? 'الاسم قصير جداً، أكمله أو اتركه فارغاً.' : null;
  const phoneError =
    phone.trim() && !isValidPhone(phone) ? 'رقم الهاتف غير صحيح، اكتبه بالشكل 07XXXXXXXXX أو اتركه فارغاً.' : null;

  const showName = (touched.name || tried) && nameError ? nameError : fieldErrors?.name?.[0];
  const showPhone = (touched.phone || tried) && phoneError ? phoneError : fieldErrors?.phone?.[0];

  function submit(e) {
    e.preventDefault();
    setTried(true);
    if (!nameError && !phoneError && !submitting) {
      onSubmit();
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="step__head">
        <h1 className="step__title">آخر خطوة</h1>
        <Flourish />
        <p className="step__lead">اسمك ورقم هاتفك اختياريان، يمكنك تركهما فارغين وإرسال مشاركتك مباشرة.</p>
      </div>

      <div className="recap reveal">
        <div className="recap__row">
          <ProductImage src={votedProduct?.image} size={52} />
          <div>
            <span className="recap__label">صوتك ذهب إلى</span>
            <strong>{votedProduct?.name}</strong>
          </div>
        </div>
        <div className="recap__row recap__row--stat">
          <span className="recap__big">{num(Number(averageRating.toFixed(1)))}</span>
          <div>
            <span className="recap__label">متوسط تقييمك</span>
            <strong>{`${num(ratedCount)} منتجات`}</strong>
          </div>
        </div>
      </div>

      <div className={`field reveal ${showName ? 'has-error' : ''}`} style={{ '--i': 1 }}>
        <label htmlFor="name">
          الاسم <span className="field__optional">اختياري</span>
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          maxLength={100}
          value={name}
          onChange={(e) => onName(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          aria-invalid={Boolean(showName)}
          aria-describedby={showName ? 'name-error' : undefined}
          placeholder="مثال: علي حسين"
        />
        {showName ? (
          <span className="field__error" id="name-error">
            {showName}
          </span>
        ) : null}
      </div>

      <div className={`field reveal ${showPhone ? 'has-error' : ''}`} style={{ '--i': 2 }}>
        <label htmlFor="phone">
          رقم الهاتف <span className="field__optional">اختياري</span>
        </label>
        <input
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          dir="ltr"
          maxLength={20}
          value={phone}
          onChange={(e) => onPhone(toLatinDigits(e.target.value))}
          onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
          aria-invalid={Boolean(showPhone)}
          aria-describedby={showPhone ? 'phone-error' : 'phone-hint'}
          placeholder="07XX XXX XXXX"
        />
        {showPhone ? (
          <span className="field__error" id="phone-error">
            {showPhone}
          </span>
        ) : (
          <span className="field__hint" id="phone-hint">
            رقم عراقي يبدأ بـ 07
          </span>
        )}
      </div>

      {serverError ? (
        <p className="alert" role="alert">
          {serverError}
        </p>
      ) : null}

      <div className="actions">
        <button type="button" className="btn btn--ghost" onClick={onBack} disabled={submitting}>
          رجوع
        </button>
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? (
            <>
              <span className="spinner" aria-hidden="true" />
              جارٍ الإرسال…
            </>
          ) : (
            'أرسل مشاركتي'
          )}
        </button>
      </div>
    </form>
  );
}
