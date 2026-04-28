import { ExternalLink } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import { profile } from '../data/profile';

const Projects = () => {
  return (
    <section className="section projects" id="projects">
      <SectionTitle eyebrow="Projects" title="作品方向">
        <p>这里展示实习参与项目和个人项目，覆盖云原生、后端系统、分布式和 AI Agent。</p>
      </SectionTitle>

      <div className="project-list">
        {profile.projects.map((project) => (
          <a
            className="project-card float-card"
            href={project.href}
            key={project.title}
            rel="noreferrer"
            target="_blank"
          >
            <div>
              <span className="project-card__tag">{project.tag}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
            <div className="project-card__hud" aria-hidden="true">
              <ExternalLink className="project-card__link" size={18} />
              <span className="project-card__screen">
                <i />
                <i />
                <i />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Projects;
