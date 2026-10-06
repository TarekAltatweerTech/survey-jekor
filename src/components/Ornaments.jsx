/** Small gold flourish under the step titles: a lozenge between two fading rules. */
export function Flourish() {
  return (
    <svg className="flourish" viewBox="0 0 120 14" aria-hidden="true">
      <defs>
        <linearGradient id="flourish-l" x1="0" x2="1">
          <stop offset="0" stopColor="#C9A14A" stopOpacity="0" />
          <stop offset="1" stopColor="#C9A14A" />
        </linearGradient>
        <linearGradient id="flourish-r" x1="1" x2="0">
          <stop offset="0" stopColor="#C9A14A" stopOpacity="0" />
          <stop offset="1" stopColor="#C9A14A" />
        </linearGradient>
      </defs>
      <rect x="0" y="6.5" width="48" height="1" fill="url(#flourish-l)" />
      <rect x="72" y="6.5" width="48" height="1" fill="url(#flourish-r)" />
      <path d="M60 1 66 7 60 13 54 7Z" fill="none" stroke="#C9A14A" strokeWidth="1.2" />
      <circle cx="60" cy="7" r="1.8" fill="#C9A14A" />
    </svg>
  );
}

// 24-point rosette: the edge of a wax seal.
const ROSETTE = (() => {
  const points = [];
  const spikes = 24;
  for (let i = 0; i < spikes * 2; i += 1) {
    const r = i % 2 === 0 ? 50 : 45;
    const a = (Math.PI * i) / spikes - Math.PI / 2;
    points.push(`${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`);
  }
  return points.join(' ');
})();

/** Gold seal with a check, stamped on the chosen product and on the thank-you screen. */
export function Seal({ className = '', draw = false }) {
  return (
    <svg className={`seal ${draw ? 'seal--draw' : ''} ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id="seal-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F1DB9E" />
          <stop offset=".45" stopColor="#C9A14A" />
          <stop offset="1" stopColor="#8E6A22" />
        </linearGradient>
      </defs>
      <polygon points={ROSETTE} fill="url(#seal-gold)" stroke="#8E6A22" strokeWidth="1" strokeLinejoin="round" />
      <circle cx="50" cy="50" r="36" fill="#0F3D24" />
      <circle cx="50" cy="50" r="31.5" fill="none" stroke="#E9CF8C" strokeWidth="1" strokeDasharray="2 3" />
      <path className="seal__check" d="M35 51 46 61 66 39" fill="none" stroke="#F6EBCB" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
