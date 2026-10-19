export default function AdminTopbar({ crumb, title, hint, hintTone, children }) {
  return (
    <header className="topbar">
      <div>
        <div className="topbar__crumb">Espace organisateur / {crumb}</div>
        <h1 className="topbar__title">{title}</h1>
      </div>
      <div className="topbar__actions">
        {hint && <span className={`topbar__hint ${hintTone ? `is-${hintTone}` : ''}`}>{hint}</span>}
        {children}
      </div>
    </header>
  );
}
