import React, { useState } from 'react';
import { ArrowRight, Gamepad2, Activity, Play, X } from 'lucide-react';

export default function HeroSection({ onExploreBracket, onOpenAdmin, featuredMatch, onSelectMatch }) {
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <section style={{
      position: 'relative',
      padding: '48px 24px 56px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Breadcrumb */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        marginBottom: '28px',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}>
        <span>Accueil</span>
        <span>—</span>
        <span style={{ color: 'var(--text-secondary)' }}>Compétition 2026</span>
      </div>

      {/* Hero Title */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ 
          fontFamily: 'var(--font-display)',
          fontSize: '0.85rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--color-primary)',
          marginBottom: '12px'
        }}>
          Compétition Officielle 2026 — Format Hybride
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
          lineHeight: 1.05,
          fontWeight: 800,
          textTransform: 'uppercase',
          fontStyle: 'italic',
          marginBottom: '20px',
          color: 'var(--text-primary)'
        }}>
          PHYGITAL FOOTBALL
        </h1>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1.05rem',
          maxWidth: '680px',
          lineHeight: 1.7,
          marginBottom: '28px'
        }}>
          Chaque confrontation oppose deux équipes sur deux manches consécutives : une manche physique 
          sur vrai terrain, suivie d'une manche virtuelle sur console. Le vainqueur est désigné par 
          le score cumulé des deux univers.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <button onClick={onExploreBracket} className="btn-primary">
            Consulter le Bracket
            <ArrowRight size={16} />
          </button>
          <button onClick={onOpenAdmin} className="btn-outline">
            Voir les Équipes & Joueurs
          </button>
        </div>
      </div>

      {/* Feature Grid — Teaser + Featured Match */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '20px'
      }}>
        {/* Teaser Card */}
        <div 
          className="card" 
          onClick={() => setShowVideoModal(true)}
          style={{
            position: 'relative',
            overflow: 'hidden',
            minHeight: '280px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '28px',
            backgroundImage: 'linear-gradient(to top, rgba(8, 13, 26, 0.92) 20%, rgba(8, 13, 26, 0.3) 100%), url(/teaser-thumbnail.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            cursor: 'pointer'
          }}
        >
          {/* Play Overlay Icon */}
          <div style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--color-primary)',
            boxShadow: '0 8px 24px rgba(232, 21, 92, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            zIndex: 2,
            transition: 'transform 0.2s ease, background-color 0.2s ease'
          }}>
            <Play size={26} style={{ marginLeft: '3px' }} />
          </div>

          <div style={{ position: 'relative', zIndex: 2 }}>
            <span className="badge badge-digital" style={{ marginBottom: '12px' }}>
              <Gamepad2 size={11} style={{ marginRight: '5px' }} />
              Concept Hybride
            </span>
            <h3 style={{ 
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem', 
              fontWeight: 700,
              marginBottom: '8px', 
              color: 'var(--text-primary)',
              textTransform: 'uppercase'
            }}>
              Présentation du PhyGital Football
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '18px', lineHeight: 1.6 }}>
              Vivez l'excitation de la stratégie sur écran combinée à l'endurance athlétique sur le terrain. 
              8 équipes exclusives, 2 groupes, 1 seul trophée.
            </p>
            <button 
              className="btn-primary" 
              onClick={(e) => { e.stopPropagation(); setShowVideoModal(true); }}
              style={{ fontSize: '0.8rem', padding: '8px 18px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Play size={14} /> Regarder le Teaser
            </button>
          </div>
        </div>

        {/* Featured Match Card */}
        {featuredMatch && (
          <div 
            className="card" 
            onClick={() => onSelectMatch(featuredMatch)}
            style={{
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span className="badge badge-completed">
                  <Activity size={11} style={{ marginRight: '4px' }} />
                  Dernier Résultat
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Score Cumulé
                </span>
              </div>

              {/* Teams Score */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '24px 0' }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: 'var(--bg-elevated)',
                    border: '2px solid var(--border-active)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 10px'
                  }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem' }}>
                      {featuredMatch.team1Name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {featuredMatch.team1Name}
                  </div>
                </div>

                <div style={{ textAlign: 'center', padding: '0 16px' }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.6rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <span>{featuredMatch.team1TotalGoals}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '1.4rem' }}>:</span>
                    <span>{featuredMatch.team2TotalGoals}</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Score Cumulé
                  </div>
                </div>

                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: 'var(--bg-elevated)',
                    border: '2px solid var(--border-active)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 10px'
                  }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem' }}>
                      {featuredMatch.team2Name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {featuredMatch.team2Name}
                  </div>
                </div>
              </div>

              {/* Sub-scores */}
              <div style={{
                background: 'var(--bg-surface)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px'
              }}>
                <div style={{ textAlign: 'center', borderRight: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-success)', textTransform: 'uppercase', display: 'block', fontWeight: 600, marginBottom: '4px' }}>
                    ⚽ Gazon (Physique)
                  </span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700 }}>
                    {featuredMatch.team1PhysicalGoals} - {featuredMatch.team2PhysicalGoals}
                  </span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary)', textTransform: 'uppercase', display: 'block', fontWeight: 600, marginBottom: '4px' }}>
                    🎮 Console (Virtuel)
                  </span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700 }}>
                    {featuredMatch.team1DigitalGoals} - {featuredMatch.team2DigitalGoals}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                Voir les détails <ArrowRight size={14} />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Teaser Video Modal */}
      {showVideoModal && (
        <div 
          onClick={() => setShowVideoModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(5, 8, 16, 0.9)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '960px',
              backgroundColor: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-active)',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 24px',
              borderBottom: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="badge badge-digital">TEASER OFFICIEL</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', fontSize: '1rem' }}>
                  PhyGital Football 2026
                </span>
              </div>
              <button 
                onClick={() => setShowVideoModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ position: 'relative', width: '100%', backgroundColor: '#000' }}>
              <video 
                src="/videos/teaser.mp4" 
                poster="/teaser-thumbnail.jpg"
                controls 
                autoPlay 
                style={{ width: '100%', maxHeight: '75vh', display: 'block' }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

