import { useMemo, useState } from 'react';
import { Search, User } from 'lucide-react';
import PageHeader from './PageHeader';
import Crest from './Crest';
import { aggregatePlayerStats, colorFor, positionKey, positionLabel } from '../utils/format';

const POSITION_ORDER = { Goalkeeper: 0, Defender: 1, Midfielder: 2, Forward: 3 };

function PlayerCard({ player, color, stats }) {
  const s = stats || { physicalGoals: 0, digitalGoals: 0, assists: 0, yellowCards: 0, redCards: 0 };
  return (
    <article className="card">
      <div className="player-card__photo" style={{ background: `linear-gradient(160deg, ${color}, #0b1b2b)` }}>
        {player.photoUrl ? (
          <img src={player.photoUrl} alt={player.name} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        ) : (
          <User size={120} strokeWidth={1} style={{ position: 'absolute', right: 8, bottom: -8, opacity: 0.35 }} />
        )}
        <span className="player-card__number">{player.jerseyNumber}</span>
      </div>
      <div className="player-card__info">
        <div>
          <div className="player-card__name">{player.name}</div>
          <div className="player-card__role">{positionLabel(player.position)}</div>
        </div>
        <div className="player-card__stats">
          <div className="mini-stat"><strong className="c-phys">{s.physicalGoals}</strong><span>Buts terrain</span></div>
          <div className="mini-stat"><strong className="c-dig">{s.digitalGoals}</strong><span>Buts console</span></div>
          <div className="mini-stat"><strong>{s.assists}</strong><span>Passes D.</span></div>
          <div className="mini-stat">
            <strong className="cards-count" style={{ fontSize: 16 }}>
              <span><span className="card-chip" />{s.yellowCards}</span>
              {s.redCards > 0 && <span><span className="card-chip card-chip--red" />{s.redCards}</span>}
            </strong>
            <span>Cartons</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function TeamsRoster({ teams, standings, matches = [] }) {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const standingByTeam = useMemo(() => {
    const map = new Map();
    for (const g of ['A', 'B']) (standings?.[g] || []).forEach((r, i) => map.set(r.teamId, { ...r, rank: i + 1 }));
    return map;
  }, [standings]);

  const playerStats = useMemo(() => aggregatePlayerStats(matches), [matches]);

  const q = query.trim().toLowerCase();
  const filtered = teams.filter(t =>
    !q || t.name.toLowerCase().includes(q) || (t.players || []).some(p => p.name.toLowerCase().includes(q))
  );

  const selected =
    teams.find(t => t.id === selectedId) ||
    filtered.find(t => (t.players || []).length > 0) ||
    filtered[0] ||
    teams[0];
  const selectedStanding = selected ? standingByTeam.get(selected.id) : null;
  const roster = [...(selected?.players || [])].sort(
    (a, b) => (POSITION_ORDER[positionKey(a.position)] ?? 9) - (POSITION_ORDER[positionKey(b.position)] ?? 9) || a.jerseyNumber - b.jerseyNumber
  );

  const teamGoals = roster.reduce((sum, p) => {
    const s = playerStats.get(p.id);
    return sum + (s ? s.physicalGoals + s.digitalGoals : 0);
  }, 0);

  return (
    <>
      <PageHeader
        kicker={`${teams.length} équipes · 2 groupes`}
        title="Équipes & joueurs"
        subtitle="Des athlètes hybrides, aussi à l’aise sur la pelouse que manette en main."
      >
        <label className="search">
          <Search size={18} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher une équipe ou un joueur" />
        </label>
      </PageHeader>

      <section className="section">
        <div className="container">
          {filtered.length === 0 && <div className="card empty">Aucun résultat pour « {query} ».</div>}
          {['A', 'B'].map(group => {
            const list = filtered.filter(t => t.group === group);
            if (list.length === 0) return null;
            return (
              <div key={group}>
                <h3 className="group-label kicker">Groupe {group}</h3>
                <div className="team-grid">
                  {list.map(t => {
                    const st = standingByTeam.get(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        className={`card team-tile ${selected?.id === t.id ? 'is-selected' : ''}`}
                        style={{ '--team': colorFor(t.colorHex, t.name) }}
                        onClick={() => setSelectedId(t.id)}
                      >
                        <Crest name={t.name} color={t.colorHex} size={44} />
                        <div style={{ minWidth: 0 }}>
                          <div className="team-tile__name">{t.name}</div>
                          <div className="team-tile__meta">{(t.players || []).length} joueurs</div>
                        </div>
                        {st && <span className="team-tile__pts">{st.points} pts</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {selected && (
        <section className="section section--surface">
          <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div className="team-banner" style={{ '--team': colorFor(selected.colorHex, selected.name) }}>
              <Crest name={selected.name} color={selected.colorHex} size={88} />
              <div className="team-banner__id">
                <span className="eyebrow">Groupe {selected.group}</span>
                <h2 className="display team-banner__name">{selected.name}</h2>
              </div>
              <div className="team-banner__stats">
                {[
                  [selectedStanding ? `${selectedStanding.rank}${selectedStanding.rank === 1 ? 'er' : 'e'}` : '–', 'Classement'],
                  [selectedStanding?.points ?? 0, 'Points'],
                  [selectedStanding?.goalsFor ?? teamGoals, 'Buts marqués'],
                  [roster.length, 'Joueurs']
                ].map(([value, label], i) => (
                  <div key={label} style={{ display: 'contents' }}>
                    {i > 0 && <span className="team-banner__divider" />}
                    <div className="team-banner__stat"><strong>{value}</strong><span>{label}</span></div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="section-head" style={{ marginBottom: 24 }}>
                <div className="section-head__titles">
                  <span className="kicker">Effectif</span>
                  <h2 className="section-title section-title--sm">Les joueurs</h2>
                </div>
              </div>
              {roster.length === 0 ? (
                <div className="card empty">Effectif en cours de confirmation.</div>
              ) : (
                <div className="roster">
                  {roster.map(p => (
                    <PlayerCard key={p.id} player={p} color={colorFor(selected.colorHex, selected.name)} stats={playerStats.get(p.id)} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
