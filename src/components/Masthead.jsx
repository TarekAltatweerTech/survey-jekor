import logo from '../assets/jekor-logo.png';

export default function Masthead({ eyebrow }) {
  return (
    <header className="masthead">
      <img className="masthead__logo" src={logo} alt="جيكور" width="380" height="169" />
      {eyebrow ? <p className="masthead__eyebrow">{eyebrow}</p> : null}
    </header>
  );
}
