const FALLBACK_COLORS = ['#E8155C', '#00A3C4', '#C99A00', '#0E9F63', '#7C3AED', '#0284C7', '#EA580C', '#E11D48'];

export function initials(name = '') {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function colorFor(hex, key = '') {
  if (hex) return hex;
  let sum = 0;
  for (const ch of String(key)) sum += ch.charCodeAt(0);
  return FALLBACK_COLORS[sum % FALLBACK_COLORS.length];
}

const STAGES = {
  GroupA: 'Groupe A',
  GroupB: 'Groupe B',
  SemiFinal: 'Demi-finale',
  ThirdPlace: 'Petite finale',
  Final: 'Finale'
};

export const stageLabel = (stage) => STAGES[stage] || stage;
export const isGroupStage = (stage) => stage === 'GroupA' || stage === 'GroupB';

const POSITIONS = { Goalkeeper: 'Gardien', Defender: 'Défenseur', Midfielder: 'Milieu', Forward: 'Attaquant' };
const POSITION_ORDER = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
export const positionKey = (p) => (typeof p === 'number' ? POSITION_ORDER[p] : p);
export const positionLabel = (p) => POSITIONS[positionKey(p)] || 'Joueur';

export function matchState(match) {
  if (match.status === 'Completed') return 'done';
  if (match.status === 'InProgress') return 'live';
  return 'next';
}

export function isToday(date) {
  const d = new Date(date);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

export const formatTime = (date) =>
  new Date(date).toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' });

export function formatDay(date) {
  if (isToday(date)) return 'Auj.';
  return new Date(date)
    .toLocaleDateString('fr-CA', { weekday: 'short', day: 'numeric', month: 'short' })
    .replace(/\./g, '')
    .toUpperCase();
}

export const formatShortDate = (date) =>
  new Date(date).toLocaleDateString('fr-CA', { day: 'numeric', month: 'short' });

export function aggregatePlayerStats(matches) {
  const byPlayer = new Map();
  for (const m of matches) {
    for (const ps of m.playerStats || []) {
      const cur = byPlayer.get(ps.playerId) || {
        playerId: ps.playerId,
        playerName: ps.playerName,
        teamId: ps.teamId,
        teamName: ps.teamName,
        physicalGoals: 0,
        digitalGoals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0
      };
      if (ps.type === 'Physical') cur.physicalGoals += ps.goals || 0;
      else cur.digitalGoals += ps.goals || 0;
      cur.assists += ps.assists || 0;
      cur.yellowCards += ps.yellowCards || 0;
      cur.redCards += ps.redCards || 0;
      byPlayer.set(ps.playerId, cur);
    }
  }
  return byPlayer;
}

export function teamForm(teamId, matches) {
  return matches
    .filter(m => m.status === 'Completed' && isGroupStage(m.stage) && (m.team1Id === teamId || m.team2Id === teamId))
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
    .map(m => {
      const own = m.team1Id === teamId ? m.team1TotalGoals : m.team2TotalGoals;
      const other = m.team1Id === teamId ? m.team2TotalGoals : m.team1TotalGoals;
      return own > other ? 'V' : own < other ? 'D' : 'N';
    });
}

export function pickFeaturedMatch(matches) {
  return (
    matches.find(m => m.status === 'InProgress') ||
    [...matches].filter(m => m.status === 'Completed').sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate))[0] ||
    matches[0]
  );
}
