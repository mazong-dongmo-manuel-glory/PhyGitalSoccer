import React from 'react';
import { Trophy, Award, Zap } from 'lucide-react';

export default function TournamentBracket({ matches, onSelectMatch }) {
  const groupAMatches = matches.filter(m => m.stage === 'GroupA');
  const groupBMatches = matches.filter(m => m.stage === 'GroupB');

  const renderMatchRow = (m) => (
    <div 
      key={m.id} 
      onClick={() => onSelectMatch(m)}
      style={{
        padding: '10px 14px',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-subtle)',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'border-color 0.2s'
      }}
      onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--border-active)'}
      onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
    >
      <div style={{ fontSize: '0.85rem' }}>
        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.team1Name}</div>
        <div style={{ color: 'var(--text-secondary)' }}>{m.team2Name}</div>
      </div>
      <div style={{ textAlign: 'right', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
        {m.status === 'Completed' ? (
          <span style={{ color: 'var(--text-primary)' }}>{m.team1TotalGoals} - {m.team2TotalGoals}</span>
        ) : (
          <span style={{ color: 'var(--text-muted)', fontSize: '0.73rem' }}>À venir</span>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 24px 60px' }}>
      {/* Title */}
      <div style={{ marginBottom: '36px', textAlign: 'center' }}>
        <div className="section-label">
          <Zap size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
          Arbre Officiel du Tournoi
        </div>
        <h2 className="section-title">
          Structure des <em>8 Équipes</em>
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem' }}>
          De la phase de poules aux demi-finales croisées jusqu'à la consécration finale.
        </p>
      </div>

      {/* Bracket Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        alignItems: 'start'
      }}>
        {/* Groups */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '20px', borderTop: '3px solid var(--color-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
                Poule A
              </h3>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)' }}>Top 2 Qualifiés</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {groupAMatches.map(renderMatchRow)}
            </div>
          </div>

          <div className="card" style={{ padding: '20px', borderTop: '3px solid var(--color-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--color-secondary)', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
                Poule B
              </h3>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)' }}>Top 2 Qualifiés</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {groupBMatches.map(renderMatchRow)}
            </div>
          </div>
        </div>

        {/* Semi-Finals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '20px', borderTop: '3px solid var(--color-accent)' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-accent)', marginBottom: '16px', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
              Demi-Finales Croisées
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                padding: '14px',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Demi-Finale 1 — 1er A vs 2e B
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: 'var(--text-primary)', padding: '3px 0', fontSize: '0.9rem' }}>
                  <span>1er Groupe A</span>
                  <span style={{ color: 'var(--text-muted)' }}>—</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', padding: '3px 0', fontSize: '0.9rem' }}>
                  <span>2e Groupe B</span>
                  <span style={{ color: 'var(--text-muted)' }}>—</span>
                </div>
              </div>

              <div style={{
                padding: '14px',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Demi-Finale 2 — 1er B vs 2e A
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: 'var(--text-primary)', padding: '3px 0', fontSize: '0.9rem' }}>
                  <span>1er Groupe B</span>
                  <span style={{ color: 'var(--text-muted)' }}>—</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', padding: '3px 0', fontSize: '0.9rem' }}>
                  <span>2e Groupe A</span>
                  <span style={{ color: 'var(--text-muted)' }}>—</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final & 3rd Place */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Final */}
          <div className="card" style={{ 
            padding: '28px', 
            textAlign: 'center',
            borderTop: '3px solid var(--color-gold)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--color-gold-muted)',
              border: '2px solid var(--color-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px'
            }}>
              <Trophy size={22} color="var(--color-gold)" />
            </div>
            <span className="badge" style={{ background: 'var(--color-gold-muted)', color: 'var(--color-gold)', marginBottom: '10px' }}>
              Grande Finale
            </span>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '16px', color: 'var(--text-primary)', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
              Titre PhyGital Champion
            </h3>
            <div style={{
              padding: '16px',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '12px'
            }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '8px', textTransform: 'uppercase' }}>
                Vainqueur SF 1 vs Vainqueur SF 2
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                À Déterminer
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0' }}>vs</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                À Déterminer
              </div>
            </div>
            <span style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
              Manche Gazon 15m + Match E-Sport 12m + TAB si égalité
            </span>
          </div>

          {/* 3rd place */}
          <div className="card" style={{ padding: '18px', textAlign: 'center' }}>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <Award size={11} style={{ marginRight: '4px' }} />
              Petite Finale (3ème Place)
            </span>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
              Perdant SF 1 vs Perdant SF 2
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
