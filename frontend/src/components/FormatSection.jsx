const STEPS = [
  ['01', 'Manche terrain', 'Un vrai match sur gazon. Possession, tirs, corners et cartons sont enregistrés en direct.', 'var(--round-physical)'],
  ['02', 'Manche console', 'Les mêmes équipes se retrouvent sur EA FC. Mêmes enjeux, mêmes statistiques.', 'var(--round-digital)'],
  ['03', 'Score cumulé', 'Les buts des deux manches s’additionnent pour désigner le vainqueur de la rencontre.', 'var(--text-primary)'],
  ['04', 'Tirs au but', 'Égalité parfaite après les deux manches ? Une séance de tirs au but départage les équipes.', 'var(--brand)']
];

export default function FormatSection() {
  return (
    <section className="section" id="format">
      <div className="container">
        <div className="section-head">
          <div className="section-head__titles">
            <span className="kicker">Le format</span>
            <h2 className="section-title">Un match, deux manches</h2>
          </div>
          <p className="section-head__aside">
            Le premier tournoi où le talent sur le terrain et la maîtrise de la manette pèsent autant.
          </p>
        </div>
        <div className="steps">
          {STEPS.map(([num, title, body, accent]) => (
            <article key={num} className="card step" style={{ '--accent': accent }}>
              <span className="step__num">{num}</span>
              <h3 className="step__title">{title}</h3>
              <p className="step__body">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
