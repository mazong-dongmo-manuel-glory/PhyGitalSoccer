import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MatchCard from './components/MatchCard';
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

import { fetchTeams, fetchMatches, fetchStandings, fetchTopScorers } from './services/api';
import { Calendar } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [standings, setStandings] = useState(null);
  const [topScorers, setTopScorers] = useState([]);
  const [selectedMatchModal, setSelectedMatchModal] = useState(null);
  
  // Admin State & Protection
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Check local storage for persistent admin state
    const savedAdmin = localStorage.getItem('phygital_admin_logged_in');
    if (savedAdmin === 'true') {
      setIsAdminLoggedIn(true);
    }
  }, []);

  const handleTabChange = (tabId) => {
    if (tabId === 'admin' && !isAdminLoggedIn) {
      setShowAdminLoginModal(true);
    } else {
      setActiveTab(tabId);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    localStorage.setItem('phygital_admin_logged_in', 'true');
    setShowAdminLoginModal(false);
    setActiveTab('admin');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('phygital_admin_logged_in');
    setActiveTab('home');
  };

  const featuredMatch = matches.find(m => m.status === 'Completed') || matches[0];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminLogin={() => setShowAdminLoginModal(true)}
        onAdminLogout={handleAdminLogout}
      />

      <main style={{ flex: 1 }}>
        {/* PUBLIC HOME PAGE */}
        {activeTab === 'home' && (
          <div>
            <HeroSection 
              onExploreBracket={() => setActiveTab('bracket')}
              onOpenAdmin={() => setActiveTab('teams')}
              featuredMatch={featuredMatch}
              onSelectMatch={(m) => setSelectedMatchModal(m)}
            />

            {/* Public Matches Schedule */}
            <section style={{ maxWidth: '1200px', margin: '0 auto 48px', padding: '0 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <div className="section-label">
                    <Calendar size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                    Calendrier Officiel
                  </div>
                  <h2 className="section-title">
                    Rencontres <em>PhyGital</em>
                  </h2>
                </div>
                <button onClick={() => setActiveTab('bracket')} className="btn-outline" style={{ fontSize: '0.82rem' }}>
                  Voir l'arbre complet
                </button>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                gap: '16px'
              }}>
                {matches.map(m => (
                  <MatchCard 
                    key={m.id} 
                    match={m} 
                    onSelect={(match) => setSelectedMatchModal(match)}
                  />
                ))}
              </div>
            </section>

            {/* Standings Preview */}
            {standings && (
              <section>
                <StandingsTable standings={standings} topScorers={topScorers} />
              </section>
            )}

            <NewsletterSection />
          </div>
        )}

        {/* PUBLIC BRACKET PAGE */}
        {activeTab === 'bracket' && (
          <TournamentBracket 
            matches={matches} 
            onSelectMatch={(m) => setSelectedMatchModal(m)} 
          />
        )}

        {/* PUBLIC STANDINGS & TOP SCORERS PAGE */}
        {activeTab === 'standings' && (
          <StandingsTable 
            standings={standings} 
            topScorers={topScorers} 
          />
        )}

        {/* PUBLIC TEAMS & PLAYERS ROSTER PAGE */}
        {activeTab === 'teams' && (
          <TeamsRoster teams={teams} />
        )}

        {/* PUBLIC MEDIA GALLERY PAGE */}
        {activeTab === 'gallery' && (
          <GallerySection />
        )}

        {/* PUBLIC TOURNAMENT STATS PAGE */}
        {activeTab === 'stats' && (
          <TournamentStats matches={matches} topScorers={topScorers} />
        )}

        {/* PROTECTED ADMIN DASHBOARD */}
        {activeTab === 'admin' && isAdminLoggedIn && (
          <AdminDashboard 
            matches={matches} 
            teams={teams} 
            onDataChanged={loadData}
            onLogout={handleAdminLogout}
          />
        )}
      </main>

      {/* Admin Login PIN Modal */}
      <AdminLoginModal 
        isOpen={showAdminLoginModal}
        onClose={() => setShowAdminLoginModal(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Match Detail Lightbox Modal */}
      {selectedMatchModal && (
        <MatchDetailModal 
          match={selectedMatchModal} 
          onClose={() => setSelectedMatchModal(null)} 
        />
      )}

      <Footer />
    </div>
  );
}
