import React, { useState } from 'react';
import { X, Trophy, Activity, Gamepad2, Users } from 'lucide-react';

export default function MatchDetailModal({ match, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!match) return null;

  const t1Phys = match.team1PhysicalStat || {};
  const t2Phys = match.team2PhysicalStat || {};
  const t1Dig = match.team1DigitalStat || {};
  const t2Dig = match.team2DigitalStat || {};

  const renderStatComparison = (label, val1 = 0, val2 = 0, isPercentage = false) => {
    const total = (Number(val1) || 0) + (Number(val2) || 0);
    const p1 = total > 0 ? ((Number(val1) || 0) / total) * 100 : 50;

    return (
      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {val1}{isPercentage ? '%' : ''}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {label}
          </span>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {val2}{isPercentage ? '%' : ''}
          </span>
        </div>
        <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', display: 'flex', overflow: 'hidden' }}>
          <div style={{ width: `${p1}%`, background: 'var(--color-primary)', transition: 'width 0.4s ease' }} />
          <div style={{ width: `${100 - p1}%`, background: 'var(--color-secondary)', transition: 'width 0.4s ease' }} />
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'overview', label: "Synthèse", icon: Trophy },
    { id: 'physical', label: "⚽ Manche Physique", icon: Activity },
    { id: 'digital', label: "🎮 Manche Virtuelle", icon: Gamepad2 },
    { id: 'scorers', label: "Buteurs & Cartons", icon: Users }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '780px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-active)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Close button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255,255,255,0.06)',
            color: 'var(--text-secondary)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div style={{ padding: '28px 28px 20px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-completed">{match.stage}</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{match.venue || 'Montréal Arena'}</span>
          </div>

          {/* Teams Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                border: `2px solid ${match.team1ColorHex || 'var(--border-active)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px',
                background: 'var(--bg-elevated)'
              }}>
                {match.team1LogoUrl ? (
                  <img src={match.team1LogoUrl} alt="" style={{ height: '34px' }} />
                ) : (
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{match.team1Name.substring(0,2)}</span>
                )}
              </div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{match.team1Name}</h3>
            </div>

            {/* Score */}
            <div style={{ textAlign: 'center', padding: '0 20px' }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.8rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '0.04em'
              }}>
                <span>{match.team1TotalGoals}</span>
                <span style={{ margin: '0 10px', color: 'var(--text-muted)' }}>:</span>
                <span>{match.team2TotalGoals}</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Score Cumulé
              </div>
              {match.team1Penalties != null && match.team2Penalties != null && (
                <div style={{ marginTop: '6px', color: 'var(--color-warning)', fontSize: '0.82rem', fontWeight: 600 }}>
                  Tirs au But : {match.team1Penalties} - {match.team2Penalties}
                </div>
              )}
            </div>

            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                border: `2px solid ${match.team2ColorHex || 'var(--border-active)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px',
                background: 'var(--bg-elevated)'
              }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: match.team2ColorHex || 'var(--text-primary)' }}>
                  {match.team2Name.substring(0,2)}
                </span>
              </div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{match.team2Name}</h3>
            </div>
          </div>
        </div>

        {/* Tab switchers */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-surface)',
          padding: '0 28px',
          gap: '4px'
        }}>
          {tabs.map(tab => {
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '12px 16px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  color: isTabActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  borderBottom: isTabActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                  background: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  transition: 'color 0.2s'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div style={{ padding: '24px 28px' }}>
          {activeTab === 'overview' && (
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '20px'
              }}>
                <div style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '18px',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-success)', fontWeight: 600, textTransform: 'uppercase' }}>
                    ⚽ Manche Gazon
                  </span>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, margin: '8px 0', color: 'var(--text-primary)' }}>
                    {match.team1PhysicalGoals} - {match.team2PhysicalGoals}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Possession : {t1Phys.possessionPercentage || 50}% - {t2Phys.possessionPercentage || 50}%
                  </span>
                </div>

                <div style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '18px',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
                    🎮 Manche Console
                  </span>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, margin: '8px 0', color: 'var(--text-primary)' }}>
                    {match.team1DigitalGoals} - {match.team2DigitalGoals}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Possession : {t1Dig.possessionPercentage || 50}% - {t2Dig.possessionPercentage || 50}%
                  </span>
                </div>
              </div>

              {match.winnerName && (
                <div style={{
                  background: 'var(--bg-surface)',
                  padding: '14px 20px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}>
                  <Trophy size={18} color="var(--color-gold)" />
                  <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Vainqueur :</span>
                  <strong style={{ color: 'var(--color-primary)', fontSize: '1.05rem' }}>{match.winnerName}</strong>
                </div>
              )}
            </div>
          )}

          {activeTab === 'physical' && (
            <div>
              <h4 style={{ marginBottom: '18px', color: 'var(--color-success)', fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: '1rem' }}>
                Statistiques — Gazon Réel
              </h4>
              {renderStatComparison('Possession de balle', t1Phys.possessionPercentage, t2Phys.possessionPercentage, true)}
              {renderStatComparison('Tirs Totaux', t1Phys.totalShots, t2Phys.totalShots)}
              {renderStatComparison('Tirs Cadrés', t1Phys.shotsOnTarget, t2Phys.shotsOnTarget)}
              {renderStatComparison('Corners', t1Phys.corners, t2Phys.corners)}
              {renderStatComparison('Fautes', t1Phys.fouls, t2Phys.fouls)}
              {renderStatComparison('Cartons Jaunes', t1Phys.yellowCards, t2Phys.yellowCards)}
              {renderStatComparison('Cartons Rouges', t1Phys.redCards, t2Phys.redCards)}
            </div>
          )}

          {activeTab === 'digital' && (
            <div>
              <h4 style={{ marginBottom: '18px', color: 'var(--color-secondary)', fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: '1rem' }}>
                Statistiques — Console E-Sport
              </h4>
              {renderStatComparison('Possession de balle', t1Dig.possessionPercentage, t2Dig.possessionPercentage, true)}
              {renderStatComparison('Tirs Totaux', t1Dig.totalShots, t2Dig.totalShots)}
              {renderStatComparison('Tirs Cadrés', t1Dig.shotsOnTarget, t2Dig.shotsOnTarget)}
              {renderStatComparison('Corners', t1Dig.corners, t2Dig.corners)}
              {renderStatComparison('Fautes', t1Dig.fouls, t2Dig.fouls)}
              {renderStatComparison('Cartons Jaunes', t1Dig.yellowCards, t2Dig.yellowCards)}
            </div>
          )}

          {activeTab === 'scorers' && (
            <div>
              <h4 style={{ marginBottom: '18px', color: 'var(--text-primary)', fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: '1rem' }}>
                Détail des Joueurs & Actions
              </h4>
              {match.playerStats && match.playerStats.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {match.playerStats.map((ps, idx) => (
                    <div key={idx} style={{
                      padding: '10px 14px',
                      background: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <strong style={{ color: 'var(--text-primary)' }}>{ps.playerName}</strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '8px' }}>({ps.teamName})</span>
                        <span className={`badge ${ps.type === 'Physical' ? 'badge-physical' : 'badge-digital'}`} style={{ marginLeft: '10px', fontSize: '0.65rem' }}>
                          {ps.type === 'Physical' ? 'Gazon' : 'Console'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '0.82rem' }}>
                        {ps.goals > 0 && <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>⚽ {ps.goals} But(s)</span>}
                        {ps.assists > 0 && <span style={{ color: 'var(--color-warning)' }}>👟 {ps.assists} Passe(s)</span>}
                        {ps.yellowCards > 0 && <span style={{ color: '#FBBF24' }}>🟨 {ps.yellowCards}</span>}
                        {ps.redCards > 0 && <span style={{ color: '#EF4444' }}>🟥 {ps.redCards}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>
                  Aucune statistique individuelle saisie pour ce match.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
