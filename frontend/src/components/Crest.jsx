import { colorFor, initials } from '../utils/format';

export default function Crest({ name, color, size = 36 }) {
  return (
    <span
      className="crest"
      style={{ width: size, height: size, background: colorFor(color, name), fontSize: Math.round(size * 0.4) }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}
