import {
  BadgeDollarSign,
  Bike,
  BookOpen,
  BrainCircuit,
  Camera,
  Code2,
  Disc3,
  ExternalLink,
  Github,
  Globe2,
  Headphones,
  Instagram,
  Mail,
  MapPin,
  Phone,
  PlaySquare,
  Share2,
  TrendingUp,
  Trophy,
  Twitter,
} from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import { profile } from '../data/profile';

const hobbyIcons = {
  acm: Trophy,
  ai: BrainCircuit,
  cycling: Bike,
  finance: TrendingUp,
  codeforces: Code2,
  hifi: Headphones,
  leetcode: Code2,
  opensource: BookOpen,
  photo: Camera,
  web3: Share2,
};

const platformIcons = {
  bilibili: PlaySquare,
  codeforces: Code2,
  github: Github,
  instagram: Instagram,
  leetcode: Trophy,
  site: Globe2,
  x: Twitter,
  xiaohongshu: BookOpen,
};

const More = () => {
  return (
    <section className="section more" id="more">
      <SectionTitle eyebrow="Signal" title="个人信号">
        <p>
          这里放兴趣、音乐、理财观察、平台主页和联系方式，展示工程之外的长期关注。
        </p>
      </SectionTitle>

      <div className="more__stack">
        <div className="more__group">
          <div className="more__group-heading">
            <span>Life / Taste</span>
            <strong>生活与审美</strong>
          </div>

          <div className="hobby-grid">
            {profile.hobbies.map((hobby) => {
              const Icon = hobbyIcons[hobby.icon];

              return (
                <article className="hobby-card float-card" key={hobby.name}>
                  <span className="hobby-card__icon">
                    <Icon size={26} strokeWidth={2.1} />
                  </span>
                  <div>
                    <h3>{hobby.name}</h3>
                    <p>{hobby.description}</p>
                    {hobby.href && (
                      <a className="hobby-card__link" href={hobby.href} rel="noreferrer" target="_blank">
                        View Instagram
                        <ExternalLink size={15} />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <article className="finance-panel float-card">
          <div className="finance-panel__header">
            <span className="finance-panel__icon">
              <BadgeDollarSign size={24} />
            </span>
            <div>
              <p>Finance Watchlist</p>
              <h3>关注美股指数、Crypto 和优质个股</h3>
            </div>
          </div>
          <div className="finance-panel__grid">
            {profile.finance.map((group) => (
              <div className="finance-panel__group" key={group.name}>
                <strong>{group.name}</strong>
                <div>
                  {group.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="music-panel float-card">
          <div className="music-panel__header">
            <span className="music-panel__icon">
              <Disc3 size={24} />
            </span>
            <div>
              <p>Music Taste</p>
              <h3>R&B、Jazz、Hip-Hop，以及一些反复听的艺术家和专辑。</h3>
            </div>
          </div>

          <div className="music-panel__grid">
            <div className="music-panel__group">
              <strong>Genres</strong>
              <div>
                {profile.music.genres.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
            <div className="music-panel__group">
              <strong>Artists</strong>
              <div>
                {profile.music.artists.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
            <div className="music-panel__group music-panel__group--albums">
              <strong>中文专辑</strong>
              <div>
                {profile.music.chineseAlbums.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
            <div className="music-panel__group music-panel__group--albums">
              <strong>English Albums</strong>
              <div>
                {profile.music.englishAlbums.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          </div>
        </article>

        <div className="more__group">
          <div className="more__group-heading">
            <span>Online / Links</span>
            <strong>外部坐标</strong>
          </div>

          <div className="platform-grid">
            {profile.platforms.map((platform) => {
              const Icon = platformIcons[platform.icon];

              return (
                <a
                  className="platform-card float-card"
                  href={platform.href}
                  key={platform.name}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span>
                    <Icon size={22} />
                    {platform.name}
                  </span>
                  <strong>{platform.label}</strong>
                  <ExternalLink size={17} />
                </a>
              );
            })}
          </div>
        </div>

        <div className="more__footer-grid">
          <article className="ai-toolchain ai-toolchain--compact float-card">
            <div className="ai-toolchain__header">
              <span className="ai-toolchain__icon">
                <BrainCircuit size={22} />
              </span>
              <div>
                <p>AI Tools</p>
                <h3>日常会使用 Codex、Claude Code、Gemini 等工具辅助开发和整理思路。</h3>
              </div>
            </div>
            <div className="ai-toolchain__grid">
              {profile.aiTools.map((tool) => (
                <span className="ai-toolchain__chip" key={tool.name}>
                  <strong>{tool.name}</strong>
                </span>
              ))}
            </div>
          </article>

          <div className="more-contact">
            <a className="float-card" href={`mailto:${profile.contact.email}`}>
              <Mail size={20} />
              {profile.contact.email}
            </a>
            <a className="float-card" href={`tel:${profile.contact.phone}`}>
              <Phone size={20} />
              {profile.contact.phone}
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
        </div>
      </div>
    </section>
  );
};

export default More;
