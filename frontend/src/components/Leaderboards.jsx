import Crest from './Crest';
import { teamForm } from '../utils/format';

export function GroupTable({ group, rows, compact = false, matches = [], goalsKey = 'goalsFor', againstKey = 'goalsAgainst' }) {
  return (
    <div className="card">
      <div className="card__head">
        <h3 className="card__title">Groupe {group}</h3>
        <span className="card__meta">{rows[0] ? `${Math.max(...rows.map(r => r.played))} journée(s) jouée(s)` : ''}</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className={`stat-table ${compact ? '' : 'stat-table--full'}`}>
          <thead>
            <tr>
              <th>#</th>
              <th className="col-team" style={{ textAlign: 'left' }}>Équipe</th>
              <th>J</th>
              {!compact && <><th>G</th><th>N</th><th>P</th><th>BP</th><th>BC</th></>}
              <th>+/-</th>
              {!compact && <th>Forme</th>}
              <th>Pts</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={compact ? 5 : 11} className="muted">Aucune équipe</td></tr>
            )}
            {rows.map((t, i) => {
              const diff = t[goalsKey] - t[againstKey];
              return (
                <tr key={t.teamId}>
                  <td><span className={`rank ${i < 2 ? 'is-qualified' : ''}`}>{i + 1}</span></td>
                  <td className="col-team">
                    <div className="team-cell">
                      <Crest name={t.teamName} color={t.colorHex} size={compact ? 24 : 28} />
                      {t.teamName}
                    </div>
                  </td>
                  <td>{t.played}</td>
                  {!compact && (
                    <>
                      <td>{t.won}</td>
                      <td>{t.drawn}</td>
                      <td>{t.lost}</td>
                      <td>{t[goalsKey]}</td>
                      <td>{t[againstKey]}</td>
                    </>
                  )}
                  <td>{diff > 0 ? `+${diff}` : diff}</td>
                  {!compact && (
                    <td>
                      <span className="form-pills">
                        {teamForm(t.teamId, matches).slice(-3).map((r, k) => (
                          <span key={k} className={`form-pill form-pill--${r}`}>{r}</span>
                        ))}
                      </span>
                    </td>
                  )}
                  <td className="col-pts">{t.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="legend">
        <span className="legend__swatch" />
        Qualifiés pour les demi-finales
      </div>
    </div>
  );
}

export function ScorersCard({ scorers, limit = 5, title = 'Meilleurs buteurs' }) {
  const list = scorers.slice(0, limit);
  return (
    <div className="card card--dark">
      <div className="card__head">
        <h3 className="card__title">{title}</h3>
        <span className="card__meta">Terrain + console</span>
      </div>
      <div className="leader-list">
        {list.length === 0 && <div className="empty" style={{ color: 'var(--on-inverse-muted)' }}>Aucun but marqué pour l’instant.</div>}
        {list.map((s, i) => (
          <div key={s.playerId} className="leader">
            <span className="leader__rank">{i + 1}</span>
            <Crest name={s.teamName} color={s.teamColorHex} size={32} />
            <div className="leader__who">
              <span className="leader__name">{s.playerName}</span>
              <span className="leader__sub">
                <span><span className="dot dot--phys" />{s.physicalGoals}</span>
                <span><span className="dot dot--dig" />{s.digitalGoals}</span>
                <span>{s.teamName}</span>
              </span>
            </div>
            <span className="leader__value">{s.totalGoals}<small>buts</small></span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SimpleBoard({ title, meta, rows, render, empty = 'Aucune donnée.' }) {
  return (
    <div className="card">
      <div className="card__head">
        <h3 className="card__title">{title}</h3>
        {meta && <span className="card__meta">{meta}</span>}
      </div>
      <div className="leader-list">
        {rows.length === 0 && <div className="empty">{empty}</div>}
        {rows.map((r, i) => (
          <div key={r.playerId} className="leader">
            <span className="leader__rank">{i + 1}</span>
            <div className="leader__who">
              <span className="leader__name">{r.playerName}</span>
              <span className="leader__sub">{r.teamName}</span>
            </div>
            {render(r)}
          </div>
        ))}
      </div>
    </div>
  );
}
