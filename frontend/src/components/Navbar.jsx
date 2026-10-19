import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { formatDay, formatTime, matchState, stageLabel } from '../utils/format';

const PUBLIC_PAGES = [
  { id: 'home', label: 'Accueil' },
  { id: 'bracket', label: 'Tableau final' },
  { id: 'standings', label: 'Classements' },
  { id: 'teams', label: 'Équipes' },
  { id: 'gallery', label: 'Galerie' },
  { id: 'stats', label: 'Statistiques' }
];

function tickerMatches(matches) {
  const live = matches.filter(m => m.status === 'InProgress');
  const done = matches
    .filter(m => m.status === 'Completed')
    .sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));
  const next = matches
    .filter(m => m.status === 'Scheduled')
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
  return [...live, ...done.slice(0, 2), ...next.slice(0, 2)].slice(0, 5);
}

function Ticker({ matches }) {
  const items = tickerMatches(matches);
  if (items.length === 0) return null;
  const hasLive = items.some(m => m.status === 'InProgress');

  return (
    <div className="ticker">
      <div className="container ticker__inner">
        <span className="ticker__label">{hasLive ? 'EN DIRECT' : 'RÉSULTATS'}</span>
        {items.map(m => {
          const state = matchState(m);
          return (
            <div key={m.id} className={`ticker__item ${state === 'live' ? 'is-live' : ''}`}>
              {state === 'live' && <span className="dot dot--brand" />}
              <span className="ticker__stage">{stageLabel(m.stage).replace('Groupe', 'GR.')}</span>
              <span>{m.team1Name}</span>
              <span className="ticker__score">{state === 'next' ? '–' : `${m.team1TotalGoals} – ${m.team2TotalGoals}`}</span>
              <span>{m.team2Name}</span>
              <small>
                {state === 'done' ? 'Terminé' : state === 'live' ? 'En cours' : `${formatDay(m.scheduledDate)} ${formatTime(m.scheduledDate)}`}
              </small>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Brand({ onClick, subtitle = 'Trois-Rivières · Édition 2026' }) {
  return (
    <button type="button" className="brand" onClick={onClick}>
      <img className="brand__mark" src="/logo-mark.png" alt="" />
      <span>
        <span className="brand__name" style={{ display: 'block' }}>PHYGITAL SOCCER</span>
        <span className="brand__sub">{subtitle}</span>
      </span>
    </button>
  );
}

export default function Navbar({ activeTab, onNavigate, onOpenAdmin, matches = [] }) {
  const [open, setOpen] = useState(false);

  const go = (id) => {
    setOpen(false);
    onNavigate(id);
  };

  return (
    <header className="site-header">
      <Ticker matches={matches} />
      <div className="container nav">
        <Brand onClick={() => go('home')} />
        <nav className={`nav__links ${open ? 'is-open' : ''}`}>
          {PUBLIC_PAGES.map(p => (
            <button
              key={p.id}
              type="button"
              className={`nav__link ${activeTab === p.id ? 'is-active' : ''}`}
              onClick={() => go(p.id)}
            >
              {p.label}
            </button>
          ))}
        </nav>
        <button type="button" className="btn btn--secondary btn--sm nav__cta" onClick={onOpenAdmin}>
          Espace organisateur
        </button>
        <button type="button" className="nav__toggle" onClick={() => setOpen(o => !o)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
