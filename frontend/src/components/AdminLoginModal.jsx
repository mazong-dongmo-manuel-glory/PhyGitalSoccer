import { useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Brand } from './Navbar';
import { loginAdmin } from '../services/api';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('Saisissez le mot de passe administrateur.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await loginAdmin(password);
      setPassword('');
      onLoginSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen" role="dialog" aria-modal="true">
      <form className="login-card" onSubmit={handleSubmit}>
        <Brand onClick={onClose} subtitle="Espace organisateur" />
        <div>
          <h1 className="display" style={{ fontSize: 40 }}>Connexion</h1>
          <p className="muted" style={{ fontSize: 15, marginTop: 8 }}>
            Accès réservé aux organisateurs et arbitres du tournoi.
          </p>
        </div>
        <label className="field field--strong">
          <span>Mot de passe administrateur</span>
          <div style={{ position: 'relative' }}>
            <input
              className="input input--lg"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="••••••••••"
              style={{ paddingRight: 48 }}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(s => !s)}
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', display: 'grid' }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
          {loading ? 'Vérification…' : <>Se connecter <ArrowRight size={18} /></>}
        </button>
        <div className="security-note">
          <ShieldCheck size={18} style={{ flexShrink: 0 }} />
          <span>Session sécurisée de 12 h. Toutes les modifications sont publiées immédiatement sur le site public.</span>
        </div>
      </form>
      <button type="button" className="link-arrow" onClick={onClose}>
        <ArrowLeft size={16} /> Retour au site public
      </button>
    </div>
  );
}
