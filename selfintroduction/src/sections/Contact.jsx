import { Github, Mail, MapPin } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import { profile } from '../data/profile';

const Contact = () => {
  return (
    <section className="section contact" id="contact">
      <SectionTitle eyebrow="Contact" title="联系我">
        <p>欢迎通过邮箱或 GitHub 交流前端、产品和作品合作。</p>
      </SectionTitle>

      <div className="contact__links">
        <a className="float-card" href={`mailto:${profile.contact.email}`}>
          <Mail size={20} />
          {profile.contact.email}
        </a>
        <a className="float-card" href={profile.contact.github} rel="noreferrer" target="_blank">
          <Github size={20} />
          GitHub
        </a>
        <span className="float-card">
          <MapPin size={20} />
          {profile.location}
        </span>
      </div>
    </section>
  );
};

export default Contact;
