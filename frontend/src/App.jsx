import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FormatSection from './components/FormatSection';
import TeaserSection from './components/TeaserSection';
import FixturesSection from './components/FixturesSection';
import HomeStandings from './components/HomeStandings';
import TournamentBracket from './components/TournamentBracket';
import StandingsTable from './components/StandingsTable';
import TeamsRoster from './components/TeamsRoster';
import GallerySection from './components/GallerySection';
import TournamentStats from './components/TournamentStats';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginModal from './components/AdminLoginModal';
import MatchDetailModal from './components/MatchDetailModal';
import NewsletterSection from './components/NewsletterSection';
import Footer from './components/Footer';

import {
  fetchTeams,
  fetchMatches,
  fetchStandings,
  fetchTopScorers,
  getAdminSession,
  clearAdminSession
} from './services/api';
import { pickFeaturedMatch } from './utils/format';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [standings, setStandings] = useState(null);
  const [topScorers, setTopScorers] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    localStorage.removeItem('phygital_admin_logged_in');
    return getAdminSession() !== null;
  });
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const loadData = async () => {
    try {
      const [teamsData, matchesData, standingsData, scorersData] = await Promise.all([
        fetchTeams(),
        fetchMatches(),
        fetchStandings(),
        fetchTopScorers()
      ]);
      setTeams(teamsData || []);
      setMatches(matchesData || []);
      setStandings(standingsData || null);
      setTopScorers(scorersData || []);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [activeTab]);

  const handleTabChange = (tabId) => {
    if (tabId === 'admin' && !getAdminSession()) {
      setIsAdminLoggedIn(false);
      setShowAdminLogin(true);
    } else {
      setActiveTab(tabId);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setShowAdminLogin(false);
    setActiveTab('admin');
  };

  const handleAdminLogout = () => {
    clearAdminSession();
    setIsAdminLoggedIn(false);
    setActiveTab('home');
  };

  const handleSessionExpired = () => {
    clearAdminSession();
    setIsAdminLoggedIn(false);
    setShowAdminLogin(true);
  };

  const scrollToId = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const loginOverlay = (
    <AdminLoginModal
      isOpen={showAdminLogin}
      onClose={() => setShowAdminLogin(false)}
      onLoginSuccess={handleAdminLoginSuccess}
    />
  );

  if (activeTab === 'admin' && isAdminLoggedIn) {
    return (
      <AdminDashboard
        matches={matches}
        teams={teams}
        onDataChanged={loadData}
        onLogout={handleAdminLogout}
        onSessionExpired={handleSessionExpired}
        onExit={() => setActiveTab('home')}
      />
    );
  }

  return (
    <>
      <Navbar
        activeTab={activeTab}
        onNavigate={handleTabChange}
        onOpenAdmin={() => handleTabChange('admin')}
        matches={matches}
      />

      <main>
        {activeTab === 'home' && (
          <>
            <HeroSection
              featuredMatch={pickFeaturedMatch(matches)}
              teamsCount={teams.length}
              matchesCount={matches.length}
              onExploreSchedule={() => scrollToId('calendrier')}
              onExploreFormat={() => scrollToId('format')}
              onSelectMatch={setSelectedMatch}
            />
            <FormatSection />
            <TeaserSection />
            <FixturesSection matches={matches} onSelectMatch={setSelectedMatch} />
            <HomeStandings standings={standings} topScorers={topScorers} onOpenStandings={() => setActiveTab('standings')} />
            <NewsletterSection />
          </>
        )}

        {activeTab === 'bracket' && (
          <TournamentBracket matches={matches} standings={standings} onSelectMatch={setSelectedMatch} />
        )}

        {activeTab === 'standings' && (
          <StandingsTable standings={standings} topScorers={topScorers} matches={matches} />
        )}

        {activeTab === 'teams' && <TeamsRoster teams={teams} standings={standings} matches={matches} />}

        {activeTab === 'gallery' && <GallerySection />}

        {activeTab === 'stats' && <TournamentStats matches={matches} topScorers={topScorers} teams={teams} />}
      </main>

      <Footer onNavigate={handleTabChange} onOpenAdmin={() => handleTabChange('admin')} />

      {loginOverlay}

      {selectedMatch && <MatchDetailModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />}
    </>
  );
}
