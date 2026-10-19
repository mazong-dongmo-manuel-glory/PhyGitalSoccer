import { useMemo } from 'react';
import { Gamepad2, Trophy } from 'lucide-react';
import PageHeader from './PageHeader';
import Crest from './Crest';
import { aggregatePlayerStats } from '../utils/format';

const COMPARE = [
  ['totalShots', 'Tirs'],
  ['shotsOnTarget', 'Tirs cadrés'],
  ['corners', 'Corners'],
  ['fouls', 'Fautes'],
  ['offsides', 'Hors-jeu'],
  ['yellowCards', 'Cartons jaunes']
];

const sumStat = (matches, round, key) =>
  matches.reduce((s, m) => s + (m[`team1${round}Stat`]?.[key] || 0) + (m[`team2${round}Stat`]?.[key] || 0), 0);

function CompareRow({ label, phys, dig }) {
  const max = Math.max(phys, dig, 1);
  return (
    <div className="compare-row">
      <div className="compare-row__side compare-row__side--left">
        <span className="c-phys">{phys}</span>
        <div className="track track--left"><span style={{ width: `${(phys / max) * 100}%`, background: 'var(--round-physical)' }} /></div>
      </div>
      <div className="compare-row__label">{label}</div>
      <div className="compare-row__side">
        <div className="track"><span style={{ width: `${(dig / max) * 100}%`, background: 'var(--round-digital)' }} /></div>
        <span className="c-dig">{dig}</span>
      </div>
    </div>
  );
}

export default function TournamentStats({ matches = [], topScorers = [], teams = [] }) {
  const played = useMemo(() => matches.filter(m => m.status === 'Completed'), [matches]);

  const physGoals = played.reduce((s, m) => s + m.team1PhysicalGoals + m.team2PhysicalGoals, 0);
  const digGoals = played.reduce((s, m) => s + m.team1DigitalGoals + m.team2DigitalGoals, 0);
  const totalGoals = physGoals + digGoals;
  const shootouts = played.filter(m => m.team1Penalties != null && m.team2Penalties != null).length;
  const cards = ['Physical', 'Digital'].reduce(
    (s, r) => s + sumStat(played, r, 'yellowCards') + sumStat(played, r, 'redCards'),
    0
  );
  const physShare = totalGoals > 0 ? Math.round((physGoals / totalGoals) * 100) : 50;

  const kpis = [
    ['MATCHS JOUÉS', played.length, `/ ${matches.length}`, `${matches.length - played.length} à venir`],
    ['BUTS', totalGoals, '', 'Terrain + console'],
    ['MOYENNE', played.length ? (totalGoals / played.length).toFixed(1) : '0.0', 'buts/match', 'Score cumulé'],
    ['TIRS AU BUT', shootouts, '', 'Séances disputées'],
    ['CARTONS', cards, '', 'Jaunes et rouges']
  ];

  const players = [...aggregatePlayerStats(played).values()];
  const topScorer = topScorers[0];
  const topDigital = [...players].sort((a, b) => b.digitalGoals - a.digitalGoals)[0];

  const teamGoals = useMemo(() => {
    const map = new Map(teams.map(t => [t.id, { id: t.id, name: t.name, color: t.colorHex, phys: 0, dig: 0 }]));
    for (const m of played) {
      for (const side of ['team1', 'team2']) {
        const id = m[`${side}Id`];
        if (!map.has(id)) map.set(id, { id, name: m[`${side}Name`], color: m[`${side}ColorHex`], phys: 0, dig: 0 });
        const row = map.get(id);
        row.phys += m[`${side}PhysicalGoals`] || 0;
        row.dig += m[`${side}DigitalGoals`] || 0;
      }
    }
    return [...map.values()].sort((a, b) => b.phys + b.dig - (a.phys + a.dig));
  }, [played, teams]);
  const maxTeamGoals = Math.max(1, ...teamGoals.map(t => t.phys + t.dig));

  return (
    <>
      <PageHeader
        kicker="Les chiffres du tournoi"
        title="Statistiques"
        subtitle="Terrain contre console : où se gagnent vraiment les matchs ?"
      />

      <section className="section" style={{ paddingBottom: 48 }}>
        <div className="container kpis">
          {kpis.map(([label, value, unit, note]) => (
            <div key={label} className="card kpi">
              <span className="kpi__label">{label}</span>
              <span className="kpi__value">{value}{unit && <small>{unit}</small>}</span>
              <span className="kpi__note">{note}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section section--tight-top">
        <div className="container">
          <div className="section-head">
            <div className="section-head__titles">
              <span className="kicker">Comparatif</span>
              <h2 className="section-title">Terrain vs console</h2>
            </div>
          </div>
          <div className="card compare">
            <div className="compare__head">
              <span className="compare__side c-phys"><span className="dot dot--phys" />Terrain</span>
              <span className="compare__side c-dig">Console<span className="dot dot--dig" /></span>
            </div>
            <div>
              <div className="split-labels">
                <span className="c-phys">{physGoals} buts · {physShare}%</span>
                <span className="c-dig">{100 - physShare}% · {digGoals} buts</span>
              </div>
              <div className="split-bar">
                <span style={{ width: `${physShare}%`, background: 'var(--round-physical)' }} />
                <span style={{ width: `${100 - physShare}%`, background: 'var(--round-digital)' }} />
              </div>
            </div>
            <div>
              {COMPARE.map(([key, label]) => (
                <CompareRow key={key} label={label} phys={sumStat(played, 'Physical', key)} dig={sumStat(played, 'Digital', key)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--surface">
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
          <div>
            <div className="section-head">
              <div className="section-head__titles">
                <span className="kicker">Distinctions</span>
                <h2 className="section-title">Joueurs du tournoi</h2>
              </div>
            </div>
            <div className="mvps">
              <div className="mvp" style={{ '--accent': 'var(--brand)' }}>
                <span className="mvp__avatar"><Trophy size={40} /></span>
                <div className="mvp__who">
                  <span className="eyebrow">Meilleur buteur</span>
                  <div className="display mvp__name">{topScorer?.playerName || '—'}</div>
                  <span style={{ fontSize: 13, color: 'var(--on-inverse-muted)' }}>
                    {topScorer ? `${topScorer.teamName} · ${topScorer.physicalGoals} terrain, ${topScorer.digitalGoals} console` : 'Aucun but marqué'}
                  </span>
                </div>
                <span className="mvp__value">{topScorer?.totalGoals ?? 0}<small>buts</small></span>
              </div>
              <div className="mvp" style={{ '--accent': 'var(--round-digital)' }}>
                <span className="mvp__avatar"><Gamepad2 size={40} /></span>
                <div className="mvp__who">
                  <span className="eyebrow" style={{ color: '#8ea2ff' }}>Roi de la manette</span>
                  <div className="display mvp__name">{topDigital?.digitalGoals ? topDigital.playerName : '—'}</div>
                  <span style={{ fontSize: 13, color: 'var(--on-inverse-muted)' }}>
                    {topDigital?.digitalGoals ? topDigital.teamName : 'Aucun but console enregistré'}
                  </span>
                </div>
                <span className="mvp__value">{topDigital?.digitalGoals ?? 0}<small>buts console</small></span>
              </div>
            </div>
          </div>

          <div>
            <div className="section-head">
              <div className="section-head__titles">
                <span className="kicker">Attaque</span>
                <h2 className="section-title">Buts par équipe</h2>
              </div>
              <div className="pills">
                <span className="chip"><span className="dot dot--phys" />Terrain</span>
                <span className="chip"><span className="dot dot--dig" />Console</span>
              </div>
            </div>
            <div className="card team-bars">
              {teamGoals.length === 0 && <div className="empty">Aucune donnée.</div>}
              {teamGoals.map(t => (
                <div key={t.id} className="team-bar">
                  <div className="team-cell">
                    <Crest name={t.name} color={t.color} size={28} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</span>
                  </div>
                  <div className="team-bar__track">
                    <span style={{ width: `${(t.phys / maxTeamGoals) * 100}%`, background: 'var(--round-physical)' }} />
                    <span style={{ width: `${(t.dig / maxTeamGoals) * 100}%`, background: 'var(--round-digital)' }} />
                  </div>
                  <span className="team-bar__total">{t.phys + t.dig}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
