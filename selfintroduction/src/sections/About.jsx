import { BriefcaseBusiness, GraduationCap, Trophy } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import { profile } from '../data/profile';

const About = () => {
  const experience = profile.experience[0];

  return (
    <section className="section about" id="about">
      <SectionTitle eyebrow="About" title="关于我">
        <p>
          {profile.realName}，{profile.education.school}
          {profile.education.major}本科在读。当前在{experience.company}
          担任{experience.role}，关注工程质量、系统稳定性和研发效率提升。
        </p>
      </SectionTitle>

      <div className="about-grid">
        <article className="about-card float-card">
          <span className="about-card__icon">
            <GraduationCap size={26} strokeWidth={2.1} />
          </span>
          <p>Education</p>
          <h3>{profile.education.school}</h3>
          <strong>{profile.education.major}</strong>
          <strong>{profile.education.group}</strong>
          <span>{profile.education.period}</span>
        </article>

        <article className="about-card about-card--awards about-card--merged float-card">
          <span className="about-card__icon">
            <Trophy size={26} strokeWidth={2.1} />
          </span>

          <div className="about-card__merged-section">
            <p>Awards</p>
            <h3>竞赛与数据</h3>
            <ul>
              {profile.awards.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="about-card__merged-section about-card__merged-section--stats">
            <p>Stats</p>
            <ul>
              {profile.achievements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </article>

        <article className="about-card about-card--wide float-card">
          <span className="about-card__icon">
            <BriefcaseBusiness size={26} strokeWidth={2.1} />
          </span>
          <p>Experience</p>
          <h3>{experience.company}</h3>
          <strong>
            {experience.role} / {experience.period}
          </strong>
          <span>{experience.description}</span>
          <ul>
            {experience.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
};

export default About;
