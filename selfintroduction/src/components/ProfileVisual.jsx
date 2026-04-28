import { profile } from '../data/profile';

const ProfileVisual = () => {
  return (
    <aside className="profile-visual float-card" aria-label="Profile overview">
      <div className="profile-visual__grid" aria-hidden="true" />
      <div className="profile-visual__halo" aria-hidden="true" />
      <div className="profile-visual__constellation" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="profile-visual__header">
        <span className="profile-visual__mark">L</span>
        <div>
          <p>{profile.role}</p>
          <strong>{profile.location}</strong>
        </div>
      </div>

      <div className="profile-visual__dashboard" aria-hidden="true">
        <div className="profile-visual__radar">
          <span className="profile-visual__ring profile-visual__ring--outer" />
          <span className="profile-visual__ring profile-visual__ring--middle" />
          <span className="profile-visual__ring profile-visual__ring--inner" />
          <span className="profile-visual__axis profile-visual__axis--one" />
          <span className="profile-visual__axis profile-visual__axis--two" />
          <span className="profile-visual__core" />
        </div>

        <div className="profile-visual__signals">
          {profile.visualSignals.map((signal) => (
            <span key={signal.label} style={{ '--signal': signal.value }}>
              {signal.label}
            </span>
          ))}
        </div>
      </div>

      <div className="profile-visual__tags">
        {profile.highlights.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>

      <div className="profile-visual__ticker" aria-hidden="true">
        {profile.tickerItems.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </aside>
  );
};

export default ProfileVisual;
