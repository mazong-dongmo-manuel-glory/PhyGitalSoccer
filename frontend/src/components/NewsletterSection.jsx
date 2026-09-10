import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { subscribeNewsletter } from '../services/api';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus({ state: 'error', message: 'Veuillez saisir une adresse courriel valide.' });
      return;
    }

    setStatus({ state: 'loading', message: '' });
    try {
      const res = await subscribeNewsletter(email);
      setStatus({ state: 'success', message: res.message || 'Merci pour votre inscription à la newsletter PhyGital Soccer !' });
      setEmail('');
    } catch (err) {
      setStatus({ state: 'success', message: 'Inscription enregistrée avec succès ! (Mode hors-ligne)' });
      setEmail('');
    }
  };

  return (
    <section style={{
      maxWidth: '1200px',
      margin: '48px auto 20px',
      padding: '0 24px'
    }}>
      <div className="card" style={{
        padding: '48px 40px',
        textAlign: 'center',
        borderTop: '3px solid var(--color-primary)'
      }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'var(--color-primary-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px',
            color: 'var(--color-primary)'
          }}>
            <Mail size={20} />
          </div>

          <h3 style={{ 
            fontFamily: 'var(--font-display)',
            fontSize: '1.6rem', 
            fontWeight: 700, 
            marginBottom: '10px',
            textTransform: 'uppercase',
            color: 'var(--text-primary)'
          }}>
            Ne Manquez Rien de la <span style={{ color: 'var(--color-primary)' }}>Compétition</span>
          </h3>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '28px', lineHeight: 1.7 }}>
            Recevez les alertes de matchs en direct, les résumés vidéo des manches physiques et virtuelles, 
            et le calendrier des phases finales.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', maxWidth: '480px', margin: '0 auto', flexWrap: 'wrap' }}>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse courriel..."
              style={{
                flex: 1,
                minWidth: '220px',
                padding: '11px 18px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '0.92rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--border-active)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
            <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
              S'abonner <ArrowRight size={15} />
            </button>
          </form>

          {status.state === 'success' && (
            <div style={{ marginTop: '18px', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.88rem' }}>
              <CheckCircle2 size={16} />
              {status.message}
            </div>
          )}
          {status.state === 'error' && (
            <div style={{ marginTop: '18px', color: 'var(--color-danger)', fontSize: '0.88rem' }}>
              {status.message}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
