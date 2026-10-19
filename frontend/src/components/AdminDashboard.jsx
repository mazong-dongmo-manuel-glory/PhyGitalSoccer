import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  ClipboardList,
  ExternalLink,
  Image as ImageIcon,
  LogOut,
  Pencil,
  Plus,
  Shield,
  Trash2,
  User,
  Users
} from 'lucide-react';
import AdminMatchSheet from './AdminMatchSheet';
import AdminTopbar from './AdminTopbar';
import Crest from './Crest';
import MediaUpload from './MediaUpload';
import { Brand } from './Navbar';
import { positionKey, positionLabel } from '../utils/format';
import {
  createTeam,
  updateTeam,
  deleteTeam,
  addPlayer,
  updatePlayer,
  deletePlayer,
  addGalleryItem,
  deleteGalleryItem,
  fetchGallery,
  AuthError
} from '../services/api';

const NAV = [
  { id: 'match-sheets', label: 'Arbitrage & scores', icon: ClipboardList },
  { id: 'teams-manage', label: 'Gestion équipes', icon: Shield },
  { id: 'players-manage', label: 'Joueurs & photos', icon: Users },
  { id: 'gallery-manage', label: 'Galerie médias', icon: ImageIcon }
];

const EMPTY_TEAM = { name: '', group: 'A', colorHex: '#e8155c', logoUrl: '' };
const EMPTY_PLAYER = { name: '', position: 'Forward', jerseyNumber: 10, photoUrl: '' };
const EMPTY_MEDIA = { title: '', url: '', type: 'image', category: 'Match' };
const POSITIONS = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
const MEDIA_CATEGORIES = [['Match', 'Match'], ['Esports', 'Console'], ['Teaser', 'Teaser'], ['Ceremony', 'Cérémonie']];
const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif';

function TeamForm({ value, onChange, onSubmit, onCancel, submitLabel, onUploadError }) {
  const set = (k) => (e) => onChange({ ...value, [k]: e.target.value });
  return (
    <form onSubmit={onSubmit} style={{ display: 'contents' }}>
      <label className="field">
        <span>Nom de l’équipe</span>
        <input className="input" value={value.name} onChange={set('name')} placeholder="Ex. Quantum Wolves" required />
      </label>
      <div className="form-row">
        <label className="field">
          <span>Groupe</span>
          <select className="select" value={value.group} onChange={set('group')}>
            <option value="A">Groupe A</option>
            <option value="B">Groupe B</option>
          </select>
        </label>
        <label className="field">
          <span>Couleur</span>
          <input className="input input--color" type="color" value={value.colorHex || '#e8155c'} onChange={set('colorHex')} />
        </label>
      </div>
      <div className="field">
        <span>Logo (optionnel)</span>
        <MediaUpload
          accept={IMAGE_ACCEPT}
          hint="JPG, PNG, WEBP — 15 Mo max"
          previewUrl={value.logoUrl}
          onUploaded={({ url }) => onChange(prev => prev && { ...prev, logoUrl: url })}
          onError={onUploadError}
        />
        <input className="input" value={value.logoUrl || ''} onChange={set('logoUrl')} placeholder="…ou URL externe https://…" />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" className="btn btn--primary btn--block">{submitLabel}</button>
        {onCancel && <button type="button" className="btn btn--secondary" onClick={onCancel}>Annuler</button>}
      </div>
    </form>
  );
}

function PlayerForm({ value, onChange, onSubmit, onCancel, submitLabel, onUploadError }) {
  const set = (k, num) => (e) => onChange({ ...value, [k]: num ? parseInt(e.target.value, 10) || 0 : e.target.value });
  return (
    <form onSubmit={onSubmit} style={{ display: 'contents' }}>
      <label className="field">
        <span>Nom complet</span>
        <input className="input" value={value.name} onChange={set('name')} placeholder="Prénom Nom" required />
      </label>
      <div className="form-row">
        <label className="field">
          <span>Poste</span>
          <select className="select" value={positionKey(value.position)} onChange={set('position')}>
            {POSITIONS.map(p => <option key={p} value={p}>{positionLabel(p)}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Numéro</span>
          <input className="input" type="number" min="1" max="99" value={value.jerseyNumber} onChange={set('jerseyNumber', true)} />
        </label>
      </div>
      <div className="field">
        <span>Photo</span>
        <MediaUpload
          accept={IMAGE_ACCEPT}
          hint="JPG, PNG, WEBP — 15 Mo max"
          previewUrl={value.photoUrl}
          onUploaded={({ url }) => onChange(prev => prev && { ...prev, photoUrl: url })}
          onError={onUploadError}
        />
        <input className="input" value={value.photoUrl || ''} onChange={set('photoUrl')} placeholder="…ou URL externe https://…/photo.jpg" />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" className="btn btn--primary btn--block">{submitLabel}</button>
        {onCancel && <button type="button" className="btn btn--secondary" onClick={onCancel}>Annuler</button>}
      </div>
    </form>
  );
}

export default function AdminDashboard({ matches, teams, onDataChanged, onLogout, onSessionExpired, onExit }) {
  const [adminTab, setAdminTab] = useState('match-sheets');
  const [selectedTeamId, setSelectedTeamId] = useState(teams[0]?.id || '');

  const [newTeam, setNewTeam] = useState(EMPTY_TEAM);
  const [editingTeam, setEditingTeam] = useState(null);

  const [newPlayer, setNewPlayer] = useState(EMPTY_PLAYER);
  const [editingPlayer, setEditingPlayer] = useState(null);

  const [galleryItems, setGalleryItems] = useState([]);
  const [newGalleryItem, setNewGalleryItem] = useState(EMPTY_MEDIA);

  const [toast, setToast] = useState(null);

  const showToast = (text, tone = 'success') => {
    setToast({ text, tone });
    setTimeout(() => setToast(null), 3500);
  };

  const run = async (action, successMsg, after) => {
    try {
      await action();
      showToast(successMsg);
      after?.();
      return true;
    } catch (err) {
      if (err instanceof AuthError) onSessionExpired?.();
      else showToast(err.message || 'Une erreur est survenue.', 'error');
      return false;
    }
  };

  const loadAdminGallery = async () => {
    const data = await fetchGallery();
    setGalleryItems(data || []);
  };

  useEffect(() => {
    loadAdminGallery();
  }, []);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeam.name) return;
    if (await run(() => createTeam(newTeam), 'Nouvelle équipe créée avec succès !', onDataChanged)) {
      setNewTeam(EMPTY_TEAM);
    }
  };

  const handleUpdateTeam = async (e) => {
    e.preventDefault();
    if (!editingTeam) return;
    if (await run(() => updateTeam(editingTeam.id, editingTeam), 'Équipe mise à jour avec succès !', onDataChanged)) {
      setEditingTeam(null);
    }
  };

  const handleDeleteTeam = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette équipe ?')) {
      await run(() => deleteTeam(id), 'Équipe supprimée.', onDataChanged);
    }
  };

  const activeTeam = teams.find(t => t.id === selectedTeamId) || teams[0];

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    const teamId = activeTeam?.id;
    if (!newPlayer.name || !teamId) return;
    if (await run(() => addPlayer(teamId, newPlayer), 'Joueur enregistré avec succès !', onDataChanged)) {
      setNewPlayer(EMPTY_PLAYER);
    }
  };

  const handleUpdatePlayer = async (e) => {
    e.preventDefault();
    if (!editingPlayer) return;
    if (await run(() => updatePlayer(editingPlayer.id, editingPlayer), 'Fiche joueur et photo mises à jour !', onDataChanged)) {
      setEditingPlayer(null);
    }
  };

  const handleDeletePlayer = async (playerId) => {
    if (window.confirm('Supprimer ce joueur de l\'équipe ?')) {
      await run(() => deletePlayer(playerId), 'Joueur supprimé.', onDataChanged);
    }
  };

  const handleAddGalleryItem = async (e) => {
    e.preventDefault();
    if (!newGalleryItem.title || !newGalleryItem.url) return;
    if (await run(() => addGalleryItem(newGalleryItem), 'Nouveau média ajouté à la galerie !', loadAdminGallery)) {
      setNewGalleryItem(EMPTY_MEDIA);
    }
  };

  const handleDeleteGalleryItem = async (id) => {
    if (window.confirm('Supprimer ce média de la galerie ?')) {
      await run(() => deleteGalleryItem(id), 'Média supprimé de la galerie.', loadAdminGallery);
    }
  };

  const setMedia = (k) => (e) => setNewGalleryItem({ ...newGalleryItem, [k]: e.target.value });

  const handleUploadError = (err) => {
    if (err instanceof AuthError) onSessionExpired?.();
    else showToast(err.message || 'Échec de l’envoi du fichier.', 'error');
  };

  return (
    <div className="admin">
      <aside className="sidebar">
        <div>
          <Brand onClick={onExit} subtitle="Espace organisateur" />
          <div className="sidebar__label">GESTION DU TOURNOI</div>
          <nav className="sidebar__nav">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                className={`sidebar__item ${adminTab === id ? 'is-active' : ''}`}
                onClick={() => setAdminTab(id)}
              >
                <Icon size={18} /> {label}
              </button>
            ))}
          </nav>
        </div>
        <div>
          <button type="button" className="sidebar__item" onClick={onExit}>
            <ExternalLink size={18} /> Voir le site public
          </button>
          <div className="user-card">
            <span className="user-card__avatar">OR</span>
            <div className="user-card__who">
              <strong>Organisateur</strong>
              <span>Arbitre principal</span>
            </div>
            <button type="button" onClick={onLogout} aria-label="Se déconnecter" title="Se déconnecter">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      <main>
        {adminTab === 'match-sheets' && (
          <AdminMatchSheet matches={matches} teams={teams} onMatchUpdated={() => onDataChanged()} onSessionExpired={onSessionExpired} />
        )}

        {adminTab === 'teams-manage' && (
          <>
            <AdminTopbar crumb="Gestion équipes" title="Équipes" hint={`${teams.length} équipes inscrites`} />
            <div className="admin__content">
              <div className="admin-grid">
                <div className="card">
                  <div className="card__head">
                    <h3 className="card__title">Équipes inscrites</h3>
                    <span className="card__meta">Groupe A · Groupe B</span>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="stat-table admin-table">
                      <thead>
                        <tr><th>Équipe</th><th>Groupe</th><th>Joueurs</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
                      </thead>
                      <tbody>
                        {teams.length === 0 && <tr><td colSpan={4} className="muted">Aucune équipe.</td></tr>}
                        {teams.map(t => (
                          <tr key={t.id}>
                            <td><div className="team-cell"><Crest name={t.name} color={t.colorHex} size={32} />{t.name}</div></td>
                            <td><span className="tag">Groupe {t.group}</span></td>
                            <td>{(t.players || []).length}</td>
                            <td>
                              <div className="row-actions">
                                <button type="button" className="icon-action" onClick={() => setEditingTeam({ ...t })} aria-label="Modifier"><Pencil size={14} /></button>
                                <button type="button" className="icon-action icon-action--danger" onClick={() => handleDeleteTeam(t.id)} aria-label="Supprimer"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="card form-card">
                  <h3 className="card__title">{editingTeam ? `Modifier · ${editingTeam.name}` : 'Nouvelle équipe'}</h3>
                  {editingTeam ? (
                    <TeamForm
                      value={editingTeam}
                      onChange={setEditingTeam}
                      onSubmit={handleUpdateTeam}
                      onCancel={() => setEditingTeam(null)}
                      submitLabel="Enregistrer"
                      onUploadError={handleUploadError}
                    />
                  ) : (
                    <TeamForm value={newTeam} onChange={setNewTeam} onSubmit={handleCreateTeam} submitLabel="Créer l’équipe" onUploadError={handleUploadError} />
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {adminTab === 'players-manage' && (
          <>
            <AdminTopbar crumb="Joueurs & photos" title="Joueurs" hint={activeTeam ? `${(activeTeam.players || []).length} joueurs · ${activeTeam.name}` : undefined} />
            <div className="admin__content">
              <div className="pills">
                {teams.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    className={`pill ${activeTeam?.id === t.id ? 'is-active' : ''}`}
                    onClick={() => { setSelectedTeamId(t.id); setEditingPlayer(null); }}
                  >
                    <span className="dot" style={{ background: t.colorHex }} />{t.name}
                  </button>
                ))}
              </div>

              {!activeTeam ? (
                <div className="card empty">Créez d’abord une équipe.</div>
              ) : (
                <div className="admin-grid">
                  <div className="card">
                    <div className="card__head">
                      <div className="team-cell">
                        <Crest name={activeTeam.name} color={activeTeam.colorHex} size={36} />
                        <h3 className="card__title">{activeTeam.name}</h3>
                      </div>
                      <span className="card__meta">Groupe {activeTeam.group}</span>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                      <table className="stat-table admin-table">
                        <thead>
                          <tr><th>Joueur</th><th>N°</th><th>Poste</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
                        </thead>
                        <tbody>
                          {(activeTeam.players || []).length === 0 && <tr><td colSpan={4} className="muted">Aucun joueur inscrit.</td></tr>}
                          {(activeTeam.players || []).map(p => (
                            <tr key={p.id}>
                              <td>
                                <div className="team-cell">
                                  {p.photoUrl ? <img src={p.photoUrl} alt="" className="avatar" /> : <span className="avatar"><User size={16} /></span>}
                                  {p.name}
                                </div>
                              </td>
                              <td><strong>{p.jerseyNumber}</strong></td>
                              <td>{positionLabel(p.position)}</td>
                              <td>
                                <div className="row-actions">
                                  <button type="button" className="icon-action" onClick={() => setEditingPlayer({ ...p, position: positionKey(p.position) })} aria-label="Modifier"><Pencil size={14} /></button>
                                  <button type="button" className="icon-action icon-action--danger" onClick={() => handleDeletePlayer(p.id)} aria-label="Supprimer"><Trash2 size={14} /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="card form-card">
                    <h3 className="card__title">{editingPlayer ? `Modifier · ${editingPlayer.name}` : 'Ajouter un joueur'}</h3>
                    {editingPlayer ? (
                      <PlayerForm
                        value={editingPlayer}
                        onChange={setEditingPlayer}
                        onSubmit={handleUpdatePlayer}
                        onCancel={() => setEditingPlayer(null)}
                        submitLabel="Enregistrer"
                        onUploadError={handleUploadError}
                      />
                    ) : (
                      <PlayerForm value={newPlayer} onChange={setNewPlayer} onSubmit={handleAddPlayer} submitLabel={`Ajouter à ${activeTeam.name}`} onUploadError={handleUploadError} />
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {adminTab === 'gallery-manage' && (
          <>
            <AdminTopbar crumb="Galerie médias" title="Galerie" hint={`${galleryItems.length} médias publiés`} />
            <div className="admin__content">
              <div className="admin-grid">
                <div>
                  {galleryItems.length === 0 ? (
                    <div className="card empty">Aucun média publié.</div>
                  ) : (
                    <div className="admin-media">
                      {galleryItems.map(item => (
                        <div key={item.id} className="admin-media__item">
                          {item.type === 'video'
                            ? <video src={item.url} muted preload="metadata" />
                            : <img src={item.url} alt={item.title} onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} />}
                          <span className="media-tile__overlay" style={{ color: '#fff' }}>
                            <span className="media-tile__tag">{item.category || item.type}</span>
                            <span className="media-tile__title" style={{ fontSize: 14 }}>{item.title}</span>
                          </span>
                          <button type="button" className="icon-action icon-action--danger" onClick={() => handleDeleteGalleryItem(item.id)} aria-label="Supprimer">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <form className="card form-card" onSubmit={handleAddGalleryItem}>
                  <h3 className="card__title">Ajouter un média</h3>
                  <label className="field">
                    <span>Titre</span>
                    <input className="input" value={newGalleryItem.title} onChange={setMedia('title')} placeholder="Ex. Finale — séance de tirs au but" required />
                  </label>
                  <div className="field">
                    <span>Fichier</span>
                    <MediaUpload
                      accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                      hint="Photo JPG, PNG, WEBP (15 Mo) ou vidéo MP4, WEBM (200 Mo)"
                      previewUrl={newGalleryItem.url}
                      previewType={newGalleryItem.type}
                      onUploaded={({ url, type, name }) => setNewGalleryItem(prev => ({ ...prev, url, type, title: prev.title || name }))}
                      onError={handleUploadError}
                    />
                  </div>
                  <label className="field">
                    <span>…ou URL externe</span>
                    <input className="input" value={newGalleryItem.url} onChange={setMedia('url')} placeholder="https://…" required />
                  </label>
                  <div className="form-row">
                    <label className="field">
                      <span>Type</span>
                      <select className="select" value={newGalleryItem.type} onChange={setMedia('type')}>
                        <option value="image">Photo</option>
                        <option value="video">Vidéo</option>
                      </select>
                    </label>
                    <label className="field">
                      <span>Catégorie</span>
                      <select className="select" value={newGalleryItem.category} onChange={setMedia('category')}>
                        {MEDIA_CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </label>
                  </div>
                  <button type="submit" className="btn btn--primary btn--block"><Plus size={18} /> Publier dans la galerie</button>
                </form>
              </div>
            </div>
          </>
        )}
      </main>

      {toast && (
        <div className={`toast ${toast.tone === 'error' ? 'toast--error' : ''}`} role="status">
          {toast.tone === 'error' ? <AlertTriangle size={18} /> : <CheckCircle size={18} />} {toast.text}
        </div>
      )}
    </div>
  );
}
