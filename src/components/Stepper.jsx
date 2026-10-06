import { num } from '../lib/format.js';

const STEPS = ['صوّت', 'قيّم', 'بياناتك'];

/** ١ ─ ٢ ─ ٣ progress. A finished step can be clicked to go back to it. */
export default function Stepper({ step, onGo }) {
  const progress = (step - 1) / (STEPS.length - 1);

  return (
    <ol className="stepper" style={{ '--progress': progress }} aria-label="مراحل الاستبيان">
      <span className="stepper__track" aria-hidden="true" />
      <span className="stepper__fill" aria-hidden="true" />
      {STEPS.map((label, index) => {
        const n = index + 1;
        const state = n < step ? 'is-done' : n === step ? 'is-active' : '';
        const content = (
          <>
            <span className="stepper__dot">
              {n < step ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12.5 10 17 19 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                num(n)
              )}
            </span>
            <span className="stepper__label">{label}</span>
          </>
        );

        return (
          <li key={label} className={`stepper__item ${state}`} aria-current={n === step ? 'step' : undefined}>
            {n < step ? (
              <button type="button" className="stepper__btn" onClick={() => onGo(n)} aria-label={`العودة إلى: ${label}`}>
                {content}
              </button>
            ) : (
              content
            )}
          </li>
        );
      })}
    </ol>
  );
}
