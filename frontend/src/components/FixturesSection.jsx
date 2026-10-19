import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import MatchCard from './MatchCard';

const FILTERS = [
  { id: 'all', label: 'Tous', test: () => true },
  { id: 'A', label: 'Groupe A', test: m => m.stage === 'GroupA' },
  { id: 'B', label: 'Groupe B', test: m => m.stage === 'GroupB' },
  { id: 'ko', label: 'Phase finale', test: m => !['GroupA', 'GroupB'].includes(m.stage) }
];

const PREVIEW_COUNT = 6;

export default function FixturesSection({ matches, onSelectMatch }) {
  const [filter, setFilter] = useState('all');
  const [showAll, setShowAll] = useState(false);

  const active = FILTERS.find(f => f.id === filter);
  const list = [...matches]
    .filter(active.test)
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
  const visible = showAll ? list : list.slice(0, PREVIEW_COUNT);

  return (
    <section className="section section--tight-top" id="calendrier">
      <div className="container">
        <div className="section-head">
          <div className="section-head__titles">
            <span className="kicker">Calendrier officiel</span>
            <h2 className="section-title">Rencontres</h2>
          </div>
          <div className="pills">
            {FILTERS.map(f => (
              <button
                key={f.id}
                type="button"
                className={`pill ${filter === f.id ? 'is-active' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="card fixtures">
          {visible.length === 0 ? (
            <div className="empty">Aucune rencontre programmée pour cette phase.</div>
          ) : (
            visible.map(m => <MatchCard key={m.id} match={m} onSelect={onSelectMatch} />)
          )}
        </div>

        {list.length > PREVIEW_COUNT && (
          <div className="center-row">
            <button type="button" className="link-arrow" onClick={() => setShowAll(s => !s)}>
              {showAll ? 'Réduire la liste' : `Voir les ${list.length} rencontres`} <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
