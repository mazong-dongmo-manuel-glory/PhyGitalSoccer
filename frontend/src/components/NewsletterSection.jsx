import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
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
      setStatus({ state: 'success', message: res?.message || 'Merci ! Vous êtes inscrit à la newsletter PhyGital Soccer.' });
      setEmail('');
    } catch {
      setStatus({ state: 'error', message: 'Inscription impossible pour le moment. Réessayez dans quelques instants.' });
    }
  };

  const noteClass = status.state === 'error' ? 'is-error' : status.state === 'success' ? 'is-success' : '';

  return (
    <section className="newsletter" id="newsletter">
      <div className="container newsletter__grid">
        <div>
          <span className="kicker">Newsletter</span>
          <h2 className="section-title" style={{ marginTop: 10 }}>Ne manquez aucun but</h2>
          <p className="newsletter__lead">
            Alertes de match, résumés des deux manches et coulisses du tournoi, directement dans votre boîte courriel.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="newsletter__field">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@courriel.com"
              aria-label="Adresse courriel"
            />
            <button type="submit" className="btn btn--primary" disabled={status.state === 'loading'}>
              {status.state === 'loading' ? 'Envoi…' : <>S’abonner <ArrowRight size={16} /></>}
            </button>
          </div>
          <p className={`newsletter__note ${noteClass}`}>
            {status.message || 'Un courriel par journée de match. Désinscription en un clic.'}
          </p>
        </form>
      </div>
    </section>
  );
}
