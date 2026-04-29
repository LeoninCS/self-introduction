import { ExternalLink } from 'lucide-react';
import DriftText from '../components/DriftText';
import { profile } from '../data/profile';

const Projects = ({ sectionId = 'projects' }) => {
  return (
    <section className="section project-section projects" id={sectionId ?? undefined}>
      <div className="section-head reveal-block">
        <span className="section-index">04</span>
        <p className="eyebrow">Projects / Direction</p>
        <h2>
          <DriftText text="几个能代表方向的项目。" />
        </h2>
        <p>覆盖云原生、后端系统、分布式和 AI Agent，项目以横向条幅展开，强化作品集的浏览节奏。</p>
      </div>

      <div className="project-installation reveal-block" aria-hidden="true">
        <span>Selected Work Index</span>
        <strong>01-05</strong>
        <i />
      </div>

      <div className="project-showcase">
        {profile.projects.map((project, index) => (
          <a
            className="project-strip"
            href={project.href}
            key={project.title}
            rel="noreferrer"
            target="_blank"
            style={{ '--strip-index': index }}
          >
            <span className="project-strip__number">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <span className="project-strip__tag">{project.tag}</span>
              <h3>
                <DriftText mode="word" text={project.title} />
              </h3>
              <p>{project.description}</p>
            </div>
            <span className="project-strip__launch">
              Open
              <ExternalLink size={18} />
            </span>
            <span className="project-strip__trace" aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  );
};

export default Projects;
