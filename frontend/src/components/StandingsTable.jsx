import React, { useState } from 'react';
import { Shield, Award } from 'lucide-react';

export default function StandingsTable({ standings, topScorers }) {
  const [selectedGroup, setSelectedGroup] = useState('A');
  const currentStandings = standings ? standings[selectedGroup] || [] : [];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 24px 60px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <div className="section-label">
          <Shield size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
          Classements Officiels
        </div>
        <h2 className="section-title">
          Tableau des <em>Scores & Poules</em>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Les 2 premières équipes de chaque groupe se qualifient pour les demi-finales.
        </p>
      </div>

      {/* Group Selector */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '28px' }}>
        <button
          onClick={() => setSelectedGroup('A')}
          className={selectedGroup === 'A' ? 'btn-primary' : 'btn-outline'}
          style={{ minWidth: '140px' }}
        >
          Groupe A
        </button>
        <button
          onClick={() => setSelectedGroup('B')}
          className={selectedGroup === 'B' ? 'btn-secondary' : 'btn-outline'}
          style={{ minWidth: '140px' }}
        >
          Groupe B
        </button>
      </div>

      {/* Table */}
      <div className="card" style={{ overflowX: 'auto', marginBottom: '40px', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
          <thead>
            <tr style={{ 
              background: 'var(--bg-surface)', 
              borderBottom: '1px solid var(--border-color)', 
              color: 'var(--text-muted)', 
              fontSize: '0.78rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em' 
            }}>
              <th style={{ padding: '14px 18px', width: '50px' }}>Pos</th>
              <th style={{ padding: '14px 18px' }}>Équipe</th>
              <th style={{ padding: '14px 18px', textAlign: 'center' }}>MJ</th>
              <th style={{ padding: '14px 18px', textAlign: 'center' }}>V</th>
              <th style={{ padding: '14px 18px', textAlign: 'center' }}>N</th>
              <th style={{ padding: '14px 18px', textAlign: 'center' }}>D</th>
              <th style={{ padding: '14px 18px', textAlign: 'center', color: 'var(--color-success)' }}>Gazon</th>
              <th style={{ padding: '14px 18px', textAlign: 'center', color: 'var(--color-secondary)' }}>Console</th>
              <th style={{ padding: '14px 18px', textAlign: 'center' }}>BP</th>
              <th style={{ padding: '14px 18px', textAlign: 'center' }}>BC</th>
              <th style={{ padding: '14px 18px', textAlign: 'center' }}>Diff</th>
              <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 700, color: 'var(--color-primary)' }}>Pts</th>
            </tr>
          </thead>
          <tbody>
            {currentStandings.map((team, index) => {
              const isQualified = index < 2;
              return (
                <tr 
                  key={team.teamId}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    background: isQualified ? 'rgba(34, 197, 94, 0.03)' : 'transparent',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  onMouseOut={(e) => e.currentTarget.style.background = isQualified ? 'rgba(34, 197, 94, 0.03)' : 'transparent'}
                >
                  <td style={{ padding: '14px 18px', fontWeight: 600 }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: isQualified ? 'var(--color-success-muted)' : 'rgba(255, 255, 255, 0.04)',
                      color: isQualified ? 'var(--color-success)' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.78rem',
                      fontWeight: 700
                    }}>
                      {index + 1}
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: team.colorHex || 'var(--color-primary)'
                      }} />
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{team.teamName}</span>
                      {isQualified && (
                        <span className="badge" style={{ background: 'var(--color-success-muted)', color: 'var(--color-success)', fontSize: '0.62rem' }}>
                          Qualifié
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'center', color: 'var(--text-secondary)' }}>{team.played}</td>
                  <td style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600, color: 'var(--text-primary)' }}>{team.won}</td>
                  <td style={{ padding: '14px 18px', textAlign: 'center', color: 'var(--text-secondary)' }}>{team.drawn}</td>
                  <td style={{ padding: '14px 18px', textAlign: 'center', color: 'var(--text-secondary)' }}>{team.lost}</td>
                  <td style={{ padding: '14px 18px', textAlign: 'center', color: 'var(--color-success)', fontWeight: 600 }}>{team.physicalGoalsFor}</td>
                  <td style={{ padding: '14px 18px', textAlign: 'center', color: 'var(--color-secondary)', fontWeight: 600 }}>{team.digitalGoalsFor}</td>
                  <td style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 700, color: 'var(--text-primary)' }}>{team.goalsFor}</td>
                  <td style={{ padding: '14px 18px', textAlign: 'center', color: 'var(--text-secondary)' }}>{team.goalsAgainst}</td>
                  <td style={{ padding: '14px 18px', textAlign: 'center', color: team.goalDifference > 0 ? 'var(--color-success)' : team.goalDifference < 0 ? 'var(--color-danger)' : 'var(--text-muted)', fontWeight: 600 }}>
                    {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                    {team.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Top Scorers */}
      {topScorers && topScorers.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Award size={20} color="var(--color-gold)" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
              Classement des Buteurs
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {topScorers.map((scorer, idx) => (
              <div key={scorer.playerId} className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  fontSize: '1.6rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  color: idx === 0 ? 'var(--color-gold)' : idx === 1 ? 'var(--text-secondary)' : 'var(--text-muted)',
                  width: '32px'
                }}>
                  #{idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{scorer.playerName}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{scorer.teamName}</div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '6px', fontSize: '0.73rem' }}>
                    <span style={{ color: 'var(--color-success)' }}>⚽ Gazon: {scorer.physicalGoals}</span>
                    <span style={{ color: 'var(--color-secondary)' }}>🎮 Console: {scorer.digitalGoals}</span>
                    {scorer.assists > 0 && <span style={{ color: 'var(--color-warning)' }}>👟 Passes: {scorer.assists}</span>}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                    {scorer.totalGoals}
                  </div>
                  <div style={{ fontSize: '0.62rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Buts
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
