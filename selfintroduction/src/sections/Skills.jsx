import {
  Boxes,
  BrainCircuit,
  Blocks,
  Cloud,
  Code2,
  Container,
  Cpu,
  Database,
  ExternalLink,
  GitBranch,
  Server,
} from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import { profile } from '../data/profile';

const icons = {
  agent: BrainCircuit,
  cloud: Cloud,
  cpp: Cpu,
  database: Database,
  distributed: GitBranch,
  frontend: Code2,
  go: Server,
  opensource: Boxes,
  web3: Blocks,
  container: Container,
  code: Code2,
};

const Skills = () => {
  return (
    <section className="section skills" id="tech">
      <SectionTitle eyebrow="Tech" title="技术栈" />

      <div className="skill-grid">
        {profile.skills.map((skill) => (
          <a
            className="skill-card float-card"
            href={skill.repo}
            key={skill.name}
            rel="noreferrer"
            target="_blank"
          >
            <span className="skill-card__top">
              <span className="skill-card__icon">
                {(() => {
                  const Icon = icons[skill.icon];
                  return <Icon size={26} strokeWidth={2.1} />;
                })()}
              </span>
              <ExternalLink className="skill-card__link-icon" size={18} />
            </span>
            <h3>{skill.name}</h3>
            <p>{skill.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Skills;
