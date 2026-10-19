import { useMemo, useState } from 'react';
import { Check, Lock, Plus, Save, Trash2, X } from 'lucide-react';
import AdminTopbar from './AdminTopbar';
import Crest from './Crest';
import { AuthError, updateMatchSheet } from '../services/api';
import { formatDay, formatTime, stageLabel } from '../utils/format';

const STAT_FIELDS = [
  ['possessionPercentage', 'Possession (%)', 100],
  ['totalShots', 'Tirs'],
  ['shotsOnTarget', 'Tirs cadrés'],
  ['corners', 'Corners'],
  ['fouls', 'Fautes'],
  ['offsides', 'Hors-jeu'],
  ['yellowCards', 'Cartons jaunes'],
  ['redCards', 'Cartons rouges']
];

const STATUSES = [
  ['Scheduled', 'Planifié'],
  ['InProgress', 'En cours'],
  ['Completed', 'Terminé']
];

const EVENT_KINDS = {
  goals: 'But',
  assists: 'Passe décisive',
  yellowCards: 'Carton jaune',
  redCards: 'Carton rouge'
};

const ROUNDS = { Physical: 'terrain', Digital: 'console' };

function statFrom(stat, goals) {
  const s = stat || {};
  return {
    goals: goals ?? s.goals ?? 0,
    possessionPercentage: s.possessionPercentage ?? 50,
    totalShots: s.totalShots ?? 0,
    shotsOnTarget: s.shotsOnTarget ?? 0,
    corners: s.corners ?? 0,
    fouls: s.fouls ?? 0,
    offsides: s.offsides ?? 0,
    yellowCards: s.yellowCards ?? 0,
    redCards: s.redCards ?? 0
  };
}

let eventSeq = 0;
const newEventId = () => `ev-${++eventSeq}`;

function eventsFrom(playerStats = []) {
  const out = [];
  for (const ps of playerStats) {
    for (const kind of Object.keys(EVENT_KINDS)) {
      for (let i = 0; i < (ps[kind] || 0); i++) {
        out.push({ id: newEventId(), playerId: ps.playerId, type: ps.type, kind });
      }
    }
  }
  return out;
}

function aggregateEvents(events) {
  const map = new Map();
  for (const e of events) {
    const key = `${e.playerId}|${e.type}`;
    const row = map.get(key) || { playerId: e.playerId, type: e.type, goals: 0, assists: 0, yellowCards: 0, redCards: 0 };
    row[e.kind] += 1;
    map.set(key, row);
  }
  return [...map.values()];
}

function Stepper({ value, onChange, max }) {
  const clamp = (v) => Math.max(0, Math.min(max ?? 999, Number.isFinite(v) ? v : 0));
  return (
    <div className="stepper">
      <button type="button" onClick={() => onChange(clamp(value - 1))} aria-label="Diminuer">−</button>
      <input
        type="number"
        min="0"
        max={max}
        value={value}
        onChange={(e) => onChange(clamp(parseInt(e.target.value, 10)))}
      />
      <button type="button" onClick={() => onChange(clamp(value + 1))} aria-label="Augmenter">+</button>
    </div>
  );
}

function CheckItem({ ok, children }) {
  return (
    <span className={ok ? 'is-ok' : 'is-ko'} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      {ok ? <Check size={14} /> : <X size={14} />}
      {children}
    </span>
  );
}

function useSheetEditor({ match, team1, team2, onSaved, onSessionExpired }) {
  const [status, setStatus] = useState(match.status || 'Scheduled');
  const [venue, setVenue] = useState(match.venue || '');
  const [stats, setStats] = useState(() => ({
    Physical: [statFrom(match.team1PhysicalStat, match.team1PhysicalGoals), statFrom(match.team2PhysicalStat, match.team2PhysicalGoals)],
    Digital: [statFrom(match.team1DigitalStat, match.team1DigitalGoals), statFrom(match.team2DigitalStat, match.team2DigitalGoals)]
  }));
  const [penalties, setPenalties] = useState([match.team1Penalties ?? 0, match.team2Penalties ?? 0]);
  const [events, setEvents] = useState(() => eventsFrom(match.playerStats));
  const [tab, setTab] = useState('Physical');
  const [draft, setDraft] = useState({ playerId: '', kind: 'goals' });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [dirty, setDirty] = useState(false);

  const players = useMemo(() => {
    const map = new Map();
    for (const [team, color] of [[team1, match.team1ColorHex], [team2, match.team2ColorHex]]) {
      for (const p of team?.players || []) map.set(p.id, { ...p, teamName: team.name, teamColor: color });
    }
    for (const ps of match.playerStats || []) {
      if (!map.has(ps.playerId)) map.set(ps.playerId, { id: ps.playerId, name: ps.playerName, teamId: ps.teamId, teamName: ps.teamName });
    }
    return map;
  }, [team1, team2, match]);

  const touch = () => { setDirty(true); setFeedback(null); };

  const setStat = (round, side, key, value) => {
    touch();
    setStats(prev => {
      const next = { ...prev, [round]: [...prev[round]] };
      next[round][side] = { ...next[round][side], [key]: value };
      if (key === 'possessionPercentage') {
        const other = 1 - side;
        next[round][other] = { ...next[round][other], possessionPercentage: 100 - value };
      }
      return next;
    });
  };

  const total1 = stats.Physical[0].goals + stats.Digital[0].goals;
  const total2 = stats.Physical[1].goals + stats.Digital[1].goals;
  const isTied = total1 === total2;

  const round = tab === 'Physical' || tab === 'Digital' ? tab : null;
  const roundEvents = (type) => events.filter(e => e.type === type);
  const teamGoalsFromEvents = (type, teamId) =>
    events.filter(e => e.type === type && e.kind === 'goals' && players.get(e.playerId)?.teamId === teamId).length;

  const checksFor = (type) => {
    const [a, b] = stats[type];
    return [
      { ok: a.possessionPercentage + b.possessionPercentage === 100, label: 'Possession = 100 %' },
      { ok: a.shotsOnTarget <= a.totalShots && b.shotsOnTarget <= b.totalShots, label: 'Tirs cadrés ≤ tirs' },
      {
        ok: teamGoalsFromEvents(type, match.team1Id) <= a.goals && teamGoalsFromEvents(type, match.team2Id) <= b.goals,
        label: 'Buteurs cohérents avec le score'
      }
    ];
  };

  const addEvent = () => {
    if (!draft.playerId || !round) return;
    touch();
    setEvents(prev => [...prev, { id: newEventId(), playerId: draft.playerId, type: round, kind: draft.kind }]);
  };

  const removeEvent = (id) => {
    touch();
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    const sheetData = {
      status,
      scheduledDate: match.scheduledDate,
      venue,
      team1PhysicalStat: stats.Physical[0],
      team2PhysicalStat: stats.Physical[1],
      team1DigitalStat: stats.Digital[0],
      team2DigitalStat: stats.Digital[1],
      team1Penalties: isTied ? penalties[0] : null,
      team2Penalties: isTied ? penalties[1] : null,
      playerStats: aggregateEvents(events)
    };

    try {
      const updated = await updateMatchSheet(match.id, sheetData);
      setDirty(false);
      setFeedback({ tone: 'success', text: `Publié à ${new Date().toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' })}` });
      onSaved?.(updated);
    } catch (err) {
      if (err instanceof AuthError) onSessionExpired?.();
      setFeedback({ tone: 'error', text: `Échec de l’enregistrement : ${err.message || 'serveur injoignable'}` });
    } finally {
      setSaving(false);
    }
  };

  const allChecks = [...checksFor('Physical'), ...checksFor('Digital')];
  const hint = feedback?.text || (dirty ? 'Modifications non enregistrées' : allChecks.every(c => c.ok) ? 'Feuille cohérente' : 'Vérifiez les contrôles');
  const hintTone = feedback?.tone || (dirty ? undefined : allChecks.every(c => c.ok) ? 'success' : 'error');

  const playerOptions = (team) => (team?.players || []).map(p => (
    <option key={p.id} value={p.id}>#{p.jerseyNumber} {p.name}</option>
  ));

  return { status, setStatus, venue, setVenue, touch, total1, total2, isTied, stats, tab, setTab, saving, hint, hintTone, handleSave, body: (
    <>
      <div className="agg-strip">
        <div className="agg-strip__team">
          <Crest name={match.team1Name} color={match.team1ColorHex} size={40} />
          {match.team1Name}
        </div>
        <div className="agg-strip__scores">
          <div className="agg"><span><span className="dot dot--phys" />TERRAIN</span><strong>{stats.Physical[0].goals} – {stats.Physical[1].goals}</strong></div>
          <div className="agg"><span><span className="dot dot--dig" />CONSOLE</span><strong>{stats.Digital[0].goals} – {stats.Digital[1].goals}</strong></div>
          <div className="agg agg--total"><span>CUMULÉ</span><strong>{total1} – {total2}</strong></div>
          {isTied && <div className="agg"><span>TAB</span><strong>{penalties[0]} – {penalties[1]}</strong></div>}
        </div>
        <div className="agg-strip__team agg-strip__team--away">
          {match.team2Name}
          <Crest name={match.team2Name} color={match.team2ColorHex} size={40} />
        </div>
      </div>

      <div className="tabs tabs--flush">
        <button type="button" className={`tab ${tab === 'Physical' ? 'is-active' : ''}`} onClick={() => setTab('Physical')}>
          <span className="dot dot--phys" />Manche terrain
        </button>
        <button type="button" className={`tab ${tab === 'Digital' ? 'is-active' : ''}`} onClick={() => setTab('Digital')}>
          <span className="dot dot--dig" />Manche console
        </button>
        <button type="button" className={`tab ${tab === 'events' ? 'is-active' : ''}`} onClick={() => setTab('events')}>
          Joueurs & événements <small className="muted">({events.length})</small>
        </button>
        <button
          type="button"
          className={`tab ${tab === 'penalties' ? 'is-active' : ''}`}
          onClick={() => setTab('penalties')}
          disabled={!isTied}
          title={isTied ? undefined : 'Disponible uniquement en cas d’égalité au score cumulé'}
        >
          {!isTied && <Lock size={14} />}Tirs au but
        </button>
      </div>

      {round && (
        <div className="sheet-columns">
          <div className="card">
            <div className="card__head">
              <h3 className="card__title">Statistiques · manche {ROUNDS[round]}</h3>
              <div className="sheet-cols">
                <span>{match.team1Name}</span>
                <span>{match.team2Name}</span>
              </div>
            </div>
            <div className="sheet-row is-highlight">
              <span className="sheet-row__label">Buts</span>
              <div className="sheet-row__inputs">
                <Stepper value={stats[round][0].goals} onChange={(v) => setStat(round, 0, 'goals', v)} />
                <Stepper value={stats[round][1].goals} onChange={(v) => setStat(round, 1, 'goals', v)} />
              </div>
            </div>
            {STAT_FIELDS.map(([key, label, max]) => (
              <div key={key} className="sheet-row">
                <span className="sheet-row__label">{label}</span>
                <div className="sheet-row__inputs">
                  <Stepper value={stats[round][0][key]} max={max} onChange={(v) => setStat(round, 0, key, v)} />
                  <Stepper value={stats[round][1][key]} max={max} onChange={(v) => setStat(round, 1, key, v)} />
                </div>
              </div>
            ))}
            <div className="checks">
              {checksFor(round).map(c => <CheckItem key={c.label} ok={c.ok}>{c.label}</CheckItem>)}
            </div>
          </div>

          <div className="card">
            <div className="card__head">
              <h3 className="card__title">Événements</h3>
              <span className="card__meta">Manche {ROUNDS[round]}</span>
            </div>
            <div style={{ padding: '0 16px' }}>
              {roundEvents(round).length === 0 && <p className="muted" style={{ fontSize: 13, padding: '12px 0' }}>Aucun événement saisi.</p>}
              {roundEvents(round).map(e => {
                const p = players.get(e.playerId);
                const isTeam1 = p?.teamId === match.team1Id;
                return (
                  <div key={e.id} className="event">
                    <span className="event__bar" style={{ background: isTeam1 ? (match.team1ColorHex || 'var(--brand)') : (match.team2ColorHex || 'var(--round-digital)') }} />
                    <div className="event__who">
                      <strong>{p?.name || 'Joueur inconnu'}</strong>
                      <span>{p?.teamName}</span>
                    </div>
                    <span className="event__kind">{EVENT_KINDS[e.kind]}</span>
                    <button type="button" className="icon-action icon-action--danger" onClick={() => removeEvent(e.id)} aria-label="Supprimer">
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="event-editor">
              <label className="field">
                <span>Joueur</span>
                <select className="select" value={draft.playerId} onChange={(e) => setDraft(d => ({ ...d, playerId: e.target.value }))}>
                  <option value="">Choisir un joueur…</option>
                  <optgroup label={match.team1Name}>{playerOptions(team1)}</optgroup>
                  <optgroup label={match.team2Name}>{playerOptions(team2)}</optgroup>
                </select>
              </label>
              <label className="field">
                <span>Action</span>
                <select className="select" value={draft.kind} onChange={(e) => setDraft(d => ({ ...d, kind: e.target.value }))}>
                  {Object.entries(EVENT_KINDS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                </select>
              </label>
              <div className="field" style={{ justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn--secondary btn--sm" onClick={addEvent} disabled={!draft.playerId}>
                  <Plus size={16} /> Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'events' && (
        <div className="card">
          <div className="card__head">
            <h3 className="card__title">Récapitulatif joueurs</h3>
            <span className="card__meta">Envoyé avec la feuille de match</span>
          </div>
          {events.length === 0 ? (
            <div className="empty">Aucun événement. Ajoutez buts, passes et cartons depuis les onglets de manche.</div>
          ) : (
            <table className="stat-table admin-table">
              <thead>
                <tr><th>Joueur</th><th>Équipe</th><th>Manche</th><th>Buts</th><th>Passes D.</th><th>Jaunes</th><th>Rouges</th></tr>
              </thead>
              <tbody>
                {aggregateEvents(events).map(r => {
                  const p = players.get(r.playerId);
                  return (
                    <tr key={`${r.playerId}-${r.type}`}>
                      <td><strong>{p?.name || 'Joueur inconnu'}</strong></td>
                      <td>{p?.teamName}</td>
                      <td><span className={r.type === 'Physical' ? 'c-phys' : 'c-dig'}>{r.type === 'Physical' ? 'Terrain' : 'Console'}</span></td>
                      <td>{r.goals}</td>
                      <td>{r.assists}</td>
                      <td>{r.yellowCards}</td>
                      <td>{r.redCards}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'penalties' && isTied && (
        <div className="card">
          <div className="card__head">
            <h3 className="card__title">Séance de tirs au but</h3>
            <span className="card__meta">Égalité {total1} – {total2} au score cumulé</span>
          </div>
          <div className="penalties">
            <div className="penalties__team">
              <Crest name={match.team1Name} color={match.team1ColorHex} size={56} />
              {match.team1Name}
              <Stepper value={penalties[0]} max={30} onChange={(v) => { touch(); setPenalties(p => [v, p[1]]); }} />
            </div>
            <span className="display" style={{ fontSize: 40 }}>{penalties[0]} – {penalties[1]}</span>
            <div className="penalties__team">
              <Crest name={match.team2Name} color={match.team2ColorHex} size={56} />
              {match.team2Name}
              <Stepper value={penalties[1]} max={30} onChange={(v) => { touch(); setPenalties(p => [p[0], v]); }} />
            </div>
          </div>
        </div>
      )}
    </>
  ) };
}

function SheetView({ match, team1, team2, matches, onSelect, onSaved, onSessionExpired }) {
  const s = useSheetEditor({ match, team1, team2, onSaved, onSessionExpired });

  return (
    <>
      <AdminTopbar crumb="Arbitrage & scores" title="Feuille de match" hint={s.hint} hintTone={s.hintTone}>
        <button type="button" className="btn btn--primary" onClick={s.handleSave} disabled={s.saving}>
          <Save size={18} /> {s.saving ? 'Enregistrement…' : 'Enregistrer et publier'}
        </button>
      </AdminTopbar>

      <div className="admin__content">
        <div className="card settings-bar">
          <label className="field field--strong">
            <span>Rencontre</span>
            <select className="select" value={match.id} onChange={(e) => onSelect(e.target.value)}>
              {matches.map(m => (
                <option key={m.id} value={m.id}>
                  {stageLabel(m.stage)} · {m.team1Name} vs {m.team2Name} · {formatDay(m.scheduledDate)} {formatTime(m.scheduledDate)}
                </option>
              ))}
            </select>
          </label>
          <label className="field field--strong">
            <span>Lieu</span>
            <input className="input" value={s.venue} onChange={(e) => { s.touch(); s.setVenue(e.target.value); }} placeholder="Stade, salle…" />
          </label>
          <div className="field field--strong">
            <span>Statut</span>
            <div className="seg seg--dark">
              {STATUSES.map(([value, label]) => (
                <button key={value} type="button" className={s.status === value ? 'is-active' : ''} onClick={() => { s.touch(); s.setStatus(value); }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {s.body}
      </div>
    </>
  );
}

export default function AdminMatchSheet({ matches, teams = [], onMatchUpdated, onSessionExpired }) {
  const sorted = useMemo(
    () => [...matches].sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate)),
    [matches]
  );
  const [selectedId, setSelectedId] = useState(() => (sorted.find(m => m.status !== 'Completed') || sorted[0])?.id);
  const match = sorted.find(m => m.id === selectedId) || sorted[0];

  if (!match) {
    return (
      <>
        <AdminTopbar crumb="Arbitrage & scores" title="Feuille de match" />
        <div className="admin__content"><div className="card empty">Aucune rencontre configurée.</div></div>
      </>
    );
  }

  return (
    <SheetView
      key={match.id}
      match={match}
      team1={teams.find(t => t.id === match.team1Id)}
      team2={teams.find(t => t.id === match.team2Id)}
      matches={sorted}
      onSelect={setSelectedId}
      onSaved={onMatchUpdated}
      onSessionExpired={onSessionExpired}
    />
  );
}
