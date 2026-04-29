import { lazy, Suspense, useEffect, useState } from 'react';
import {
  BadgeDollarSign,
  Bike,
  BookOpen,
  BrainCircuit,
  Camera,
  Code2,
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
  X,
} from 'lucide-react';
import DriftText from '../components/DriftText';
import { profile } from '../data/profile';
import ViewportMount from '../components/ViewportMount';

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

const marketCodes = {
  AAPL: 'AAPL',
  BTC: 'BTC',
  CVX: 'CVX',
  ETH: 'ETH',
  GOOGL: 'GOOGL',
  KO: 'KO',
  MSFT: 'MSFT',
  MU: 'MU',
  'Nasdaq 100': 'NDX',
  'Nikkei 225': 'N225',
  NVDA: 'NVDA',
  'S&P 500': 'SPX',
  USDT: 'USDT',
};

const marketMeta = {
  Crypto: {
    eyebrow: 'On-chain',
    mode: 'Liquidity',
  },
  个股: {
    eyebrow: 'Equity',
    mode: 'Quality',
  },
  宽基指数: {
    eyebrow: 'Macro',
    mode: 'Beta',
  },
};

const ExhibitionWall = lazy(() => import('./ExhibitionWall'));
const SignalAlbums = lazy(() => import('./SignalAlbums'));

const InlineFallback = ({ label }) => (
  <div className="lazy-module-placeholder lazy-module-placeholder--active" aria-hidden="true">
    <span>{label}</span>
    <i />
  </div>
);

const More = ({ sectionId = 'more' }) => {
  const [activePhoto, setActivePhoto] = useState(null);
  const featuredArtists = profile.music.artists.slice(0, 10);

  useEffect(() => {
    if (!activePhoto) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActivePhoto(null);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activePhoto]);

  return (
    <section className="section signal-section more" id={sectionId ?? undefined}>
      <div className="signal-hero reveal-block">
        <span className="section-index">05</span>
        <p className="eyebrow">Signal / Taste</p>
        <h2>
          <DriftText text="生活信号构成长期审美。" />
        </h2>
        <p>骑行、HiFi、摄影、音乐和资产观察，构成工程之外的个人气质。</p>
      </div>

      <div className="signal-installation reveal-block" aria-hidden="true">
        <span>Private Index</span>
        <strong>Ride / Sound / Frame / Markets</strong>
        <i />
        <i />
      </div>

      <div className="signal-grid">
        <article className="signal-column signal-column--life">
          <div className="signal-column__head">
            <span>Life</span>
            <strong>
              <DriftText text="生活与审美" />
            </strong>
          </div>
          {profile.hobbies.map((hobby) => {
            const Icon = hobbyIcons[hobby.icon];

            return (
              <div className="signal-row" key={hobby.name}>
                <span className="signal-row__icon">
                  <Icon size={22} strokeWidth={2.1} />
                </span>
                <div>
                  <h3>
                    <DriftText text={hobby.name} />
                  </h3>
                  <p>{hobby.description}</p>
                  {hobby.href && (
                    <a href={hobby.href} rel="noreferrer" target="_blank">
                      View Instagram
                      <ExternalLink size={15} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </article>

        <article className="signal-column signal-column--music">
          <div className="signal-column__head">
            <span>Music</span>
            <strong>
              <DriftText text="声音偏好" />
            </strong>
          </div>
          <div className="signal-marquee">
            {[...profile.music.genres, ...featuredArtists].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <ViewportMount
            className="lazy-content-anchor lazy-content-anchor--albums"
            minHeight="520px"
            placeholderLabel="Album Index"
            rootMargin="420px 0px"
          >
            <Suspense fallback={<InlineFallback label="Album Index" />}>
              <SignalAlbums />
            </Suspense>
          </ViewportMount>
        </article>

        <article className="signal-column signal-column--watch">
          <div className="signal-column__head">
            <span>Watchlist</span>
            <strong>
              <DriftText text="长期观察" />
            </strong>
          </div>
          <div className="market-terminal">
            <div className="market-terminal__top">
              <span>
                <BadgeDollarSign size={16} />
                Market Radar
              </span>
              <strong>
                <DriftText mode="word" text="Index / Crypto / Equity" />
              </strong>
              <em>Long View</em>
            </div>

            <div className="market-groups">
              {profile.finance.map((group, groupIndex) => {
                const meta = marketMeta[group.name];

                return (
                  <section className="market-group" key={group.name}>
                    <div className="market-group__head">
                      <span>{meta?.eyebrow ?? 'Watch'}</span>
                      <strong>{group.name}</strong>
                      <em>{meta?.mode ?? 'Signal'}</em>
                    </div>

                    <div className="market-list">
                      {group.items.map((item, itemIndex) => {
                        const label = typeof item === 'string' ? item : item.label;
                        const href = typeof item === 'string' ? undefined : item.href;
                        const AssetTag = href ? 'a' : 'div';

                        return (
                          <AssetTag
                            className="market-asset"
                            href={href}
                            key={label}
                            rel={href ? 'noreferrer' : undefined}
                            style={{
                              '--asset-index': itemIndex,
                              '--group-index': groupIndex,
                            }}
                            target={href ? '_blank' : undefined}
                          >
                            <span className="market-asset__code">{marketCodes[label] ?? label}</span>
                            <span className="market-asset__name">{label}</span>
                            <span className="market-asset__spark" aria-hidden="true">
                              <i />
                              <i />
                              <i />
                              <i />
                              <i />
                            </span>
                            {href && <ExternalLink size={14} />}
                          </AssetTag>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </article>

        <article className="signal-column signal-column--online">
          <div className="signal-column__head">
            <span>Online</span>
            <strong>
              <DriftText text="外部坐标" />
            </strong>
          </div>
          <div className="signal-links">
            {profile.platforms.map((platform) => {
              const Icon = platformIcons[platform.icon];

              return (
                <a href={platform.href} key={platform.name} rel="noreferrer" target="_blank">
                  <Icon size={18} />
                  <span>{platform.name}</span>
                  <strong>{platform.label}</strong>
                  <ExternalLink size={15} />
                </a>
              );
            })}
          </div>
        </article>
      </div>

      <ViewportMount
        className="lazy-content-anchor lazy-content-anchor--exhibition"
        minHeight="80vh"
        placeholderLabel="Photography Archive"
        rootMargin="520px 0px"
      >
        <Suspense fallback={<InlineFallback label="Photography Archive" />}>
          <ExhibitionWall onOpenPhoto={setActivePhoto} />
        </Suspense>
      </ViewportMount>

      {activePhoto && (
        <div
          aria-label={`${activePhoto.title} enlarged photo`}
          aria-modal="true"
          className="photo-lightbox"
          onClick={() => setActivePhoto(null)}
          role="dialog"
        >
          <figure className="photo-lightbox__figure" onClick={(event) => event.stopPropagation()}>
            <button
              aria-label="Close photo"
              className="photo-lightbox__close"
              onClick={() => setActivePhoto(null)}
              type="button"
            >
              <X size={20} />
            </button>
            <img alt={activePhoto.title} decoding="async" src={activePhoto.src} />
          </figure>
        </div>
      )}

      <footer className="finale-contact reveal-block">
        <a href={`mailto:${profile.contact.email}`}>
          <Mail size={19} />
          {profile.contact.email}
        </a>
        <a href={`tel:${profile.contact.phone}`}>
          <Phone size={19} />
          {profile.contact.phone}
        </a>
        <a href={profile.contact.github} rel="noreferrer" target="_blank">
          <Github size={19} />
          GitHub
        </a>
        <span>
          <MapPin size={19} />
          {profile.location}
        </span>
      </footer>
    </section>
  );
};

export default More;
