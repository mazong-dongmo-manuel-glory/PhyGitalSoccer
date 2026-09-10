import React, { useState, useEffect } from 'react';
import { Image, Film, Play, Sparkles, Filter, X } from 'lucide-react';
import { fetchGallery } from '../services/api';

export default function GallerySection() {
  const [items, setItems] = useState([]);
  const [filterCategory, setFilterCategory] = useState('All');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const data = await fetchGallery();
      setItems(data || []);
    } catch (err) {
      console.error('Error fetching gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Match', 'Esports', 'Teaser', 'Ceremony'];

  const filteredItems = filterCategory === 'All' 
    ? items 
    : items.filter(i => i.category?.toLowerCase() === filterCategory.toLowerCase() || (filterCategory === 'Teaser' && i.type === 'video'));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div className="section-label">
          <Sparkles size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
          Médias & Moments Forts
        </div>
        <h1 className="section-title">
          Galerie <em>Officielle</em>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px' }}>
          Explorez les photos et vidéos exclusives de la compétition PhyGital Soccer 2026 : de l'intensité du gazon aux duels passionnés sur console.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: 600,
              fontFamily: 'var(--font-display)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              backgroundColor: filterCategory === cat ? 'var(--color-primary)' : 'var(--bg-surface)',
              color: filterCategory === cat ? '#ffffff' : 'var(--text-secondary)',
              border: filterCategory === cat ? 'none' : '1px solid var(--border-subtle)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {cat === 'All' ? 'Tous les Médias' : cat}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Chargement de la galerie...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Aucun média trouvé dans cette catégorie.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="card"
              onClick={() => setSelectedMedia(item)}
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 'var(--radius-md)',
                height: '240px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '20px',
                backgroundImage: item.type === 'video' ? `linear-gradient(to top, rgba(5,8,16,0.9), rgba(5,8,16,0.3)), url(/teaser-thumbnail.jpg)` : `linear-gradient(to top, rgba(5,8,16,0.9), rgba(5,8,16,0.2)), url(${item.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Type Badge */}
              <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                <span className={item.type === 'video' ? 'badge badge-digital' : 'badge badge-physical'}>
                  {item.type === 'video' ? <Film size={11} style={{ marginRight: '4px' }} /> : <Image size={11} style={{ marginRight: '4px' }} />}
                  {item.category || item.type.toUpperCase()}
                </span>
              </div>

              {/* Play Overlay Icon for Video */}
              {item.type === 'video' && (
                <div style={{
                  position: 'absolute',
                  top: '45%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 8px 20px rgba(232, 21, 92, 0.5)'
                }}>
                  <Play size={22} style={{ marginLeft: '3px' }} />
                </div>
              )}

              {/* Title info */}
              <div style={{ position: 'relative', zIndex: 2 }}>
                <h4 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '4px'
                }}>
                  {item.title}
                </h4>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Ajouté le {new Date(item.dateAdded || Date.now()).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / Video Modal */}
      {selectedMedia && (
        <div 
          onClick={() => setSelectedMedia(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(5, 8, 16, 0.92)',
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
              maxWidth: '960px',
              width: '100%',
              backgroundColor: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-active)',
              overflow: 'hidden'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 24px',
              borderBottom: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)'
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700 }}>
                {selectedMedia.title}
              </h3>
              <button 
                onClick={() => setSelectedMedia(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '0', backgroundColor: '#000', textAlign: 'center' }}>
              {selectedMedia.type === 'video' ? (
                <video 
                  src={selectedMedia.url} 
                  controls 
                  autoPlay 
                  style={{ width: '100%', maxHeight: '75vh', display: 'block' }} 
                />
              ) : (
                <img 
                  src={selectedMedia.url} 
                  alt={selectedMedia.title} 
                  style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain' }} 
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
