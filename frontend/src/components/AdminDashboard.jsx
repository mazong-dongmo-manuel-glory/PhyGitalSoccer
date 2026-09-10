import React, { useState } from 'react';
import { 
  ShieldAlert, 
  FileSpreadsheet, 
  Users, 
  UserPlus, 
  Image, 
  Plus, 
  Trash2, 
  Edit3, 
  Camera, 
  CheckCircle, 
  Lock, 
  Sparkles,
  Save,
  RefreshCw
} from 'lucide-react';
import AdminMatchSheet from './AdminMatchSheet';
import { 
  createTeam, 
  updateTeam, 
  deleteTeam, 
  addPlayer, 
  updatePlayer, 
  deletePlayer,
  addGalleryItem,
  deleteGalleryItem,
  fetchGallery 
} from '../services/api';

export default function AdminDashboard({ 
  matches, 
  teams, 
  onDataChanged, 
  onLogout 
}) {
  const [adminTab, setAdminTab] = useState('match-sheets');
  const [selectedTeamId, setSelectedTeamId] = useState(teams[0]?.id || '');
  
  // Team Form State
  const [newTeam, setNewTeam] = useState({ name: '', group: 'A', colorHex: '#e8155c', logoUrl: '' });
  const [editingTeam, setEditingTeam] = useState(null);

  // Player Form State
  const [newPlayer, setNewPlayer] = useState({ name: '', position: 'Forward', jerseyNumber: 10, photoUrl: '' });
  const [editingPlayer, setEditingPlayer] = useState(null);

  // Gallery Form State
  const [galleryItems, setGalleryItems] = useState([]);
  const [newGalleryItem, setNewGalleryItem] = useState({ title: '', url: '', type: 'image', category: 'Match' });

  // Status Toast
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  React.useEffect(() => {
    loadAdminGallery();
  }, []);

  const loadAdminGallery = async () => {
    const data = await fetchGallery();
    setGalleryItems(data || []);
  };

  // Team Actions
  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeam.name) return;
    await createTeam(newTeam);
    setNewTeam({ name: '', group: 'A', colorHex: '#e8155c', logoUrl: '' });
    showToast('Nouvelle équipe créée avec succès !');
    onDataChanged();
  };

  const handleUpdateTeam = async (e) => {
    e.preventDefault();
    if (!editingTeam) return;
    await updateTeam(editingTeam.id, editingTeam);
    setEditingTeam(null);
    showToast('Équipe mise à jour avec succès !');
    onDataChanged();
  };

  const handleDeleteTeam = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette équipe ?')) {
      await deleteTeam(id);
      showToast('Équipe supprimée.');
      onDataChanged();
    }
  };

  // Player Actions
  const activeTeam = teams.find(t => t.id === selectedTeamId) || teams[0];

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    if (!newPlayer.name || !selectedTeamId) return;
    await addPlayer(selectedTeamId, newPlayer);
    setNewPlayer({ name: '', position: 'Forward', jerseyNumber: 10, photoUrl: '' });
    showToast('Joueur enregistré avec succès !');
    onDataChanged();
  };

  const handleUpdatePlayer = async (e) => {
    e.preventDefault();
    if (!editingPlayer) return;
    await updatePlayer(editingPlayer.id, editingPlayer);
    setEditingPlayer(null);
    showToast('Fiche joueur et photo mises à jour !');
    onDataChanged();
  };

  const handleDeletePlayer = async (playerId) => {
    if (window.confirm('Supprimer ce joueur de l\'équipe ?')) {
      await deletePlayer(playerId);
      showToast('Joueur supprimé.');
      onDataChanged();
    }
  };

  // Gallery Actions
  const handleAddGalleryItem = async (e) => {
    e.preventDefault();
    if (!newGalleryItem.title || !newGalleryItem.url) return;
    await addGalleryItem(newGalleryItem);
    setNewGalleryItem({ title: '', url: '', type: 'image', category: 'Match' });
    showToast('Nouveau média ajouté à la galerie !');
    loadAdminGallery();
  };

  const handleDeleteGalleryItem = async (id) => {
    if (window.confirm('Supprimer ce média de la galerie ?')) {
      await deleteGalleryItem(id);
      showToast('Média supprimé de la galerie.');
      loadAdminGallery();
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px 80px' }}>
      {/* Toast notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1000,
          backgroundColor: 'var(--color-primary)',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: 'var(--radius-sm)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle size={18} /> {toastMsg}
        </div>
      )}

      {/* Header Banner */}
      <div className="card" style={{
        padding: '24px 32px',
        marginBottom: '32px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderLeft: '4px solid var(--color-primary)',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'rgba(232, 21, 92, 0.15)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <div className="badge badge-completed" style={{ marginBottom: '4px' }}>PORTAIL ACCÈS RESTREINT</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, textTransform: 'uppercase' }}>
              Dashboard Administrateur
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Gestion complète du tournoi : Arbitrage, Équipes, Joueurs, Photos & Galerie Médias
            </p>
          </div>
        </div>

        <button onClick={onLogout} className="btn-outline" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Lock size={14} /> Verrouiller / Quitter Admin
        </button>
      </div>

      {/* Admin Tabs Navigation */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '32px',
        overflowX: 'auto',
        paddingBottom: '8px'
      }}>
        {[
          { id: 'match-sheets', label: 'Arbitrage & Scores', icon: FileSpreadsheet },
          { id: 'teams-manage', label: 'Gestion Équipes', icon: Users },
          { id: 'players-manage', label: 'Joueurs & Photos', icon: UserPlus },
          { id: 'gallery-manage', label: 'Galerie Médias', icon: Image }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id)}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                fontSize: '0.85rem',
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--bg-elevated)' : 'transparent',
                border: '1px solid',
                borderColor: isActive ? 'var(--border-active) var(--border-active) transparent' : 'transparent',
                borderBottom: isActive ? '2px solid var(--color-primary)' : 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: ARBITRAGE & FEUILLES DE MATCH */}
      {adminTab === 'match-sheets' && (
        <AdminMatchSheet 
          matches={matches} 
          onMatchUpdated={onDataChanged} 
        />
      )}

      {/* TAB 2: GESTION DES ÉQUIPES */}
      {adminTab === 'teams-manage' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {/* Create Team Form */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px' }}>
              Créer une Nouvelle Équipe
            </h3>
            <form onSubmit={handleCreateTeam}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Nom de l'équipe
                </label>
                <input
                  type="text"
                  placeholder="Ex: Cyber Lions FC"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Poule / Groupe
                  </label>
                  <select
                    value={newTeam.group}
                    onChange={(e) => setNewTeam({ ...newTeam, group: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <option value="A">Groupe A</option>
                    <option value="B">Groupe B</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Couleur (Hex)
                  </label>
                  <input
                    type="color"
                    value={newTeam.colorHex}
                    onChange={(e) => setNewTeam({ ...newTeam, colorHex: e.target.value })}
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '4px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  URL du Logo / Emblème
                </label>
                <input
                  type="text"
                  placeholder="Ex: /logos/mon-logo.png"
                  value={newTeam.logoUrl}
                  onChange={(e) => setNewTeam({ ...newTeam, logoUrl: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <Plus size={16} /> Enregistrer l'équipe
              </button>
            </form>
          </div>

          {/* Teams List */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px' }}>
              Liste des Équipes Enregistrées ({teams.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflowY: 'auto' }}>
              {teams.map(t => (
                <div 
                  key={t.id}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: t.colorHex || 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.8rem'
                    }}>
                      {t.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Groupe {t.group} • {t.players?.length || 0} Joueur(s)
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      onClick={() => setEditingTeam(t)}
                      style={{ padding: '6px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteTeam(t.id)}
                      style={{ padding: '6px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GESTION DES JOUEURS & PHOTOS */}
      {adminTab === 'players-manage' && (
        <div>
          {/* Team selector header */}
          <div className="card" style={{ padding: '20px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }}>Sélectionner l'équipe :</span>
            <select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              style={{
                padding: '10px 16px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-active)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontWeight: 700,
                fontSize: '0.95rem'
              }}
            >
              {teams.map(t => (
                <option key={t.id} value={t.id}>{t.name} (Groupe {t.group})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
            {/* Add Player Form */}
            <div className="card" style={{ padding: '28px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px' }}>
                Enregistrer un Joueur pour {activeTeam?.name}
              </h3>
              <form onSubmit={handleAddPlayer}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Nom complet du joueur
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Gabriel Tremblay"
                    value={newPlayer.name}
                    onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Poste / Rôle
                    </label>
                    <select
                      value={newPlayer.position}
                      onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <option value="Forward">Attaquant ⚽</option>
                      <option value="Midfielder">Milieu ⚽</option>
                      <option value="Defender">Défenseur ⚽</option>
                      <option value="Goalkeeper">Gardien ⚽</option>
                      <option value="GamerConsole">Joueur Console 🎮</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      N° Maillot
                    </label>
                    <input
                      type="number"
                      value={newPlayer.jerseyNumber}
                      onChange={(e) => setNewPlayer({ ...newPlayer, jerseyNumber: parseInt(e.target.value) || 1 })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Photo / Avatar du joueur (URL)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: https://images.unsplash.com/... ou /avatars/player1.jpg"
                    value={newPlayer.photoUrl}
                    onChange={(e) => setNewPlayer({ ...newPlayer, photoUrl: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  <UserPlus size={16} /> Ajouter le joueur
                </button>
              </form>
            </div>

            {/* Players List with Photo Edit */}
            <div className="card" style={{ padding: '28px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px' }}>
                Effectif : {activeTeam?.name} ({activeTeam?.players?.length || 0})
              </h3>

              {!activeTeam?.players || activeTeam.players.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Aucun joueur enregistré pour cette équipe.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '500px', overflowY: 'auto' }}>
                  {activeTeam.players.map(p => (
                    <div 
                      key={p.id}
                      style={{
                        padding: '14px 18px',
                        backgroundColor: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        {p.photoUrl ? (
                          <img 
                            src={p.photoUrl} 
                            alt={p.name} 
                            style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-active)' }}
                          />
                        ) : (
                          <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--bg-elevated)',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            color: 'var(--text-muted)'
                          }}>
                            #{p.jerseyNumber}
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                            {p.name} <span style={{ color: 'var(--color-primary)', fontSize: '0.8rem' }}>#{p.jerseyNumber}</span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {p.position}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button 
                          onClick={() => setEditingPlayer(p)}
                          className="btn-outline"
                          style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Camera size={13} /> Changer Photo
                        </button>
                        <button 
                          onClick={() => handleDeletePlayer(p.id)}
                          style={{ padding: '6px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Edit Player Photo Modal */}
          {editingPlayer && (
            <div 
              onClick={() => setEditingPlayer(null)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1000,
                backgroundColor: 'rgba(5, 8, 16, 0.85)',
                backdropFilter: 'blur(10px)',
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
                  maxWidth: '460px',
                  backgroundColor: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-active)',
                  padding: '28px'
                }}
              >
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px' }}>
                  Modifier la Photo de {editingPlayer.name}
                </h3>
                
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  {editingPlayer.photoUrl ? (
                    <img 
                      src={editingPlayer.photoUrl} 
                      alt="Preview" 
                      style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-primary)' }}
                    />
                  ) : (
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-surface)',
                      border: '2px dashed var(--border-color)',
                      margin: '0 auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-muted)'
                    }}>
                      Pas de photo
                    </div>
                  )}
                </div>

                <form onSubmit={handleUpdatePlayer}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      URL de la Photo du joueur
                    </label>
                    <input
                      type="text"
                      value={editingPlayer.photoUrl || ''}
                      onChange={(e) => setEditingPlayer({ ...editingPlayer, photoUrl: e.target.value })}
                      placeholder="https://..."
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => setEditingPlayer(null)} className="btn-outline">
                      Annuler
                    </button>
                    <button type="submit" className="btn-primary">
                      <Save size={14} /> Enregistrer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: GESTION GALERIE MÉDIAS */}
      {adminTab === 'gallery-manage' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {/* Add Gallery Item Form */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px' }}>
              Ajouter un Média à la Galerie
            </h3>
            <form onSubmit={handleAddGalleryItem}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Titre du Média / Description
                </label>
                <input
                  type="text"
                  placeholder="Ex: Cérémonie d'ouverture 2026"
                  value={newGalleryItem.title}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Type de Média
                  </label>
                  <select
                    value={newGalleryItem.type}
                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, type: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <option value="image">Photo / Image</option>
                    <option value="video">Vidéo MP4</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Catégorie
                  </label>
                  <select
                    value={newGalleryItem.category}
                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <option value="Match">Match Terrain</option>
                    <option value="Esports">Console Esports</option>
                    <option value="Teaser">Teaser</option>
                    <option value="Ceremony">Cérémonie</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  URL de la photo ou de la vidéo
                </label>
                <input
                  type="text"
                  placeholder="Ex: /videos/teaser.mp4 ou /teaser-thumbnail.jpg"
                  value={newGalleryItem.url}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, url: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <Plus size={16} /> Publier le média sur le site
              </button>
            </form>
          </div>

          {/* Admin Gallery List */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px' }}>
              Gestion des Médias Publiés ({galleryItems.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflowY: 'auto' }}>
              {galleryItems.map(g => (
                <div 
                  key={g.id}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className={g.type === 'video' ? 'badge badge-digital' : 'badge badge-physical'}>
                      {g.type.toUpperCase()}
                    </span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{g.title}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {g.category} • {g.url}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDeleteGalleryItem(g.id)}
                    style={{ padding: '6px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
