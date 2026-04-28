import { useEffect, useState } from 'react';
import MagicButton from '../components/MagicButton';
import ProfileVisual from '../components/ProfileVisual';
import { profile } from '../data/profile';

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'tech', label: 'Tech' },
  { id: 'projects', label: 'Projects' },
  { id: 'more', label: 'Signal' },
];

const getAnchorOffset = () => Math.min(Math.max(window.innerHeight * 0.065, 58), 82);

const getElementTop = (element) => element.getBoundingClientRect().top + window.scrollY;

const getSectionAnchorElement = (section) => section.querySelector('.section-title') ?? section;

const Hero = () => {
  const [activeSection, setActiveSection] = useState(navItems[0].id);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);
    let frameId;

    const updateActiveSection = () => {
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
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

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
    const anchorElement = getSectionAnchorElement(section);

    window.scrollTo({
      behavior: 'smooth',
      top: sectionId === 'home' ? 0 : Math.max(getElementTop(anchorElement) - getAnchorOffset(), 0),
    });
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

      <div className="hero__layout">
        <div className="hero__content">
          <p className="eyebrow">Personal Website</p>
          <h1 data-title={profile.name}>{profile.name}</h1>
          <p className="hero__intro">{profile.intro}</p>

          <div className="hero__actions" aria-label="Primary actions">
            <MagicButton href={`mailto:${profile.contact.email}`}>联系我</MagicButton>
            <MagicButton href={profile.contact.github}>GitHub</MagicButton>
          </div>
        </div>

        <ProfileVisual />
      </div>

    </header>
  );
};

export default Hero;
