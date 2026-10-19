export default function PageHeader({ kicker, title, subtitle, children }) {
  return (
    <header className="page-header">
      <div className="container page-header__inner">
        <div className="page-header__titles">
          <span className="kicker kicker--line">{kicker}</span>
          <h1 className="display page-header__title">{title}</h1>
          {subtitle && <p className="page-header__sub">{subtitle}</p>}
        </div>
        {children}
      </div>
    </header>
  );
}
