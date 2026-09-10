import React, { useState } from 'react';
import { Trophy, Shield, Calendar, Users, Lock, Unlock, Image, BarChart2, ShieldAlert } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  isAdminLoggedIn, 
  onOpenAdminLogin, 
  onAdminLogout 
}) {
  const publicNavItems = [
    { id: 'home', label: 'Accueil', icon: Trophy },
    { id: 'bracket', label: 'Arbre & Poules', icon: Calendar },
    { id: 'standings', label: 'Classements', icon: Shield },
    { id: 'teams', label: 'Équipes & Joueurs', icon: Users },
    { id: 'gallery', label: 'Galerie', icon: Image },
    { id: 'stats', label: 'Statistiques', icon: BarChart2 }
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(8, 13, 26, 0.94)',
      backdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--border-color)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <img 
            src="/logo-phygytal.png" 
            alt="PhyGital Soccer Logo" 
            style={{ height: '42px' }} 
          />
          <div>
            <div style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '1.35rem', 
              fontWeight: 800, 
              letterSpacing: '0.04em',
              color: 'var(--text-primary)',
              textTransform: 'uppercase',
              lineHeight: 1.1
            }}>
              PHYGITAL <span style={{ color: 'var(--color-primary)' }}>SOCCER</span>
            </div>
            <div style={{ 
              fontSize: '0.65rem', 
              color: 'var(--text-muted)', 
              letterSpacing: '0.12em', 
              textTransform: 'uppercase',
              fontWeight: 600
            }}>
              Terrain Réel × E-Sport Console
            </div>
          </div>
        </div>

        {/* Navigation pills — GoFuture style */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {publicNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  background: isActive ? 'var(--color-primary)' : 'transparent',
                  border: isActive ? 'none' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = 'var(--border-active)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                {item.label}
              </button>
            );
          })}

          {isAdminLoggedIn && (
            <button
              onClick={() => setActiveTab('admin')}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: activeTab === 'admin' ? '#ffffff' : 'var(--color-primary)',
                background: activeTab === 'admin' ? 'var(--color-primary)' : 'rgba(232, 21, 92, 0.12)',
                border: '1px solid var(--color-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <ShieldAlert size={14} /> Dashboard Admin
            </button>
          )}
        </nav>

        {/* Admin Access Portal CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isAdminLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-completed" style={{ fontSize: '0.72rem', padding: '4px 10px' }}>
                <Unlock size={12} style={{ marginRight: '4px' }} /> Mode Admin Active
              </span>
              <button 
                onClick={onAdminLogout}
                className="btn-outline"
                style={{ fontSize: '0.75rem', padding: '6px 12px' }}
              >
                Quitter Admin
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenAdminLogin}
              className="btn-outline"
              style={{ 
                fontSize: '0.78rem', 
                padding: '7px 14px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                borderColor: 'var(--border-subtle)'
              }}
            >
              <Lock size={13} /> Espace Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
