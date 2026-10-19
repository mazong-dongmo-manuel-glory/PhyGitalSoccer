import { useMemo, useState } from 'react';
import PageHeader from './PageHeader';
import { GroupTable, ScorersCard, SimpleBoard } from './Leaderboards';
import { aggregatePlayerStats, isGroupStage } from '../utils/format';

const MODES = [
  { id: 'total', label: 'Cumulé' },
  { id: 'physical', label: 'Terrain' },
  { id: 'digital', label: 'Console' }
];

function roundStandings(group, baseRows, matches, mode) {
  const key = mode === 'physical' ? 'PhysicalGoals' : 'DigitalGoals';
  const rows = new Map(
    baseRows.map(r => [r.teamId, { ...r, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 }])
  );

  for (const m of matches) {
    if (m.status !== 'Completed' || m.stage !== `Group${group}`) continue;
    const a = rows.get(m.team1Id);
    const b = rows.get(m.team2Id);
    if (!a || !b) continue;
    const ga = m[`team1${key}`] || 0;
    const gb = m[`team2${key}`] || 0;
    a.played++; b.played++;
    a.goalsFor += ga; a.goalsAgainst += gb;
    b.goalsFor += gb; b.goalsAgainst += ga;
    if (ga > gb) { a.won++; b.lost++; a.points += 3; }
    else if (ga < gb) { b.won++; a.lost++; b.points += 3; }
    else { a.drawn++; b.drawn++; a.points++; b.points++; }
  }

  return [...rows.values()].sort(
    (x, y) => y.points - x.points || (y.goalsFor - y.goalsAgainst) - (x.goalsFor - x.goalsAgainst) || y.goalsFor - x.goalsFor
  );
}

export default function StandingsTable({ standings, topScorers = [], matches = [] }) {
  const [mode, setMode] = useState('total');

  const tables = useMemo(() => {
    const base = { A: standings?.A || [], B: standings?.B || [] };
    if (mode === 'total') return base;
    const groupMatches = matches.filter(m => isGroupStage(m.stage));
    return {
      A: roundStandings('A', base.A, groupMatches, mode),
      B: roundStandings('B', base.B, groupMatches, mode)
    };
  }, [standings, matches, mode]);

  const players = useMemo(() => [...aggregatePlayerStats(matches).values()], [matches]);
  const assists = players.filter(p => p.assists > 0).sort((a, b) => b.assists - a.assists).slice(0, 5);
  const discipline = players
    .filter(p => p.yellowCards + p.redCards > 0)
    .sort((a, b) => b.redCards * 3 + b.yellowCards - (a.redCards * 3 + a.yellowCards))
    .slice(0, 5);

  return (
    <>
      <PageHeader
        kicker="Phase de groupes"
        title="Classements"
        subtitle="Les deux premiers de chaque groupe se qualifient pour les demi-finales."
      >
        <div className="seg seg--dark">
          {MODES.map(m => (
            <button key={m.id} type="button" className={mode === m.id ? 'is-active' : ''} onClick={() => setMode(m.id)}>
              {m.label}
            </button>
          ))}
        </div>
      </PageHeader>

      <section className="section">
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {!standings ? (
            <div className="card empty">Classements indisponibles pour le moment.</div>
          ) : (
            <>
              <GroupTable group="A" rows={tables.A} matches={matches} />
              <GroupTable group="B" rows={tables.B} matches={matches} />
            </>
          )}
        </div>
      </section>

      <section className="section section--surface">
        <div className="container">
          <div className="section-head">
            <div className="section-head__titles">
              <span className="kicker">Individuels</span>
              <h2 className="section-title">Leaders du tournoi</h2>
            </div>
          </div>
          <div className="boards">
            <ScorersCard scorers={topScorers} />
            <SimpleBoard
              title="Passeurs"
              meta="Passes décisives"
              rows={assists}
              empty="Aucune passe décisive enregistrée."
              render={r => <span className="leader__value">{r.assists}</span>}
            />
            <SimpleBoard
              title="Discipline"
              meta="Cartons reçus"
              rows={discipline}
              empty="Aucun carton distribué."
              render={r => (
                <span className="cards-count">
                  {r.yellowCards > 0 && <span><span className="card-chip" />{r.yellowCards}</span>}
                  {r.redCards > 0 && <span><span className="card-chip card-chip--red" />{r.redCards}</span>}
                </span>
              )}
            />
          </div>
        </div>
      </section>
    </>
  );
}
