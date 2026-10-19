import { useEffect, useState } from 'react';
import { Play, X } from 'lucide-react';

const VIDEO_URL = '/videos/teaser.mp4';
const POSTER_URL = '/teaser-thumbnail.jpg';

export default function TeaserSection() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <section className="section section--tight-top" id="teaser">
      <div className="container">
        <button type="button" className="gallery-feature" onClick={() => setOpen(true)}>
          <img src={POSTER_URL} alt="" />
          <div className="gallery-feature__top">
            <span className="media-tile__tag">Teaser officiel</span>
            <span style={{ fontSize: 13, opacity: 0.8 }}>PhyGital Soccer 2026</span>
          </div>
          <span className="play-btn"><Play size={36} fill="#fff" color="#fff" style={{ marginLeft: 4 }} /></span>
          <div>
            <h2 className="display gallery-feature__title">Le terrain rencontre la manette</h2>
            <p className="gallery-feature__lead">Regarder le teaser du tournoi</p>
          </div>
        </button>
      </div>

      {open && (
        <div className="lightbox" onClick={() => setOpen(false)}>
          <div className="lightbox__inner" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="icon-btn" style={{ position: 'absolute', top: -48, right: 0 }} onClick={() => setOpen(false)} aria-label="Fermer">
              <X size={18} />
            </button>
            <video src={VIDEO_URL} poster={POSTER_URL} controls autoPlay playsInline />
            <p className="lightbox__caption">Teaser officiel · PhyGital Soccer 2026</p>
          </div>
        </div>
      )}
    </section>
  );
}
