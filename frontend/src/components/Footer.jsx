import { Brand } from './Navbar';

export default function Footer({ onNavigate, onOpenAdmin }) {
  const columns = [
    { title: 'TOURNOI', links: [['Calendrier', 'home'], ['Tableau final', 'bracket'], ['Classements', 'standings'], ['Statistiques', 'stats']] },
    { title: 'COMMUNAUTÉ', links: [['Équipes', 'teams'], ['Galerie', 'gallery'], ['Newsletter', 'home']] },
    { title: 'ORGANISATION', links: [['Espace organisateur', 'admin']] }
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div>
            <Brand onClick={() => onNavigate('home')} subtitle="Le tournoi hybride" />
            <p className="footer__about">Le tournoi hybride qui réunit le terrain et la console. Trois-Rivières, 2026.</p>
          </div>
          {columns.map(col => (
            <div key={col.title} className="footer__col">
              <h4>{col.title}</h4>
              {col.links.map(([label, id]) => (
                <button key={label} type="button" onClick={() => (id === 'admin' ? onOpenAdmin() : onNavigate(id))}>
                  {label}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="footer__bottom">
          <span>© 2026 PhyGital Soccer. Tous droits réservés.</span>
          <div className="footer__legal">
            <span>Confidentialité</span>
            <span>Conditions</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
