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
import DriftText from '../components/DriftText';
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
  python: Code2,
  web3: Blocks,
  container: Container,
  code: Code2,
};

const Skills = ({ sectionId = 'tech' }) => {
  return (
    <section className="section capability-section skills" id={sectionId ?? undefined}>
      <div className="capability-stage">
        <div className="capability-stage__sticky reveal-block">
          <span className="section-index">03</span>
          <p className="eyebrow">Tech / Capability</p>
          <h2>
            <DriftText text="以 Go 和 Python 工程能力为核心，向云原生、Agent 与产品实现延展。" />
          </h2>
          <p>
            技术栈在页面里以能力光谱呈现，滚动时逐条展开，形成更强的展览感和节奏感。
          </p>
        </div>

        <div className="capability-list">
          <div className="capability-atelier reveal-block" aria-hidden="true">
            <span>Material Study</span>
            <strong>Go / Python / Cloud Native / Agentic Systems</strong>
            <i />
            <i />
            <i />
            <div className="capability-telemetry motion-reveal">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>

          {profile.skills.map((skill, index) => {
            const Icon = icons[skill.icon];

            return (
              <a
                className="capability-row"
                href={skill.repo}
                key={skill.name}
                rel="noreferrer"
                target="_blank"
                style={{ '--row-index': index }}
              >
                <span className="capability-row__number">{String(index + 1).padStart(2, '0')}</span>
                <span className="capability-row__icon">
                  <Icon size={24} strokeWidth={2.1} />
                </span>
                <span className="capability-row__text">
                  <strong>
                    <DriftText mode="word" text={skill.name} />
                  </strong>
                  <small>{skill.description}</small>
                </span>
                <ExternalLink className="capability-row__link" size={18} />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
