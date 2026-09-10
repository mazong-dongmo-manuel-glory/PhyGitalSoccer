import React, { useState } from 'react';
import { Users } from 'lucide-react';

export default function TeamsRoster({ teams }) {
  const [selectedGroup, setSelectedGroup] = useState('ALL');

  const filteredTeams = selectedGroup === 'ALL' 
    ? teams 
    : teams.filter(t => t.group === selectedGroup);

  const getPositionBadge = (pos) => {
    const posStyles = {
      Goalkeeper: { bg: 'var(--color-warning-muted)', color: '#eab308', label: 'Gardien' },
      0: { bg: 'var(--color-warning-muted)', color: '#eab308', label: 'Gardien' },
      Defender: { bg: 'var(--color-secondary-muted)', color: '#60a5fa', label: 'Défenseur' },
      1: { bg: 'var(--color-secondary-muted)', color: '#60a5fa', label: 'Défenseur' },
      Midfielder: { bg: 'var(--color-success-muted)', color: '#4ade80', label: 'Milieu' },
      2: { bg: 'var(--color-success-muted)', color: '#4ade80', label: 'Milieu' },
      Forward: { bg: 'rgba(239, 68, 68, 0.12)', color: '#f87171', label: 'Attaquant' },
      3: { bg: 'rgba(239, 68, 68, 0.12)', color: '#f87171', label: 'Attaquant' }
    };
    const s = posStyles[pos] || { bg: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', label: 'Joueur' };
    return <span className="badge" style={{ background: s.bg, color: s.color }}>{s.label}</span>;
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 24px 60px' }}>
      {/* Title */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <div className="section-label">
          <Users size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
          Franchises Participantes
        </div>
        <h2 className="section-title">
          Les 8 Équipes du <em>Tournoi</em>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Découvrez les effectifs d'athlètes hybrides concourant à la fois sur pelouse et sur console.
        </p>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '28px' }}>
        <button onClick={() => setSelectedGroup('ALL')} className={selectedGroup === 'ALL' ? 'btn-primary' : 'btn-outline'}>
          Toutes (8)
        </button>
        <button onClick={() => setSelectedGroup('A')} className={selectedGroup === 'A' ? 'btn-primary' : 'btn-outline'}>
          Poule A
        </button>
        <button onClick={() => setSelectedGroup('B')} className={selectedGroup === 'B' ? 'btn-secondary' : 'btn-outline'}>
          Poule B
        </button>
      </div>

      {/* Teams Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredTeams.map(team => (
          <div 
            key={team.id}
            className="card"
            style={{
              padding: '24px',
              borderTop: `3px solid ${team.colorHex || 'var(--color-primary)'}`,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Team Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                border: `2px solid ${team.colorHex || 'var(--border-active)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-elevated)',
                overflow: 'hidden'
              }}>
                {team.logoUrl ? (
                  <img src={team.logoUrl} alt="" style={{ height: '30px', objectFit: 'contain' }} />
                ) : (
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: team.colorHex || 'var(--text-primary)', fontSize: '1.1rem' }}>
                    {team.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {team.name}
                </h3>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Groupe {team.group}
                </span>
              </div>
            </div>

            {/* Roster */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.05em', fontWeight: 600 }}>
                Joueurs inscrits
              </div>
              {team.players && team.players.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {team.players.map(p => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                        {p.jerseyNumber && <span style={{ color: 'var(--text-muted)', marginRight: '6px' }}>#{p.jerseyNumber}</span>}
                        {p.name}
                      </span>
                      {getPositionBadge(p.position)}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  Effectif de 4 athlètes confirmés pour le coup d'envoi.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
