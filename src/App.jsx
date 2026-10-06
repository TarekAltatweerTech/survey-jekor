import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Masthead from './components/Masthead.jsx';
import Stepper from './components/Stepper.jsx';
import VoteStep from './components/VoteStep.jsx';
import RateStep from './components/RateStep.jsx';
import DetailsStep from './components/DetailsStep.jsx';
import ResultScreen from './components/ResultScreen.jsx';
import { fetchSurvey, submitResponse } from './lib/api.js';
import { deviceId, load, remove, save } from './lib/storage.js';
import { normalizePhone } from './lib/format.js';

const EMPTY_DRAFT = { step: 1, vote: null, ratings: {}, comments: {}, name: '', phone: '' };

/**
 * A draft is only reused when it was made for the same products: if an admin
 * changed the selection meanwhile, the visitor starts over.
 */
function restoreDraft(survey) {
  const draft = load(`draft:${survey.id}`);
  const ids = survey.products.map((p) => p.id);

  if (!draft || draft.products?.join(',') !== ids.join(',')) {
    return EMPTY_DRAFT;
  }

  const restored = { ...EMPTY_DRAFT, ...draft };

  // Never land on a step whose earlier answers are missing.
  if (!ids.includes(restored.vote)) {
    return { ...restored, vote: null, step: 1 };
  }
  if (restored.step === 3 && ids.some((id) => !restored.ratings[id])) {
    return { ...restored, step: 2 };
  }

  return restored;
}

export default function App() {
  const [phase, setPhase] = useState('loading'); // loading | error | closed | form | done | already
  const [survey, setSurvey] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [doneProductId, setDoneProductId] = useState(null);

  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [direction, setDirection] = useState('forward');
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [fieldErrors, setFieldErrors] = useState(null);

  const sheetRef = useRef(null);

  const loadSurvey = useCallback(async () => {
    setPhase('loading');
    try {
      const data = await fetchSurvey();
      setSurvey(data);

      const finished = load(`done:${data.id}`);
      if (finished) {
        setDoneProductId(finished.productId);
        setPhase('already');
      } else if (!data.is_open) {
        setPhase('closed');
      } else {
        setDraft(restoreDraft(data));
        setPhase('form');
      }
    } catch (error) {
      setLoadError(error.message);
      setPhase('error');
    }
  }, []);

  useEffect(() => {
    loadSurvey();
  }, [loadSurvey]);

  // Keep the answers while the visitor fills the form: a reload or a lost tab resumes here.
  useEffect(() => {
    if (phase === 'form' && survey) {
      save(`draft:${survey.id}`, { ...draft, products: survey.products.map((p) => p.id) });
    }
  }, [draft, phase, survey]);

  const products = useMemo(() => survey?.products ?? [], [survey]);
  const update = (patch) => setDraft((d) => ({ ...d, ...patch }));

  function goTo(step) {
    setDirection(step > draft.step ? 'forward' : 'back');
    update({ step });
    setServerError('');
    sheetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function submit() {
    setSubmitting(true);
    setServerError('');
    setFieldErrors(null);

    try {
      await submitResponse({
        device_id: deviceId(),
        // Optional: left empty, they are sent as null (shown as "مشارك #…" in the admin).
        name: draft.name.trim() || null,
        phone: draft.phone.trim() ? normalizePhone(draft.phone) : null,
        voted_product_id: draft.vote,
        ratings: products.map((p) => ({
          product_id: p.id,
          rating: draft.ratings[p.id],
          comment: draft.comments[p.id]?.trim() || null,
        })),
      });
      finish('done');
    } catch (error) {
      if (error.reason === 'already_answered') {
        finish('already');
      } else if (error.reason === 'closed') {
        setPhase('closed');
      } else {
        setServerError(error.message);
        setFieldErrors(error.errors);
      }
    } finally {
      setSubmitting(false);
    }
  }

  function finish(kind) {
    save(`done:${survey.id}`, { productId: draft.vote, at: Date.now() });
    remove(`draft:${survey.id}`);
    setDoneProductId(draft.vote);
    setPhase(kind);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const votedProduct = products.find((p) => p.id === draft.vote);
  const ratingValues = products.map((p) => draft.ratings[p.id]).filter(Boolean);
  const averageRating = ratingValues.length ? ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length : 0;

  return (
    <div className="page">
      <Masthead eyebrow={survey?.title} />

      <main className="sheet" ref={sheetRef}>
        {phase === 'loading' ? <Skeleton /> : null}

        {phase === 'error' ? <ResultScreen kind="error" message={loadError} onRetry={loadSurvey} /> : null}
        {phase === 'closed' ? <ResultScreen kind="closed" /> : null}
        {phase === 'done' || phase === 'already' ? (
          <ResultScreen kind={phase} product={products.find((p) => p.id === doneProductId)} />
        ) : null}

        {phase === 'form' ? (
          <>
            <Stepper step={draft.step} onGo={goTo} />
            <div key={draft.step} className={`step step--${direction}`}>
              {draft.step === 1 ? (
                <VoteStep products={products} vote={draft.vote} onVote={(vote) => update({ vote })} onNext={() => goTo(2)} />
              ) : null}

              {draft.step === 2 ? (
                <RateStep
                  products={products}
                  vote={draft.vote}
                  ratings={draft.ratings}
                  comments={draft.comments}
                  onRate={(id, value) => setDraft((d) => ({ ...d, ratings: { ...d.ratings, [id]: value } }))}
                  onComment={(id, value) => setDraft((d) => ({ ...d, comments: { ...d.comments, [id]: value } }))}
                  onBack={() => goTo(1)}
                  onNext={() => goTo(3)}
                />
              ) : null}

              {draft.step === 3 ? (
                <DetailsStep
                  votedProduct={votedProduct}
                  averageRating={averageRating}
                  ratedCount={ratingValues.length}
                  name={draft.name}
                  phone={draft.phone}
                  onName={(name) => update({ name })}
                  onPhone={(phone) => update({ phone })}
                  onBack={() => goTo(2)}
                  onSubmit={submit}
                  submitting={submitting}
                  serverError={serverError}
                  fieldErrors={fieldErrors}
                />
              ) : null}
            </div>
          </>
        ) : null}

        <footer className="sheet__foot">
          <span>© Fusteka Group</span>
        </footer>
      </main>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="skeleton" aria-busy="true" aria-label="جارٍ التحميل">
      <span className="skeleton__line skeleton__line--title" />
      <span className="skeleton__line" />
      <div className="vote-grid">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="vote-card skeleton__card" />
        ))}
      </div>
    </div>
  );
}
