import React, { useState, useEffect } from 'react';
import { Save, AlertTriangle, CheckCircle, Activity, Gamepad2, ShieldAlert, Trophy } from 'lucide-react';
import { updateMatchSheet } from '../services/api';

export default function AdminMatchSheet({ matches, onMatchUpdated }) {
  const [selectedMatchId, setSelectedMatchId] = useState(matches[0]?.id || '');
  const [activeTab, setActiveTab] = useState('physical');
  const [saving, setSaving] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const selectedMatch = matches.find(m => m.id === selectedMatchId) || matches[0];

  // State for the sheet
  const [status, setStatus] = useState('Completed');
  const [venue, setVenue] = useState('');

  // Physical stats
  const [t1PhysGoals, setT1PhysGoals] = useState(0);
  const [t2PhysGoals, setT2PhysGoals] = useState(0);
  const [t1PhysPoss, setT1PhysPoss] = useState(50);
  const [t2PhysPoss, setT2PhysPoss] = useState(50);
  const [t1PhysShots, setT1PhysShots] = useState(10);
  const [t2PhysShots, setT2PhysShots] = useState(8);
  const [t1PhysShotsOnTarget, setT1PhysShotsOnTarget] = useState(5);
  const [t2PhysShotsOnTarget, setT2PhysShotsOnTarget] = useState(4);
  const [t1PhysCorners, setT1PhysCorners] = useState(3);
  const [t2PhysCorners, setT2PhysCorners] = useState(2);
  const [t1PhysFouls, setT1PhysFouls] = useState(5);
  const [t2PhysFouls, setT2PhysFouls] = useState(6);
  const [t1PhysYellow, setT1PhysYellow] = useState(0);
  const [t2PhysYellow, setT2PhysYellow] = useState(1);
  const [t1PhysRed, setT1PhysRed] = useState(0);
  const [t2PhysRed, setT2PhysRed] = useState(0);

  // Digital stats
  const [t1DigGoals, setT1DigGoals] = useState(0);
  const [t2DigGoals, setT2DigGoals] = useState(0);
  const [t1DigPoss, setT1DigPoss] = useState(50);
  const [t2DigPoss, setT2DigPoss] = useState(50);
  const [t1DigShots, setT1DigShots] = useState(12);
  const [t2DigShots, setT2DigShots] = useState(9);
  const [t1DigShotsOnTarget, setT1DigShotsOnTarget] = useState(7);
  const [t2DigShotsOnTarget, setT2DigShotsOnTarget] = useState(5);
  const [t1DigCorners, setT1DigCorners] = useState(4);
  const [t2DigCorners, setT2DigCorners] = useState(3);
  const [t1DigFouls, setT1DigFouls] = useState(2);
  const [t2DigFouls, setT2DigFouls] = useState(3);
  const [t1DigYellow, setT1DigYellow] = useState(0);
  const [t2DigYellow, setT2DigYellow] = useState(0);

  // Penalties
  const [t1Penalties, setT1Penalties] = useState(null);
  const [t2Penalties, setT2Penalties] = useState(null);

  // Load match data when selected match changes
  useEffect(() => {
    if (!selectedMatch) return;
    setStatus(selectedMatch.status || 'Completed');
    setVenue(selectedMatch.venue || 'Phygital Arena Montréal');

    setT1PhysGoals(selectedMatch.team1PhysicalGoals || 0);
    setT2PhysGoals(selectedMatch.team2PhysicalGoals || 0);
    setT1PhysPoss(selectedMatch.team1PhysicalStat?.possessionPercentage || 50);
    setT2PhysPoss(selectedMatch.team2PhysicalStat?.possessionPercentage || 50);
    setT1PhysShots(selectedMatch.team1PhysicalStat?.totalShots || 10);
    setT2PhysShots(selectedMatch.team2PhysicalStat?.totalShots || 8);
    setT1PhysShotsOnTarget(selectedMatch.team1PhysicalStat?.shotsOnTarget || 5);
    setT2PhysShotsOnTarget(selectedMatch.team2PhysicalStat?.shotsOnTarget || 4);
    setT1PhysCorners(selectedMatch.team1PhysicalStat?.corners || 3);
    setT2PhysCorners(selectedMatch.team2PhysicalStat?.corners || 2);
    setT1PhysFouls(selectedMatch.team1PhysicalStat?.fouls || 5);
    setT2PhysFouls(selectedMatch.team2PhysicalStat?.fouls || 6);
    setT1PhysYellow(selectedMatch.team1PhysicalStat?.yellowCards || 0);
    setT2PhysYellow(selectedMatch.team2PhysicalStat?.yellowCards || 0);

    setT1DigGoals(selectedMatch.team1DigitalGoals || 0);
    setT2DigGoals(selectedMatch.team2DigitalGoals || 0);
    setT1DigPoss(selectedMatch.team1DigitalStat?.possessionPercentage || 50);
    setT2DigPoss(selectedMatch.team2DigitalStat?.possessionPercentage || 50);
    setT1DigShots(selectedMatch.team1DigitalStat?.totalShots || 12);
    setT2DigShots(selectedMatch.team2DigitalStat?.totalShots || 9);
    setT1DigShotsOnTarget(selectedMatch.team1DigitalStat?.shotsOnTarget || 7);
    setT2DigShotsOnTarget(selectedMatch.team2DigitalStat?.shotsOnTarget || 5);
    setT1DigCorners(selectedMatch.team1DigitalStat?.corners || 4);
    setT2DigCorners(selectedMatch.team2DigitalStat?.corners || 3);
    setT1DigFouls(selectedMatch.team1DigitalStat?.fouls || 2);
    setT2DigFouls(selectedMatch.team2DigitalStat?.fouls || 3);

    setT1Penalties(selectedMatch.team1Penalties);
    setT2Penalties(selectedMatch.team2Penalties);
  }, [selectedMatchId]);

  // Aggregate calculations in real-time
  const totalT1 = Number(t1PhysGoals) + Number(t1DigGoals);
  const totalT2 = Number(t2PhysGoals) + Number(t2DigGoals);
  const isTied = totalT1 === totalT2;

  const handleSave = async () => {
    if (!selectedMatch) return;
    setSaving(true);
    setFeedbackMessage(null);

    const sheetData = {
      status,
      scheduledDate: selectedMatch.scheduledDate,
      venue,
      team1PhysicalStat: {
        goals: Number(t1PhysGoals),
        possessionPercentage: Number(t1PhysPoss),
        totalShots: Number(t1PhysShots),
        shotsOnTarget: Number(t1PhysShotsOnTarget),
        corners: Number(t1PhysCorners),
        fouls: Number(t1PhysFouls),
        offsides: 0,
        yellowCards: Number(t1PhysYellow),
        redCards: Number(t1PhysRed)
      },
      team2PhysicalStat: {
        goals: Number(t2PhysGoals),
        possessionPercentage: Number(t2PhysPoss),
        totalShots: Number(t2PhysShots),
        shotsOnTarget: Number(t2PhysShotsOnTarget),
        corners: Number(t2PhysCorners),
        fouls: Number(t2PhysFouls),
        offsides: 0,
        yellowCards: Number(t2PhysYellow),
        redCards: Number(t2PhysRed)
      },
      team1DigitalStat: {
        goals: Number(t1DigGoals),
        possessionPercentage: Number(t1DigPoss),
        totalShots: Number(t1DigShots),
        shotsOnTarget: Number(t1DigShotsOnTarget),
        corners: Number(t1DigCorners),
        fouls: Number(t1DigFouls),
        offsides: 0,
        yellowCards: Number(t1DigYellow),
        redCards: 0
      },
      team2DigitalStat: {
        goals: Number(t2DigGoals),
        possessionPercentage: Number(t2DigPoss),
        totalShots: Number(t2DigShots),
        shotsOnTarget: Number(t2DigShotsOnTarget),
        corners: Number(t2DigCorners),
        fouls: Number(t2DigFouls),
        offsides: 0,
        yellowCards: Number(t2DigYellow),
        redCards: 0
      },
      team1Penalties: isTied ? (t1Penalties !== null ? Number(t1Penalties) : null) : null,
      team2Penalties: isTied ? (t2Penalties !== null ? Number(t2Penalties) : null) : null
    };

    try {
      const updated = await updateMatchSheet(selectedMatch.id, sheetData);
      setFeedbackMessage({ type: 'success', text: 'Feuille de match enregistrée avec succès ! Les classements ont été recalculés.' });
      if (onMatchUpdated) onMatchUpdated(updated);
    } catch (err) {
      // In case backend is offline, update locally
      setFeedbackMessage({ type: 'success', text: 'Feuille de match mise à jour localement (mode démo) !' });
      if (onMatchUpdated) {
        onMatchUpdated({
          ...selectedMatch,
          status,
          venue,
          team1PhysicalGoals: Number(t1PhysGoals),
          team2PhysicalGoals: Number(t2PhysGoals),
          team1DigitalGoals: Number(t1DigGoals),
          team2DigitalGoals: Number(t2DigGoals),
          team1TotalGoals: totalT1,
          team2TotalGoals: totalT2,
          team1Penalties: isTied ? t1Penalties : null,
          team2Penalties: isTied ? t2Penalties : null,
          requiresPenalties: isTied
        });
      }
    } finally {
      setSaving(false);
    }
  };

  if (!selectedMatch) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Aucun match configuré.</div>;
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px 24px 60px' }}>
      {/* Title */}
      <div style={{ marginBottom: '28px' }}>
        <span className="badge" style={{ background: 'var(--color-primary-muted)', color: 'var(--color-primary)', marginBottom: '8px' }}>
          ESPACE ORGANISATEUR & ARBITRE
        </span>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 900 }}>
          FEUILLE DE MATCH <span style={{ color: 'var(--color-primary)' }}>AVANCÉE</span>
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Saisie scindée en onglets pour la manche sur gazon et la manche sur console, avec calcul automatique du score cumulé et déverrouillage des tirs au but en cas d'égalité.
        </p>
      </div>

      {/* Match Selector Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Sélectionner la rencontre :
          </label>
          <select 
            value={selectedMatchId}
            onChange={(e) => setSelectedMatchId(e.target.value)}
            style={{
              background: '#0D1326',
              color: '#fff',
              border: '1px solid var(--border-color)',
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem'
            }}
          >
            {matches.map(m => (
              <option key={m.id} value={m.id}>
                {m.stage} : {m.team1Name} vs {m.team2Name} ({m.status})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Statut :
          </label>
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              background: '#0D1326',
              color: '#fff',
              border: '1px solid var(--border-color)',
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.95rem'
            }}
          >
            <option value="Scheduled">Planifié</option>
            <option value="InProgress">En cours</option>
            <option value="Completed">Terminé</option>
          </select>
        </div>
      </div>

      {/* Aggregate Score Live Monitor */}
      <div className="card" style={{
        padding: '24px',
        marginBottom: '28px',
        background: 'radial-gradient(circle at center, rgba(147, 51, 234, 0.12) 0%, rgba(15, 21, 37, 0.95) 100%)',
        border: '1px solid rgba(255, 0, 127, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', textAlign: 'center' }}>
          {/* Team 1 */}
          <div>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              border: '2px solid var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 8px',
              background: 'rgba(255,0,127,0.1)'
            }}>
              <span style={{ fontWeight: 800 }}>{selectedMatch.team1Name.substring(0, 2)}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#fff' }}>{selectedMatch.team1Name}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Gazon: {t1PhysGoals} | Console: {t1DigGoals}
            </div>
          </div>

          {/* Aggregate Total Display */}
          <div>
            <span className="badge badge-completed" style={{ marginBottom: '8px' }}>
              CALCUL DU SCORE CUMULÉ
            </span>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '3.2rem',
              fontWeight: 900,
              letterSpacing: '0.05em',
              color: '#fff'
            }}>
              <span style={{ color: 'var(--color-primary)' }}>{totalT1}</span>
              <span style={{ margin: '0 12px', color: 'var(--text-muted)' }}>:</span>
              <span style={{ color: 'var(--color-secondary)' }}>{totalT2}</span>
            </div>
            {isTied ? (
              <div style={{ color: 'var(--color-warning)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, justifyContent: 'center' }}>
                <AlertTriangle size={15} />
                ÉGALITÉ PARFAITE → TIRS AU BUT DÉVERROUILLÉS
              </div>
            ) : (
              <div style={{ color: 'var(--color-success)', fontSize: '0.85rem', fontWeight: 600 }}>
                Avantage : {totalT1 > totalT2 ? selectedMatch.team1Name : selectedMatch.team2Name}
              </div>
            )}
          </div>

          {/* Team 2 */}
          <div>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              border: '2px solid var(--color-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 8px',
              background: 'rgba(0,229,255,0.1)'
            }}>
              <span style={{ fontWeight: 800, color: 'var(--color-secondary)' }}>{selectedMatch.team2Name.substring(0, 2)}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#fff' }}>{selectedMatch.team2Name}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Gazon: {t2PhysGoals} | Console: {t2DigGoals}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher for Match Sheet */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('physical')}
          className={activeTab === 'physical' ? 'btn-primary' : 'btn-outline'}
        >
          <Activity size={16} />
          Onglet Manche 1 : Physique (Gazon)
        </button>

        <button
          onClick={() => setActiveTab('digital')}
          className={activeTab === 'digital' ? 'btn-secondary' : 'btn-outline'}
        >
          <Gamepad2 size={16} />
          Onglet Manche 2 : Virtuelle (Console)
        </button>

        <button
          onClick={() => setActiveTab('penalties')}
          className={activeTab === 'penalties' ? 'btn-primary' : 'btn-outline'}
          style={{
            borderColor: isTied ? 'var(--color-warning)' : undefined,
            color: isTied ? '#FFD700' : undefined
          }}
        >
          <Trophy size={16} />
          Onglet 3 : Tirs au But {isTied ? '(Actif)' : '(Verrouillé)'}
        </button>
      </div>

      {/* Sheet Tab Content */}
      <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
        {activeTab === 'physical' && (
          <div>
            <h3 style={{ color: 'var(--color-success)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⚽ Saisie des Statistiques - Manche sur Gazon Réel
            </h3>

            {/* Goals */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px', background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px' }}>
                  Buts {selectedMatch.team1Name} :
                </label>
                <input 
                  type="number" 
                  min="0"
                  value={t1PhysGoals} 
                  onChange={(e) => setT1PhysGoals(e.target.value)} 
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontSize: '1.2rem', fontWeight: 800 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 700, color: 'var(--color-secondary)', marginBottom: '8px' }}>
                  Buts {selectedMatch.team2Name} :
                </label>
                <input 
                  type="number" 
                  min="0"
                  value={t2PhysGoals} 
                  onChange={(e) => setT2PhysGoals(e.target.value)} 
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontSize: '1.2rem', fontWeight: 800 }}
                />
              </div>
            </div>

            {/* Stats matrix */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Possession {selectedMatch.team1Name} (%)</label>
                <input type="number" min="0" max="100" value={t1PhysPoss} onChange={(e) => { setT1PhysPoss(e.target.value); setT2PhysPoss(100 - e.target.value); }} style={{ width: '100%', padding: '8px', background: 'var(--bg-input)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', marginTop: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Possession {selectedMatch.team2Name} (%)</label>
                <input type="number" min="0" max="100" value={t2PhysPoss} onChange={(e) => { setT2PhysPoss(e.target.value); setT1PhysPoss(100 - e.target.value); }} style={{ width: '100%', padding: '8px', background: 'var(--bg-input)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', marginTop: '4px' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tirs Totaux (T1)</label>
                <input type="number" value={t1PhysShots} onChange={(e) => setT1PhysShots(e.target.value)} style={{ width: '100%', padding: '8px', background: 'var(--bg-input)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', marginTop: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tirs Totaux (T2)</label>
                <input type="number" value={t2PhysShots} onChange={(e) => setT2PhysShots(e.target.value)} style={{ width: '100%', padding: '8px', background: 'var(--bg-input)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', marginTop: '4px' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Corners (T1)</label>
                <input type="number" value={t1PhysCorners} onChange={(e) => setT1PhysCorners(e.target.value)} style={{ width: '100%', padding: '8px', background: 'var(--bg-input)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', marginTop: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Corners (T2)</label>
                <input type="number" value={t2PhysCorners} onChange={(e) => setT2PhysCorners(e.target.value)} style={{ width: '100%', padding: '8px', background: 'var(--bg-input)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', marginTop: '4px' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Fautes (T1)</label>
                <input type="number" value={t1PhysFouls} onChange={(e) => setT1PhysFouls(e.target.value)} style={{ width: '100%', padding: '8px', background: 'var(--bg-input)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', marginTop: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Fautes (T2)</label>
                <input type="number" value={t2PhysFouls} onChange={(e) => setT2PhysFouls(e.target.value)} style={{ width: '100%', padding: '8px', background: 'var(--bg-input)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', marginTop: '4px' }} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'digital' && (
          <div>
            <h3 style={{ color: 'var(--color-secondary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🎮 Saisie des Statistiques - Manche Console E-Sport (FIFA)
            </h3>

            {/* Goals */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px', background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px' }}>
                  Buts Virtuels {selectedMatch.team1Name} :
                </label>
                <input 
                  type="number" 
                  min="0"
                  value={t1DigGoals} 
                  onChange={(e) => setT1DigGoals(e.target.value)} 
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontSize: '1.2rem', fontWeight: 800 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 700, color: 'var(--color-secondary)', marginBottom: '8px' }}>
                  Buts Virtuels {selectedMatch.team2Name} :
                </label>
                <input 
                  type="number" 
                  min="0"
                  value={t2DigGoals} 
                  onChange={(e) => setT2DigGoals(e.target.value)} 
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontSize: '1.2rem', fontWeight: 800 }}
                />
              </div>
            </div>

            {/* Stats matrix */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Possession Virtuelle (T1 %)</label>
                <input type="number" min="0" max="100" value={t1DigPoss} onChange={(e) => { setT1DigPoss(e.target.value); setT2DigPoss(100 - e.target.value); }} style={{ width: '100%', padding: '8px', background: 'var(--bg-input)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', marginTop: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Possession Virtuelle (T2 %)</label>
                <input type="number" min="0" max="100" value={t2DigPoss} onChange={(e) => { setT2DigPoss(e.target.value); setT1DigPoss(100 - e.target.value); }} style={{ width: '100%', padding: '8px', background: 'var(--bg-input)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', marginTop: '4px' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tirs Cadrés Console (T1)</label>
                <input type="number" value={t1DigShotsOnTarget} onChange={(e) => setT1DigShotsOnTarget(e.target.value)} style={{ width: '100%', padding: '8px', background: 'var(--bg-input)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', marginTop: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tirs Cadrés Console (T2)</label>
                <input type="number" value={t2DigShotsOnTarget} onChange={(e) => setT2DigShotsOnTarget(e.target.value)} style={{ width: '100%', padding: '8px', background: 'var(--bg-input)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', marginTop: '4px' }} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'penalties' && (
          <div>
            <h3 style={{ color: 'var(--color-warning)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🏆 Séance de Tirs au But (Départage)
            </h3>

            {!isTied ? (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '20px',
                borderRadius: 'var(--radius-sm)',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <ShieldAlert size={24} />
                <div>
                  <strong>Séance non requise pour le moment :</strong>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Le score cumulé actuel est de {totalT1} à {totalT2}. Les tirs au but ne s'activent qu'en cas d'égalité stricte à la fin des deux manches.
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '20px', borderRadius: 'var(--radius-sm)' }}>
                <p style={{ color: 'var(--color-warning)', fontWeight: 600, marginBottom: '16px' }}>
                  Égalité constatée ! Saisissez le résultat de la séance de tirs au but :
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                      TAB {selectedMatch.team1Name} :
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      value={t1Penalties || 0} 
                      onChange={(e) => setT1Penalties(e.target.value)} 
                      style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontSize: '1.2rem', fontWeight: 800 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                      TAB {selectedMatch.team2Name} :
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      value={t2Penalties || 0} 
                      onChange={(e) => setT2Penalties(e.target.value)} 
                      style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontSize: '1.2rem', fontWeight: 800 }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Save Action & Feedback */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        {feedbackMessage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: feedbackMessage.type === 'success' ? 'var(--color-success)' : '#EF4444',
            fontSize: '0.9rem'
          }}>
            <CheckCircle size={18} />
            {feedbackMessage.text}
          </div>
        )}

        <button 
          onClick={handleSave} 
          disabled={saving} 
          className="btn-primary"
          style={{ minWidth: '220px', justifyContent: 'center' }}
        >
          <Save size={18} />
          {saving ? 'Enregistrement...' : 'Enregistrer la Feuille de Match'}
        </button>
      </div>
    </div>
  );
}
