import { useEffect, useState } from 'react';
import { Play, X } from 'lucide-react';
import PageHeader from './PageHeader';
import { fetchGallery } from '../services/api';

const CATEGORIES = [
  { id: 'All', label: 'Tout' },
  { id: 'Match', label: 'Matchs' },
  { id: 'Esports', label: 'Console' },
  { id: 'Teaser', label: 'Vidéos' },
  { id: 'Ceremony', label: 'Cérémonie' }
];

const RATIOS = ['4 / 3', '3 / 4', '1 / 1', '4 / 3', '16 / 10', '3 / 4'];
const TILE_COLORS = ['#0b1b2b', '#3a0a22', '#0e3b2a', '#1d2a63', '#2b1a0b', '#1b0b2b'];

const matchesCategory = (item, cat) =>
  cat === 'All' || item.category?.toLowerCase() === cat.toLowerCase() || (cat === 'Teaser' && item.type === 'video');

const formatDate = (d) => new Date(d || Date.now()).toLocaleDateString('fr-CA', { day: 'numeric', month: 'long', year: 'numeric' });

function Media({ item, controls = false }) {
  if (item.type === 'video') {
    return <video src={item.url} poster="/teaser-thumbnail.jpg" controls={controls} autoPlay={controls} muted={!controls} playsInline preload="metadata" />;
  }
  return <img src={item.url} alt={item.title} loading="lazy" onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} />;
}

export default function GallerySection() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery()
      .then(data => setItems(data || []))
      .catch(err => console.error('Error fetching gallery:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selected) return undefined;
    const onKey = (e) => e.key === 'Escape' && setSelected(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  const filtered = items.filter(i => matchesCategory(i, category));
  const featured = filtered.find(i => i.type === 'video') || null;
  const tiles = filtered.filter(i => i !== featured);

  return (
    <>
      <PageHeader
        kicker="Médias officiels"
        title="Galerie"
        subtitle="Les plus beaux moments du tournoi, sur le terrain comme à la manette."
      >
        <div className="pills">
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              type="button"
              className={`pill ${category === c.id ? 'is-active' : ''}`}
              onClick={() => setCategory(c.id)}
            >
              {c.label} <small>{items.filter(i => matchesCategory(i, c.id)).length}</small>
            </button>
          ))}
        </div>
      </PageHeader>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="empty">Chargement de la galerie…</div>
          ) : filtered.length === 0 ? (
            <div className="card empty">Aucun média dans cette catégorie pour le moment.</div>
          ) : (
            <>
              {featured && (
                <button type="button" className="gallery-feature" onClick={() => setSelected(featured)}>
                  <Media item={featured} />
                  <div className="gallery-feature__top">
                    <span className="media-tile__tag">{featured.category || 'Vidéo'}</span>
                    <span style={{ fontSize: 13, opacity: 0.8 }}>{formatDate(featured.dateAdded)}</span>
                  </div>
                  <span className="play-btn"><Play size={36} fill="#fff" color="#fff" style={{ marginLeft: 4 }} /></span>
                  <div>
                    <h2 className="display gallery-feature__title">{featured.title}</h2>
                    <p className="gallery-feature__lead">Regarder la vidéo</p>
                  </div>
                </button>
              )}

              <div className="masonry">
                {tiles.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    className="media-tile"
                    style={{ '--ratio': RATIOS[i % RATIOS.length], '--tile': TILE_COLORS[i % TILE_COLORS.length] }}
                    onClick={() => setSelected(item)}
                  >
                    <Media item={item} />
                    <span className="media-tile__overlay">
                      <span className="media-tile__tag">{item.category || item.type}</span>
                      <span className="media-tile__title">{item.title}</span>
                      <span className="media-tile__date">{formatDate(item.dateAdded)}</span>
                    </span>
                    {item.type === 'video' && (
                      <span className="play-btn" style={{ position: 'absolute', top: '50%', left: '50%', width: 56, height: 56, transform: 'translate(-50%, -50%)' }}>
                        <Play size={22} fill="#fff" color="#fff" style={{ marginLeft: 3 }} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {selected && (
        <div className="lightbox" onClick={() => setSelected(null)}>
          <div className="lightbox__inner" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="icon-btn" style={{ position: 'absolute', top: -48, right: 0 }} onClick={() => setSelected(null)} aria-label="Fermer">
              <X size={18} />
            </button>
            <Media item={selected} controls />
            <p className="lightbox__caption">{selected.title}</p>
          </div>
        </div>
      )}
    </>
  );
}
