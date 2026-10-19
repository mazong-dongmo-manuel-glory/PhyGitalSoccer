import { ArrowRight } from 'lucide-react';
import Crest from './Crest';
import { formatDay, formatShortDate, formatTime, matchState, stageLabel } from '../utils/format';

export function ScoreBox({ match, compact = false }) {
  const state = matchState(match);
  const cls = state === 'done' ? 'is-done' : state === 'live' ? 'is-live' : '';

  if (compact) {
    return (
      <div className={`score-box ${cls}`}>
        <strong>{state === 'next' ? formatTime(match.scheduledDate) : `${match.team1TotalGoals} – ${match.team2TotalGoals}`}</strong>
      </div>
    );
  }

  let sub;
  if (state === 'done') sub = `Terrain ${match.team1PhysicalGoals}–${match.team2PhysicalGoals} · Console ${match.team1DigitalGoals}–${match.team2DigitalGoals}`;
  else if (state === 'live') sub = 'En direct';
  else sub = `Coup d’envoi ${formatTime(match.scheduledDate)}`;

  return (
    <div className={`score-box ${cls}`}>
      <strong>{state === 'next' ? 'VS' : `${match.team1TotalGoals} – ${match.team2TotalGoals}`}</strong>
      <small>{sub}</small>
    </div>
  );
}

export default function MatchCard({ match, onSelect }) {
  const state = matchState(match);

  return (
    <button type="button" className="fixture" onClick={() => onSelect(match)}>
      <div className="fixture__date">
        <div className="fixture__when">
          <span className="fixture__time">{formatTime(match.scheduledDate)}</span>
          <span className="fixture__day">{formatDay(match.scheduledDate)}</span>
        </div>
        <span className="tag">{stageLabel(match.stage)}</span>
      </div>
      <div className="fixture__team fixture__team--home">
        <span>{match.team1Name}</span>
        <Crest name={match.team1Name} color={match.team1ColorHex} />
      </div>
      <ScoreBox match={match} />
      <div className="fixture__team">
        <Crest name={match.team2Name} color={match.team2ColorHex} />
        <span>{match.team2Name}</span>
      </div>
      <span className="fixture__venue">{match.venue || '—'}</span>
      <span className={`fixture__action ${state === 'live' ? 'is-live' : ''}`}>
        {state === 'done' ? 'Résumé' : state === 'live' ? 'En direct' : 'Détails'} <ArrowRight size={16} />
      </span>
    </button>
  );
}

export function MiniFixture({ match, onSelect }) {
  return (
    <button type="button" className="mini-fixture" onClick={() => onSelect(match)}>
      <span className="mini-fixture__date">{formatShortDate(match.scheduledDate)}</span>
      <span className="fixture__team fixture__team--home" style={{ fontSize: 13 }}>
        <span>{match.team1Name}</span>
        <Crest name={match.team1Name} color={match.team1ColorHex} size={24} />
      </span>
      <ScoreBox match={match} compact />
      <span className="fixture__team" style={{ fontSize: 13 }}>
        <Crest name={match.team2Name} color={match.team2ColorHex} size={24} />
        <span>{match.team2Name}</span>
      </span>
    </button>
  );
}
