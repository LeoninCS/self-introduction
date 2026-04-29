import { useEffect, useState } from 'react';
import { ArrowDownRight, Github, Mail } from 'lucide-react';
import DriftText from '../components/DriftText';
import { profile } from '../data/profile';

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'tech', label: 'Tech' },
  { id: 'projects', label: 'Projects' },
  { id: 'more', label: 'Signal' },
];

const anchorSelector = [
  '.story-sticky',
  '.capability-stage__sticky',
  '.section-head',
  '.signal-hero',
  '.section-title',
].join(', ');

const getAnchorOffset = () => {
  const nav = document.querySelector('.nav');
  const navBottom = nav?.getBoundingClientRect().bottom ?? 72;

  return Math.round(Math.min(Math.max(navBottom + 24, 92), 132));
};

const getElementTop = (element) => element.getBoundingClientRect().top + window.scrollY;

const getSectionAnchorElement = (section) => section.querySelector(anchorSelector) ?? section;

const getNavSections = () => navItems.map((item) => document.getElementById(item.id)).filter(Boolean);

const Hero = () => {
  const [activeSection, setActiveSection] = useState(navItems[0].id);
  const identityItems = [
    { label: 'School', value: `${profile.education.school} / ${profile.education.major}` },
    { label: 'Cloud', value: profile.experience[0].company },
    { label: 'Contest', value: profile.education.group },
  ];

  useEffect(() => {
    let frameId;

    const updateActiveSection = () => {
      const sections = getNavSections();
      const anchorLine = window.scrollY + getAnchorOffset() + 4;
      const currentSection = sections.reduce((current, section) => {
        if (getElementTop(getSectionAnchorElement(section)) <= anchorLine) {
          return section.id;
        }

        return current;
      }, navItems[0].id);

      setActiveSection(currentSection);
      frameId = undefined;
    };

    const handleScroll = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    const mutationObserver = new MutationObserver(handleScroll);
    mutationObserver.observe(document.querySelector('.site-content') ?? document.body, {
      childList: true,
      subtree: true,
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      mutationObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleNavChange = (sectionId) => {
    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    setActiveSection(sectionId);
    const scrollToSection = (behavior = 'smooth') => {
      const latestSection = document.getElementById(sectionId);

      if (!latestSection) {
        return;
      }

      const anchorElement = getSectionAnchorElement(latestSection);

      window.scrollTo({
        behavior,
        top: sectionId === 'home' ? 0 : Math.max(getElementTop(anchorElement) - getAnchorOffset(), 0),
      });
    };

    scrollToSection();
    window.setTimeout(() => scrollToSection('smooth'), 420);
  };

  return (
    <header className="hero" id="home">
      <nav className="nav" aria-label="Main navigation" role="radiogroup">
        {navItems.map((item) => (
          <label className="nav__option" key={item.id}>
            <input
              checked={activeSection === item.id}
              name="section-nav"
              onChange={() => handleNavChange(item.id)}
              type="radio"
              value={item.id}
            />
            <span className="nav__dot" aria-hidden="true" />
            <span>{item.label}</span>
          </label>
        ))}
      </nav>

      <div className="hero__scene" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="hero__kinetic motion-reveal" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="hero__masthead reveal-block">
        <p className="eyebrow">Personal Showcase / {profile.role}</p>
        <h1 data-title={profile.name}>
          <DriftText text={profile.name} />
        </h1>

        <div className="hero__statement">
          <p>{profile.intro}</p>
          <div className="hero__actions" aria-label="Primary actions">
            <a className="hero__action" href={`mailto:${profile.contact.email}`}>
              <Mail size={18} />
              联系我
            </a>
            <a className="hero__action" href={profile.contact.github} rel="noreferrer" target="_blank">
              <Github size={18} />
              GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="hero__atelier reveal-block" aria-hidden="true">
        <span>Edition 2026</span>
        <i />
        <strong>Systems / Taste / Motion</strong>
      </div>

      <div className="hero__lower">
        <div className="hero__index reveal-block">
          <span>01</span>
          <strong>{profile.realName}</strong>
          <p>
            {profile.education.school} / {profile.location}
          </p>
          <div className="hero__index-meta" aria-label="Identity highlights">
            {identityItems.map((item) => (
              <span key={item.label}>
                <em>{item.label}</em>
                <strong>{item.value}</strong>
              </span>
            ))}
          </div>
        </div>

        <aside className="hero__visual-canvas reveal-block" aria-label="Profile signals">
          <div className="hero__orbital" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className="hero__system-board" aria-hidden="true">
            <span>ACTIVE</span>
            <strong>
              <DriftText mode="word" text="BUILD MODE" />
            </strong>
            <i />
            <img
              alt=""
              className="hero__build-avatar"
              decoding="async"
              loading="lazy"
              referrerPolicy="no-referrer"
              src="https://github.com/LeoninCS.png"
            />
          </div>

          <div className="hero__node-field" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="hero__circuit motion-reveal" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="hero__signal-stack">
            {profile.visualSignals.map((signal) => (
              <span key={signal.label} style={{ '--signal': signal.value }}>
                <strong>{signal.label}</strong>
                <i />
                <em>{signal.value}</em>
              </span>
            ))}
          </div>

          <div className="hero__ticker" aria-label="Highlights">
            {profile.highlights.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </aside>
      </div>

      <a className="hero__scroll" href="#about" aria-label="Scroll to about">
        <ArrowDownRight size={20} />
      </a>
    </header>
  );
};

export default Hero;
