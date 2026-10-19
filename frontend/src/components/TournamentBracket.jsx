import { Trophy } from 'lucide-react';
import PageHeader from './PageHeader';
import Crest from './Crest';
import { MiniFixture } from './MatchCard';
import { formatDay, formatTime, matchState } from '../utils/format';

function GroupCard({ group, rows }) {
  return (
    <div className="card bracket-group">
      <div className="card__head">
        <h3 className="card__title">Groupe {group}</h3>
        <span className="card__meta" style={{ color: 'var(--on-inverse-muted)' }}>Pts</span>
      </div>
      {rows.length === 0 && <div className="empty">Classement à venir</div>}
      {rows.map((t, i) => (
        <div key={t.teamId} className={`bracket-row ${i < 2 ? 'is-qualified' : ''}`}>
          <span className={`rank ${i < 2 ? 'is-qualified' : ''}`}>{i + 1}</span>
          <Crest name={t.teamName} color={t.colorHex} size={24} />
          <span className="bracket-row__name">{t.teamName}</span>
          <strong>{t.points}</strong>
        </div>
      ))}
    </div>
  );
}

function Slot({ seed, team, color, score, winner }) {
  return (
    <div className="slot">
      {team ? <Crest name={team} color={color} size={24} /> : <span className="slot__placeholder" />}
      <div style={{ minWidth: 0 }}>
        <div className="slot__seed">{seed}</div>
        <div className={`slot__team ${team ? '' : 'is-tbd'}`}>{team || 'À déterminer'}</div>
      </div>
      <span className="slot__score" style={winner ? { color: 'var(--text-primary)' } : undefined}>{score ?? '–'}</span>
    </div>
  );
}

function matchSlots(match, fallback) {
  if (!match) return fallback.map(f => ({ ...f }));
  const played = matchState(match) !== 'next';
  return [
    { seed: fallback[0].seed, team: match.team1Name, color: match.team1ColorHex, score: played ? match.team1TotalGoals : null, winner: match.winnerTeamId === match.team1Id },
    { seed: fallback[1].seed, team: match.team2Name, color: match.team2ColorHex, score: played ? match.team2TotalGoals : null, winner: match.winnerTeamId === match.team2Id }
  ];
}

function SemiCard({ title, match, fallback, onSelect }) {
  const slots = matchSlots(match, fallback);
  return (
    <button
      type="button"
      className="card bracket-match"
      style={{ textAlign: 'left', cursor: match ? 'pointer' : 'default' }}
      onClick={() => match && onSelect(match)}
    >
      <div className="card__head">
        <span className="tag" style={{ background: 'transparent', padding: 0 }}>{title}</span>
        <span className="card__meta">{match ? `${formatDay(match.scheduledDate)} · ${formatTime(match.scheduledDate)}` : 'À programmer'}</span>
      </div>
      {slots.map((s, i) => <Slot key={i} {...s} />)}
    </button>
  );
}

const pick = (rows, i) => rows[i] ? { team: rows[i].teamName, color: rows[i].colorHex } : {};

export default function TournamentBracket({ matches, standings, onSelectMatch }) {
  const A = standings?.A || [];
  const B = standings?.B || [];
  const semis = matches.filter(m => m.stage === 'SemiFinal').sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
  const final = matches.find(m => m.stage === 'Final');
  const third = matches.find(m => m.stage === 'ThirdPlace');

  const semi1Fallback = [{ seed: '1er Groupe A', ...pick(A, 0) }, { seed: '2e Groupe B', ...pick(B, 1) }];
  const semi2Fallback = [{ seed: '1er Groupe B', ...pick(B, 0) }, { seed: '2e Groupe A', ...pick(A, 1) }];

  const finalSlots = matchSlots(final, [{ seed: 'Vainqueur DF 1' }, { seed: 'Vainqueur DF 2' }]);
  const thirdSlots = matchSlots(third, [{ seed: 'Perdant DF 1' }, { seed: 'Perdant DF 2' }]);

  const byStage = (stage) => matches.filter(m => m.stage === stage).sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));

  return (
    <>
      <PageHeader
        kicker="Phase finale"
        title="Tableau final"
        subtitle="Les deux premiers de chaque groupe s’affrontent en demi-finales croisées."
      />

      <section className="section">
        <div className="container" style={{ overflowX: 'auto' }}>
          <div className="bracket">
            <GroupCard group="A" rows={A} />
            <span className="bracket__conn" />
            <SemiCard title="Demi-finale 1" match={semis[0]} fallback={semi1Fallback} onSelect={onSelectMatch} />
            <span className="bracket__conn" />
            <div className="bracket__finals">
              <button
                type="button"
                className="final-card"
                onClick={() => final && onSelectMatch(final)}
                style={{ cursor: final ? 'pointer' : 'default' }}
              >
                <Trophy size={40} color="var(--card-yellow)" />
                <span className="eyebrow">Grande finale</span>
                <span className="display" style={{ fontSize: 28 }}>
                  {final?.winnerName ? `${final.winnerName} champion` : 'Le champion PhyGital'}
                </span>
                {finalSlots.map((s, i) => (
                  <span key={i} className="final-card__team">
                    <span style={{ opacity: s.team ? 1 : 0.6 }}>{s.team || s.seed}</span>
                    <strong>{s.score ?? '–'}</strong>
                  </span>
                ))}
                <span style={{ fontSize: 12, color: 'var(--on-inverse-muted)' }}>
                  {final ? `${formatDay(final.scheduledDate)} · ${formatTime(final.scheduledDate)}` : 'Date à confirmer'}
                </span>
              </button>
              <button
                type="button"
                className="card bracket-match"
                style={{ width: 240, textAlign: 'left', cursor: third ? 'pointer' : 'default' }}
                onClick={() => third && onSelectMatch(third)}
              >
                <div className="card__head">
                  <span className="tag" style={{ background: 'transparent', padding: 0 }}>Petite finale</span>
                  <span className="card__meta">3e place</span>
                </div>
                {thirdSlots.map((s, i) => <Slot key={i} {...s} />)}
              </button>
            </div>
            <span className="bracket__conn" />
            <SemiCard title="Demi-finale 2" match={semis[1]} fallback={semi2Fallback} onSelect={onSelectMatch} />
            <span className="bracket__conn" />
            <GroupCard group="B" rows={B} />
          </div>

          <div className="bracket-legend">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><span className="legend__swatch" />Qualifiés</span>
            <span>Score cumulé terrain + console · Tirs au but en cas d’égalité</span>
          </div>
        </div>
      </section>

      <section className="section section--surface">
        <div className="container">
          <div className="section-head">
            <div className="section-head__titles">
              <span className="kicker">Phase de groupes</span>
              <h2 className="section-title">Résultats des groupes</h2>
            </div>
          </div>
          <div className="group-matches">
            {['GroupA', 'GroupB'].map(stage => (
              <div key={stage} className="card">
                <div className="card__head">
                  <h3 className="card__title">{stage === 'GroupA' ? 'Groupe A' : 'Groupe B'}</h3>
                  <span className="card__meta">{byStage(stage).length} rencontres</span>
                </div>
                {byStage(stage).length === 0 && <div className="empty">Aucune rencontre</div>}
                {byStage(stage).map(m => <MiniFixture key={m.id} match={m} onSelect={onSelectMatch} />)}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
