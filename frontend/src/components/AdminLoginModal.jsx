import React, { useState } from 'react';
import { Lock, Key, ShieldCheck, X } from 'lucide-react';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Default PIN: 1234 or admin
    if (pin === '1234' || pin.toLowerCase() === 'admin') {
      setError('');
      setPin('');
      onLoginSuccess();
    } else {
      setError('Code PIN incorrect. Utilisez 1234 pour le mode démo.');
    }
  };

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(5, 8, 16, 0.88)',
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
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--bg-elevated)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-active)',
          padding: '32px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
          position: 'relative'
        }}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'rgba(232, 21, 92, 0.15)',
            border: '2px solid var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: 'var(--color-primary)'
          }}>
            <Lock size={26} />
          </div>

          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.4rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            marginBottom: '8px',
            color: 'var(--text-primary)'
          }}>
            Connexion Administrateur
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>
            Entrez votre code PIN pour accéder au Dashboard de gestion du tournoi.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.78rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-secondary)',
              marginBottom: '8px'
            }}>
              Code PIN Administrateur
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                maxLength={8}
                placeholder="Ex: 1234"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 42px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: '1.1rem',
                  letterSpacing: '0.2em',
                  fontFamily: 'monospace'
                }}
              />
              <Key size={18} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
            </div>
            {error && (
              <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '8px', fontWeight: 500 }}>
                {error}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', padding: '12px', justifyContent: 'center', marginBottom: '14px' }}
          >
            <ShieldCheck size={18} /> Déverrouiller le Dashboard
          </button>

          <button 
            type="button" 
            onClick={() => {
              setPin('1234');
              onLoginSuccess();
            }}
            className="btn-outline" 
            style={{ width: '100%', padding: '10px', justifyContent: 'center', fontSize: '0.8rem' }}
          >
            Mode Démo Rapide (PIN: 1234)
          </button>
        </form>
      </div>
    </div>
  );
}
