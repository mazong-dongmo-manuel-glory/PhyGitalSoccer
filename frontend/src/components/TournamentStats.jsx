import React from 'react';
import { BarChart2, Activity, Gamepad2, Award, Zap, Shield, Target } from 'lucide-react';

export default function TournamentStats({ matches = [], topScorers = [] }) {
  const completedMatches = matches.filter(m => m.status === 'Completed');

  const totalPhysicalGoals = completedMatches.reduce((acc, m) => acc + (m.team1PhysicalGoals || 0) + (m.team2PhysicalGoals || 0), 0);
  const totalDigitalGoals = completedMatches.reduce((acc, m) => acc + (m.team1DigitalGoals || 0) + (m.team2DigitalGoals || 0), 0);
  const totalGoals = totalPhysicalGoals + totalDigitalGoals;

  const topPhysicalScorer = topScorers.length > 0 
    ? [...topScorers].sort((a, b) => b.physicalGoals - a.physicalGoals)[0] 
    : null;

  const topDigitalScorer = topScorers.length > 0 
    ? [...topScorers].sort((a, b) => b.digitalGoals - a.digitalGoals)[0] 
    : null;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Title */}
      <div style={{ marginBottom: '36px' }}>
        <div className="section-label">
          <BarChart2 size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
          Statistiques de Compétition
        </div>
        <h1 className="section-title">
          Analyse <em>PhyGital</em> & Performance
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px' }}>
          Visualisez la comparaison directe entre les performances physiques sur terrain réel et virtuelles sur console e-sport.
        </p>
      </div>

      {/* Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {/* Metric 1 */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Total Buts Inscrits
            </span>
            <Zap size={18} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {totalGoals}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Cumulé sur {completedMatches.length} rencontre(s) jouée(s)
          </div>
        </div>

        {/* Metric 2 */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-success)', textTransform: 'uppercase', fontWeight: 600 }}>
              ⚽ Gazon (Physique)
            </span>
            <Activity size={18} style={{ color: 'var(--color-success)' }} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {totalPhysicalGoals} <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>buts</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            {totalGoals > 0 ? ((totalPhysicalGoals / totalGoals) * 100).toFixed(1) : 0}% du total du tournoi
          </div>
        </div>

        {/* Metric 3 */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
              🎮 Console (Virtuel)
            </span>
            <Gamepad2 size={18} style={{ color: 'var(--color-secondary)' }} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {totalDigitalGoals} <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>buts</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            {totalGoals > 0 ? ((totalDigitalGoals / totalGoals) * 100).toFixed(1) : 0}% du total du tournoi
          </div>
        </div>
      </div>

      {/* MVP Player Awards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px'
      }}>
        {/* MVP Physical */}
        {topPhysicalScorer && (
          <div className="card" style={{ padding: '28px', borderLeft: '4px solid var(--color-success)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span className="badge badge-physical">
                <Award size={12} style={{ marginRight: '4px' }} /> MVP TERRAIN PHYSIQUE
              </span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '6px' }}>
              {topPhysicalScorer.playerName}
            </h3>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Équipe : <strong>{topPhysicalScorer.teamName}</strong> — {topPhysicalScorer.position}
            </div>
            <div style={{
              background: 'var(--bg-surface)',
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Buts sur Gazon</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-success)' }}>
                {topPhysicalScorer.physicalGoals} ⚽
              </span>
            </div>
          </div>
        )}

        {/* MVP Digital */}
        {topDigitalScorer && (
          <div className="card" style={{ padding: '28px', borderLeft: '4px solid var(--color-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span className="badge badge-digital">
                <Award size={12} style={{ marginRight: '4px' }} /> MVP CONSOLE VIRTUEL
              </span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '6px' }}>
              {topDigitalScorer.playerName}
            </h3>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Équipe : <strong>{topDigitalScorer.teamName}</strong> — {topDigitalScorer.position}
            </div>
            <div style={{
              background: 'var(--bg-surface)',
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Buts sur Console</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-secondary)' }}>
                {topDigitalScorer.digitalGoals} 🎮
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
