import React from 'react';
import { Calendar, MapPin, ChevronRight, CheckCircle2, Clock } from 'lucide-react';

export default function MatchCard({ match, onSelect, onEdit }) {
  const isCompleted = match.status === 'Completed';

  return (
    <div 
      className="card"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        cursor: 'pointer'
      }}
      onClick={() => onSelect(match)}
    >
      {/* Top Meta */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={`badge ${isCompleted ? 'badge-completed' : 'badge-scheduled'}`}>
            {isCompleted ? <CheckCircle2 size={11} style={{ marginRight: '4px' }} /> : <Clock size={11} style={{ marginRight: '4px' }} />}
            {isCompleted ? 'Terminé' : 'À Venir'}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {match.stage === 'GroupA' ? 'Groupe A' : match.stage === 'GroupB' ? 'Groupe B' : match.stage}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.73rem', color: 'var(--text-muted)' }}>
          <Calendar size={12} />
          {new Date(match.scheduledDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Matchup row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
        {/* Team 1 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--bg-elevated)',
            border: `2px solid ${match.team1ColorHex || 'var(--border-active)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            {match.team1LogoUrl ? (
              <img src={match.team1LogoUrl} alt="" style={{ height: '22px', objectFit: 'contain' }} />
            ) : (
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem', color: match.team1ColorHex || 'var(--text-primary)' }}>
                {match.team1Name.substring(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <span style={{ 
            fontWeight: isCompleted && match.team1TotalGoals > match.team2TotalGoals ? 700 : 500,
            color: isCompleted && match.team1TotalGoals > match.team2TotalGoals ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontSize: '0.92rem'
          }}>
            {match.team1Name}
          </span>
        </div>

        {/* Scores */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          padding: '0 16px',
          minWidth: '90px'
        }}>
          {isCompleted ? (
            <>
              <div style={{ 
                fontFamily: 'var(--font-display)', 
                fontSize: '1.5rem', 
                fontWeight: 800, 
                letterSpacing: '0.05em',
                color: 'var(--text-primary)'
              }}>
                <span style={{ color: match.team1TotalGoals > match.team2TotalGoals ? 'var(--color-primary)' : 'var(--text-primary)' }}>
                  {match.team1TotalGoals}
                </span>
                <span style={{ margin: '0 6px', color: 'var(--text-muted)' }}>:</span>
                <span style={{ color: match.team2TotalGoals > match.team1TotalGoals ? 'var(--color-primary)' : 'var(--text-primary)' }}>
                  {match.team2TotalGoals}
                </span>
              </div>
              {match.team1Penalties != null && match.team2Penalties != null && (
                <span style={{ fontSize: '0.68rem', color: 'var(--color-warning)', fontWeight: 700 }}>
                  TAB: ({match.team1Penalties} - {match.team2Penalties})
                </span>
              )}
            </>
          ) : (
            <span style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '1.1rem', 
              color: 'var(--text-muted)', 
              fontWeight: 700 
            }}>
              VS
            </span>
          )}
        </div>

        {/* Team 2 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, justifyContent: 'flex-end' }}>
          <span style={{ 
            fontWeight: isCompleted && match.team2TotalGoals > match.team1TotalGoals ? 700 : 500,
            color: isCompleted && match.team2TotalGoals > match.team1TotalGoals ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontSize: '0.92rem',
            textAlign: 'right'
          }}>
            {match.team2Name}
          </span>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--bg-elevated)',
            border: `2px solid ${match.team2ColorHex || 'var(--border-active)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            {match.team2LogoUrl ? (
              <img src={match.team2LogoUrl} alt="" style={{ height: '22px', objectFit: 'contain' }} />
            ) : (
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem', color: match.team2ColorHex || 'var(--text-primary)' }}>
                {match.team2Name.substring(0, 2).toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Subscores pill */}
      {isCompleted && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          background: 'var(--bg-surface)',
          padding: '8px 14px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.73rem',
          border: '1px solid var(--border-subtle)'
        }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            ⚽ Gazon: <strong style={{ color: 'var(--color-success)' }}>{match.team1PhysicalGoals} - {match.team2PhysicalGoals}</strong>
          </span>
          <span style={{ color: 'var(--border-active)' }}>|</span>
          <span style={{ color: 'var(--text-secondary)' }}>
            🎮 Console: <strong style={{ color: 'var(--color-secondary)' }}>{match.team1DigitalGoals} - {match.team2DigitalGoals}</strong>
          </span>
        </div>
      )}

      {/* Bottom bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.73rem', color: 'var(--text-muted)' }}>
          <MapPin size={11} />
          <span>{match.venue || 'Montréal Arena'}</span>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {onEdit && (
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(match); }}
              className="btn-outline" 
              style={{ padding: '4px 10px', fontSize: '0.72rem' }}
            >
              Feuille de match
            </button>
          )}
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', display: 'flex', alignItems: 'center' }}>
            Voir <ChevronRight size={14} />
          </span>
        </div>
      </div>
    </div>
  );
}
