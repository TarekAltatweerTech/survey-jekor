import ProductImage from './ProductImage.jsx';
import { Flourish, Seal } from './Ornaments.jsx';

const COPY = {
  done: {
    title: 'شكراً لك!',
    text: 'وصلنا صوتك وتقييمك. رأيك يساعدنا أن نصنع ما تحبّه في كل منتج من جيكور.',
  },
  already: {
    title: 'شاركت من قبل',
    text: 'سُجّلت مشاركتك من هذا الجهاز سابقاً — شكراً لك، فالمشاركة مرة واحدة لكل جهاز.',
  },
  closed: {
    title: 'الاستبيان مغلق',
    text: 'لا يستقبل الاستبيان مشاركات في الوقت الحالي. شكراً لاهتمامك، ونراك قريباً.',
  },
  error: {
    title: 'تعذّر فتح الاستبيان',
    text: 'حدث خطأ أثناء تحميل الصفحة.',
  },
};

export default function ResultScreen({ kind, product, message, onRetry }) {
  const copy = COPY[kind];
  const positive = kind === 'done' || kind === 'already';

  return (
    <div className="result">
      {positive ? <Seal className="result__seal" draw /> : <span className="result__mark" aria-hidden="true">!</span>}
      <h1 className="step__title">{copy.title}</h1>
      <Flourish />
      <p className="step__lead">{message || copy.text}</p>

      {positive && product ? (
        <div className="result__product reveal" style={{ '--i': 3 }}>
          <ProductImage src={product.image} size={64} />
          <div>
            <span className="recap__label">منتجك المفضل</span>
            <strong>{product.name}</strong>
          </div>
        </div>
      ) : null}

      {onRetry ? (
        <button type="button" className="btn btn--primary result__retry" onClick={onRetry}>
          إعادة المحاولة
        </button>
      ) : null}
    </div>
  );
}
