import { ArrowRight } from 'lucide-react';
import { GroupTable, ScorersCard } from './Leaderboards';

export default function HomeStandings({ standings, topScorers, onOpenStandings }) {
  if (!standings) return null;

  return (
    <section className="section section--surface">
      <div className="container">
        <div className="section-head">
          <div className="section-head__titles">
            <span className="kicker">Phase de groupes</span>
            <h2 className="section-title">Classements</h2>
          </div>
          <button type="button" className="link-arrow" onClick={onOpenStandings}>
            Classements détaillés <ArrowRight size={16} />
          </button>
        </div>
        <div className="standings-grid">
          <GroupTable group="A" rows={standings.A || []} compact />
          <GroupTable group="B" rows={standings.B || []} compact />
          <ScorersCard scorers={topScorers} />
        </div>
      </div>
    </section>
  );
}
