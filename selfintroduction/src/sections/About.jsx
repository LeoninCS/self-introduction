import { BriefcaseBusiness, GraduationCap, Trophy } from 'lucide-react';
import DriftText from '../components/DriftText';
import LazyImage from '../components/LazyImage';
import { archivePhotos } from '../data/archivePhotos';
import { profile } from '../data/profile';

const About = ({ sectionId = 'about' }) => {
  const experience = profile.experience[0];
  const biographySignals = [
    {
      label: 'Education',
      value: profile.education.school,
      meta: `${profile.education.major} / ${profile.education.period}`,
    },
    {
      label: 'Cloud Native',
      value: experience.company,
      meta: experience.role,
    },
    {
      label: 'Contest',
      value: 'ACM / ICPC',
      meta: `${profile.awards.length + profile.achievements.length} records`,
    },
  ];

  return (
    <section className="section story-section about" id={sectionId ?? undefined}>
      <div className="story-grid">
        <div className="story-sticky reveal-block">
          <span className="section-index">02</span>
          <p className="eyebrow">About / Profile</p>
          <h2>
            <DriftText text="工程能力与长期审美" />
          </h2>
          <p>
            {profile.realName}，{profile.education.school}
            {profile.education.major}本科在读。当前在{experience.company}
            担任{experience.role}，关注工程质量、系统稳定性和研发效率提升。
          </p>
        </div>

        <div className="story-flow">
          <div className="story-artifact reveal-block" aria-hidden="true">
            <div className="story-artifact__trace">
              <span />
              <span />
              <span />
            </div>
            <span className="story-artifact__eyebrow">Archive 01</span>
            <div className="story-artifact__nodes">
              {biographySignals.map((item) => (
                <div className="story-artifact__node" key={item.label}>
                  <em>{item.label}</em>
                  <b>{item.value}</b>
                  <small>{item.meta}</small>
                </div>
              ))}
            </div>
            <div className="story-artifact__axis">
              <em>2023</em>
              <em>2026</em>
              <em>2027</em>
            </div>
            <strong className="story-artifact__title">
              <DriftText mode="word" text="Engineering Biography" />
            </strong>
            <i />
          </div>

          <div className="archive-photo-set">
            {archivePhotos.map((photo, index) => (
              <figure className="archive-photo photo-reveal" key={photo.src} style={{ '--photo-index': index }}>
                <LazyImage alt={photo.alt} rootMargin="260px 0px" src={photo.previewSrc ?? photo.src} />
                <figcaption>
                  <span>{photo.title}</span>
                  <strong>{photo.meta}</strong>
                </figcaption>
              </figure>
            ))}
          </div>

          <article className="about-fragment">
            <span className="about-fragment__icon">
              <GraduationCap size={24} strokeWidth={2.1} />
            </span>
            <div>
              <p>Education</p>
              <h3>
                <DriftText text={profile.education.school} />
              </h3>
              <strong>{profile.education.major}</strong>
              <small>
                {profile.education.group} / {profile.education.period}
              </small>
            </div>
          </article>

          <article className="about-fragment">
            <span className="about-fragment__icon">
              <BriefcaseBusiness size={24} strokeWidth={2.1} />
            </span>
            <div>
              <p>Experience</p>
              <h3>
                <DriftText text={experience.company} />
              </h3>
              <strong>
                {experience.role} / {experience.period}
              </strong>
              <small>{experience.description}</small>
              <ul>
                {experience.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </article>

          <article className="about-fragment about-fragment--wide">
            <span className="about-fragment__icon">
              <Trophy size={24} strokeWidth={2.1} />
            </span>
            <div>
              <p>Awards</p>
              <h3>
                <DriftText text="竞赛成绩" />
              </h3>
              <ul>
                {[...profile.awards, ...profile.achievements].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default About;
