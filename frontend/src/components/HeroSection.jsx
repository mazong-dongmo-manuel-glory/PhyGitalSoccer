import { ArrowRight } from 'lucide-react';
import Crest from './Crest';
import { formatDay, formatTime, matchState, stageLabel } from '../utils/format';

function FeaturedMatchCard({ match, onSelect }) {
  const state = matchState(match);
  const showScore = state !== 'next';

  return (
    <button type="button" className="feature-card" onClick={() => onSelect(match)}>
      <div className="feature-card__head">
        <span className="eyebrow">Match à la une · {stageLabel(match.stage)}</span>
        <span className={`status-badge ${state === 'live' ? 'is-live' : ''}`}>
          {state === 'done' ? 'Terminé' : state === 'live' ? 'En direct' : 'À venir'}
        </span>
      </div>

      <div className="scoreline">
        <div className="scoreline__team">
          <Crest name={match.team1Name} color={match.team1ColorHex} size={64} />
          {match.team1Name}
        </div>
        <div className="scoreline__agg">
          <div className="scoreline__value">
            {showScore ? `${match.team1TotalGoals} – ${match.team2TotalGoals}` : formatTime(match.scheduledDate)}
          </div>
          <div className="scoreline__caption">{showScore ? 'Score cumulé' : formatDay(match.scheduledDate)}</div>
        </div>
        <div className="scoreline__team">
          <Crest name={match.team2Name} color={match.team2ColorHex} size={64} />
          {match.team2Name}
        </div>
      </div>

      <div className="rounds">
        <div className="round-row">
          <span>{showScore ? match.team1PhysicalGoals : '–'}</span>
          <span className="round-row__label"><span className="dot dot--phys" />MANCHE TERRAIN</span>
          <span>{showScore ? match.team2PhysicalGoals : '–'}</span>
        </div>
        <div className="round-row">
          <span>{showScore ? match.team1DigitalGoals : '–'}</span>
          <span className="round-row__label"><span className="dot dot--dig" />MANCHE CONSOLE</span>
          <span>{showScore ? match.team2DigitalGoals : '–'}</span>
        </div>
      </div>

      <div className="feature-card__foot">
        <span>{[match.venue, `${formatDay(match.scheduledDate)}, ${formatTime(match.scheduledDate)}`].filter(Boolean).join(' · ')}</span>
        <strong>Feuille de match <ArrowRight size={16} /></strong>
      </div>
    </button>
  );
}

export default function HeroSection({ featuredMatch, teamsCount, matchesCount, onExploreSchedule, onExploreFormat, onSelectMatch }) {
  const stats = [
    [teamsCount, 'équipes'],
    [matchesCount, 'rencontres'],
    [2, 'manches par match'],
    [1, 'trophée']
  ];

  return (
    <section className="hero">
      <div className="container hero__grid">
        <div className="hero__copy">
          <span className="kicker kicker--line">Saison inaugurale · Trois-Rivières 2026</span>
          <h1 className="display hero__title">
            Deux terrains.
            <span>Un seul champion.</span>
          </h1>
          <p className="hero__lead">
            Huit équipes s’affrontent sur le gazon puis sur console. Les buts des deux manches s’additionnent ; en cas d’égalité, la séance de tirs au but tranche.
          </p>
          <div className="hero__actions">
            <button type="button" className="btn btn--primary" onClick={onExploreSchedule}>
              Voir le calendrier <ArrowRight size={18} />
            </button>
            <button type="button" className="btn btn--secondary" onClick={onExploreFormat}>
              Comprendre le format
            </button>
          </div>
          <div className="key-stats">
            {stats.map(([value, label], i) => (
              <div key={label} style={{ display: 'contents' }}>
                {i > 0 && <span className="key-stats__divider" />}
                <div>
                  <div className="key-stat__value">{value}</div>
                  <div className="key-stat__label">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {featuredMatch && <FeaturedMatchCard match={featuredMatch} onSelect={onSelectMatch} />}
      </div>
    </section>
  );
}
