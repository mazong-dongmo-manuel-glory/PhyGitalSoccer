import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Crest from './Crest';
import { colorFor, formatDay, formatTime, matchState, stageLabel } from '../utils/format';

const STAT_ROWS = [
  ['possessionPercentage', 'Possession', '%'],
  ['totalShots', 'Tirs'],
  ['shotsOnTarget', 'Tirs cadrés'],
  ['corners', 'Corners'],
  ['fouls', 'Fautes'],
  ['offsides', 'Hors-jeu'],
  ['yellowCards', 'Cartons jaunes'],
  ['redCards', 'Cartons rouges']
];

function Duel({ label, a = 0, b = 0, suffix = '', colorA, colorB }) {
  const total = (Number(a) || 0) + (Number(b) || 0);
  const pa = total > 0 ? ((Number(a) || 0) / total) * 100 : 50;
  return (
    <div className="duel">
      <div className="duel__labels">
        <strong>{a}{suffix}</strong>
        <span>{label}</span>
        <strong>{b}{suffix}</strong>
      </div>
      <div className="duel__bar">
        <span style={{ width: `${pa}%`, background: colorA }} />
        <span style={{ width: `${100 - pa}%`, background: colorB }} />
      </div>
    </div>
  );
}

function Events({ match, type, colorA, colorB }) {
  const list = (match.playerStats || []).filter(ps => !type || ps.type === type);
  const events = list.flatMap(ps => {
    const out = [];
    const kind = ps.type === 'Physical' ? 'Terrain' : 'Console';
    if (ps.goals > 0) out.push({ ps, label: `${ps.goals > 1 ? `${ps.goals} buts` : 'But'} · ${kind}`, color: ps.type === 'Physical' ? 'var(--round-physical)' : 'var(--round-digital)' });
    if (ps.assists > 0) out.push({ ps, label: `${ps.assists > 1 ? `${ps.assists} passes D.` : 'Passe D.'} · ${kind}`, color: 'var(--text-secondary)' });
    if (ps.yellowCards > 0) out.push({ ps, label: `Carton jaune${ps.yellowCards > 1 ? ` ×${ps.yellowCards}` : ''}`, color: 'var(--card-yellow)' });
    if (ps.redCards > 0) out.push({ ps, label: 'Carton rouge', color: 'var(--card-red)' });
    return out;
  });

  if (events.length === 0) return <p className="muted" style={{ fontSize: 14 }}>Aucun événement individuel saisi pour ce match.</p>;

  return events.map((e, i) => (
    <div key={i} className="event">
      <span className="event__bar" style={{ background: e.ps.teamId === match.team1Id ? colorA : colorB }} />
      <div className="event__who">
        <strong>{e.ps.playerName}</strong>
        <span>{e.ps.teamName}</span>
      </div>
      <span className="event__kind" style={{ color: e.color }}>{e.label}</span>
    </div>
  ));
}

export default function MatchDetailModal({ match, onClose }) {
  const [tab, setTab] = useState('physical');

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!match) return null;

  const state = matchState(match);
  const played = state !== 'next';
  const colorA = colorFor(match.team1ColorHex, match.team1Name);
  const colorB = colorFor(match.team2ColorHex, match.team2Name);
  const hasPenalties = match.team1Penalties != null && match.team2Penalties != null;

  const tabs = [
    { id: 'physical', label: 'Manche terrain', dot: 'phys' },
    { id: 'digital', label: 'Manche console', dot: 'dig' },
    { id: 'events', label: 'Joueurs & événements' }
  ];

  const stats = tab === 'digital'
    ? [match.team1DigitalStat || {}, match.team2DigitalStat || {}]
    : [match.team1PhysicalStat || {}, match.team2PhysicalStat || {}];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="scoreboard">
          <div className="scoreboard__top">
            <span>
              {stageLabel(match.stage)} · {formatDay(match.scheduledDate)} {formatTime(match.scheduledDate)}
              {match.venue ? ` · ${match.venue}` : ''}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className={`status-badge ${state === 'live' ? 'is-live' : ''}`} style={{ color: '#fff' }}>
                {state === 'done' ? 'Terminé' : state === 'live' ? 'En direct' : 'À venir'}
              </span>
              <button type="button" className="icon-btn" onClick={onClose} aria-label="Fermer"><X size={18} /></button>
            </span>
          </div>

          <div className="scoreboard__main">
            <div className="scoreboard__team">
              <Crest name={match.team1Name} color={match.team1ColorHex} size={80} />
              {match.team1Name}
            </div>
            <div className="scoreboard__center">
              <div className="scoreboard__score">
                {played ? `${match.team1TotalGoals} – ${match.team2TotalGoals}` : 'VS'}
              </div>
              <div className="round-chips">
                <div className="round-chip">
                  <span><span className="dot dot--phys" />TERRAIN</span>
                  <strong>{played ? `${match.team1PhysicalGoals} – ${match.team2PhysicalGoals}` : '–'}</strong>
                </div>
                <div className="round-chip">
                  <span><span className="dot dot--dig" />CONSOLE</span>
                  <strong>{played ? `${match.team1DigitalGoals} – ${match.team2DigitalGoals}` : '–'}</strong>
                </div>
                {hasPenalties && (
                  <div className="round-chip">
                    <span><span className="dot dot--brand" />TAB</span>
                    <strong>{match.team1Penalties} – {match.team2Penalties}</strong>
                  </div>
                )}
              </div>
              {match.winnerName && <span style={{ fontSize: 13, color: 'var(--on-inverse-muted)' }}>Vainqueur : <strong style={{ color: '#fff' }}>{match.winnerName}</strong></span>}
            </div>
            <div className="scoreboard__team">
              <Crest name={match.team2Name} color={match.team2ColorHex} size={80} />
              {match.team2Name}
            </div>
          </div>
        </div>

        <div className="tabs">
          {tabs.map(t => (
            <button key={t.id} type="button" className={`tab ${tab === t.id ? 'is-active' : ''}`} onClick={() => setTab(t.id)}>
              {t.dot && <span className={`dot dot--${t.dot}`} />}
              {t.label}
            </button>
          ))}
        </div>

        <div className="modal__content">
          {tab === 'events' ? (
            <>
              <div>
                <h4 className="modal__heading"><span className="c-phys">●</span> Terrain</h4>
                <Events match={match} type="Physical" colorA={colorA} colorB={colorB} />
              </div>
              <div>
                <h4 className="modal__heading"><span className="c-dig">●</span> Console</h4>
                <Events match={match} type="Digital" colorA={colorA} colorB={colorB} />
              </div>
            </>
          ) : (
            <>
              <div>
                <h4 className="modal__heading">Statistiques</h4>
                {STAT_ROWS.map(([key, label, suffix]) => (
                  <Duel key={key} label={label} a={stats[0][key] ?? 0} b={stats[1][key] ?? 0} suffix={suffix} colorA={colorA} colorB={colorB} />
                ))}
              </div>
              <div>
                <h4 className="modal__heading">Événements</h4>
                <Events match={match} type={tab === 'digital' ? 'Digital' : 'Physical'} colorA={colorA} colorB={colorB} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
