const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Fallback initial data in case the backend server is starting up
const FALLBACK_TEAMS = [
  { id: '1', name: 'PhygyTal Maple P', group: 'A', colorHex: '#FF007F', logoUrl: '/logo-phygytal.png' },
  { id: '2', name: 'Quantum Wolves', group: 'A', colorHex: '#00E5FF', logoUrl: null },
  { id: '3', name: 'Neo Titans', group: 'A', colorHex: '#FFD700', logoUrl: null },
  { id: '4', name: 'Vortex United', group: 'A', colorHex: '#00FF88', logoUrl: null },
  { id: '5', name: 'Apex Predators', group: 'B', colorHex: '#A855F7', logoUrl: null },
  { id: '6', name: 'Aurora FC', group: 'B', colorHex: '#38BDF8', logoUrl: null },
  { id: '7', name: 'Hyperion Athletix', group: 'B', colorHex: '#FB923C', logoUrl: null },
  { id: '8', name: 'Zenith Gliders', group: 'B', colorHex: '#F43F5E', logoUrl: null }
];

const FALLBACK_MATCHES = [
  {
    id: 'm1',
    stage: 'GroupA',
    status: 'Completed',
    scheduledDate: new Date(Date.now() - 86400000).toISOString(),
    venue: 'Phygital Arena Montréal - Terrain 1',
    team1Id: '1',
    team1Name: 'PhygyTal Maple P',
    team1ColorHex: '#FF007F',
    team1LogoUrl: '/logo-phygytal.png',
    team2Id: '2',
    team2Name: 'Quantum Wolves',
    team2ColorHex: '#00E5FF',
    team1PhysicalGoals: 2,
    team2PhysicalGoals: 1,
    team1DigitalGoals: 3,
    team2DigitalGoals: 2,
    team1TotalGoals: 5,
    team2TotalGoals: 3,
    requiresPenalties: false,
    winnerTeamId: '1',
    winnerName: 'PhygyTal Maple P',
    team1PhysicalStat: { possessionPercentage: 55, totalShots: 12, shotsOnTarget: 7, corners: 4, fouls: 6, yellowCards: 1, redCards: 0 },
    team2PhysicalStat: { possessionPercentage: 45, totalShots: 8, shotsOnTarget: 4, corners: 2, fouls: 7, yellowCards: 2, redCards: 0 },
    team1DigitalStat: { possessionPercentage: 58, totalShots: 15, shotsOnTarget: 9, corners: 5, fouls: 2, yellowCards: 0, redCards: 0 },
    team2DigitalStat: { possessionPercentage: 42, totalShots: 10, shotsOnTarget: 5, corners: 3, fouls: 4, yellowCards: 1, redCards: 0 },
    playerStats: [
      { playerId: 'p1', playerName: 'Marc-Antoine Tremblay', teamName: 'PhygyTal Maple P', type: 'Physical', goals: 2, assists: 0 },
      { playerId: 'p2', playerName: 'Lucas Bélanger', teamName: 'PhygyTal Maple P', type: 'Physical', goals: 0, assists: 2 },
      { playerId: 'p5', playerName: 'David Novak', teamName: 'Quantum Wolves', type: 'Physical', goals: 1, assists: 0 },
      { playerId: 'p1', playerName: 'Marc-Antoine Tremblay', teamName: 'PhygyTal Maple P', type: 'Digital', goals: 2, assists: 1 },
      { playerId: 'p2', playerName: 'Lucas Bélanger', teamName: 'PhygyTal Maple P', type: 'Digital', goals: 1, assists: 1 },
      { playerId: 'p5', playerName: 'David Novak', teamName: 'Quantum Wolves', type: 'Digital', goals: 2, assists: 0 }
    ]
  },
  {
    id: 'm2',
    stage: 'GroupA',
    status: 'Scheduled',
    scheduledDate: new Date(Date.now() + 14400000).toISOString(),
    venue: 'Phygital Arena Montréal - Terrain 2',
    team1Id: '3',
    team1Name: 'Neo Titans',
    team1ColorHex: '#FFD700',
    team2Id: '4',
    team2Name: 'Vortex United',
    team2ColorHex: '#00FF88',
    team1PhysicalGoals: 0,
    team2PhysicalGoals: 0,
    team1DigitalGoals: 0,
    team2DigitalGoals: 0,
    team1TotalGoals: 0,
    team2TotalGoals: 0
  },
  {
    id: 'm3',
    stage: 'GroupB',
    status: 'Scheduled',
    scheduledDate: new Date(Date.now() + 28800000).toISOString(),
    venue: 'Phygital Arena Montréal - Terrain 1',
    team1Id: '5',
    team1Name: 'Apex Predators',
    team1ColorHex: '#A855F7',
    team2Id: '6',
    team2Name: 'Aurora FC',
    team2ColorHex: '#38BDF8',
    team1PhysicalGoals: 0,
    team2PhysicalGoals: 0,
    team1DigitalGoals: 0,
    team2DigitalGoals: 0,
    team1TotalGoals: 0,
    team2TotalGoals: 0
  }
];

export async function fetchTeams() {
  try {
    const res = await fetch(`${API_BASE_URL}/teams`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend offline, using fallback teams');
  }
  return FALLBACK_TEAMS;
}

export async function fetchMatches(stage, status) {
  try {
    const params = new URLSearchParams();
    if (stage) params.append('stage', stage);
    if (status) params.append('status', status);
    const res = await fetch(`${API_BASE_URL}/matches?${params.toString()}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend offline, using fallback matches');
  }
  return FALLBACK_MATCHES;
}

export async function fetchMatch(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/matches/${id}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend offline, using fallback match');
  }
  return FALLBACK_MATCHES.find(m => m.id === id) || FALLBACK_MATCHES[0];
}

export async function fetchStandings() {
  try {
    const res = await fetch(`${API_BASE_URL}/tournament/standings`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend offline, calculating fallback standings');
  }
  return {
    A: [
      { teamId: '1', teamName: 'PhygyTal Maple P', group: 'A', colorHex: '#FF007F', logoUrl: '/logo-phygytal.png', played: 1, won: 1, drawn: 0, lost: 0, physicalGoalsFor: 2, digitalGoalsFor: 3, goalsFor: 5, goalsAgainst: 3, goalDifference: 2, points: 3 },
      { teamId: '3', teamName: 'Neo Titans', group: 'A', colorHex: '#FFD700', played: 0, won: 0, drawn: 0, lost: 0, physicalGoalsFor: 0, digitalGoalsFor: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
      { teamId: '4', teamName: 'Vortex United', group: 'A', colorHex: '#00FF88', played: 0, won: 0, drawn: 0, lost: 0, physicalGoalsFor: 0, digitalGoalsFor: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
      { teamId: '2', teamName: 'Quantum Wolves', group: 'A', colorHex: '#00E5FF', played: 1, won: 0, drawn: 0, lost: 1, physicalGoalsFor: 1, digitalGoalsFor: 2, goalsFor: 3, goalsAgainst: 5, goalDifference: -2, points: 0 }
    ],
    B: [
      { teamId: '5', teamName: 'Apex Predators', group: 'B', colorHex: '#A855F7', played: 0, won: 0, drawn: 0, lost: 0, physicalGoalsFor: 0, digitalGoalsFor: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
      { teamId: '6', teamName: 'Aurora FC', group: 'B', colorHex: '#38BDF8', played: 0, won: 0, drawn: 0, lost: 0, physicalGoalsFor: 0, digitalGoalsFor: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
      { teamId: '7', teamName: 'Hyperion Athletix', group: 'B', colorHex: '#FB923C', played: 0, won: 0, drawn: 0, lost: 0, physicalGoalsFor: 0, digitalGoalsFor: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
      { teamId: '8', teamName: 'Zenith Gliders', group: 'B', colorHex: '#F43F5E', played: 0, won: 0, drawn: 0, lost: 0, physicalGoalsFor: 0, digitalGoalsFor: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 }
    ]
  };
}

export async function fetchTopScorers() {
  try {
    const res = await fetch(`${API_BASE_URL}/tournament/top-scorers`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend offline, using fallback scorers');
  }
  return [
    { playerId: 'p1', playerName: 'Marc-Antoine Tremblay', teamName: 'PhygyTal Maple P', teamColorHex: '#FF007F', position: 'Forward', physicalGoals: 2, digitalGoals: 2, totalGoals: 4, assists: 1 },
    { playerId: 'p5', playerName: 'David Novak', teamName: 'Quantum Wolves', teamColorHex: '#00E5FF', position: 'Forward', physicalGoals: 1, digitalGoals: 2, totalGoals: 3, assists: 0 },
    { playerId: 'p2', playerName: 'Lucas Bélanger', teamName: 'PhygyTal Maple P', teamColorHex: '#FF007F', position: 'Midfielder', physicalGoals: 0, digitalGoals: 1, totalGoals: 1, assists: 3 }
  ];
}

export async function updateMatchSheet(matchId, sheetData) {
  const res = await fetch(`${API_BASE_URL}/matches/${matchId}/sheet`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sheetData)
  });
  if (!res.ok) {
    throw new Error('Erreur lors de la mise à jour de la feuille de match');
  }
  return await res.json();
}

export async function subscribeNewsletter(email) {
  const res = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return await res.json();
}

// Admin Team Management
export async function createTeam(teamData) {
  try {
    const res = await fetch(`${API_BASE_URL}/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teamData)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.error('Error creating team:', err);
  }
  return { id: Date.now().toString(), ...teamData };
}

export async function updateTeam(teamId, teamData) {
  try {
    const res = await fetch(`${API_BASE_URL}/teams/${teamId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teamData)
    });
    if (res.ok) return true;
  } catch (err) {
    console.error('Error updating team:', err);
  }
  return true;
}

export async function deleteTeam(teamId) {
  try {
    const res = await fetch(`${API_BASE_URL}/teams/${teamId}`, { method: 'DELETE' });
    if (res.ok) return true;
  } catch (err) {
    console.error('Error deleting team:', err);
  }
  return true;
}

// Admin Player Management
export async function addPlayer(teamId, playerData) {
  try {
    const res = await fetch(`${API_BASE_URL}/teams/${teamId}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(playerData)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.error('Error adding player:', err);
  }
  return { id: Date.now().toString(), teamId, ...playerData };
}

export async function updatePlayer(playerId, playerData) {
  try {
    const res = await fetch(`${API_BASE_URL}/teams/players/${playerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(playerData)
    });
    if (res.ok) return true;
  } catch (err) {
    console.error('Error updating player:', err);
  }
  return true;
}

export async function deletePlayer(playerId) {
  try {
    const res = await fetch(`${API_BASE_URL}/teams/players/${playerId}`, { method: 'DELETE' });
    if (res.ok) return true;
  } catch (err) {
    console.error('Error deleting player:', err);
  }
  return true;
}

// Gallery API
const FALLBACK_GALLERY = [
  { id: 'g1', title: 'Teaser Officiel PhyGital 2026', url: '/videos/teaser.mp4', type: 'video', category: 'Teaser', dateAdded: new Date().toISOString() },
  { id: 'g2', title: 'Duel Terrain Physique - Match d\'ouverture', url: '/teaser-thumbnail.jpg', type: 'image', category: 'Match', dateAdded: new Date().toISOString() },
  { id: 'g3', title: 'Session Console FIFA / FC26', url: '/teaser-bg.jpg', type: 'image', category: 'Esports', dateAdded: new Date().toISOString() }
];

export async function fetchGallery() {
  try {
    const res = await fetch(`${API_BASE_URL}/gallery`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend offline, using fallback gallery');
  }
  return FALLBACK_GALLERY;
}

export async function addGalleryItem(itemData) {
  try {
    const res = await fetch(`${API_BASE_URL}/gallery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.error('Error adding gallery item:', err);
  }
  return { id: Date.now().toString(), ...itemData };
}

export async function deleteGalleryItem(itemId) {
  try {
    const res = await fetch(`${API_BASE_URL}/gallery/${itemId}`, { method: 'DELETE' });
    if (res.ok) return true;
  } catch (err) {
    console.error('Error deleting gallery item:', err);
  }
  return true;
}

