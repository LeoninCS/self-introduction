import { ExternalLink } from 'lucide-react';
import LazyImage from '../components/LazyImage';
import { albumGroups } from '../data/albums';

const SignalAlbums = () => (
  <div className="album-installation" aria-label="Album cover exhibition">
    {albumGroups.map((group) => (
      <section className="album-runway" key={group.title}>
        <div className="album-runway__meta">
          <span>{group.meta}</span>
          <strong>{group.title}</strong>
        </div>
        <div className="album-runway__track">
          {group.items.map((album, albumIndex) => (
            <a
              className="album-cover"
              href={album.href}
              key={album.title}
              rel="noreferrer"
              style={{
                '--album-index': albumIndex,
                '--album-tone': album.tone,
              }}
              target="_blank"
            >
              <span className="album-cover__image">
                <LazyImage
                  alt={`${album.title} album cover`}
                  referrerPolicy="no-referrer"
                  rootMargin="220px 520px"
                  rootSelector=".album-runway__track"
                  src={album.cover}
                />
              </span>
              <span className="album-cover__caption">
                <strong>{album.title}</strong>
                <em>{album.artist}</em>
                <span>
                  {album.year} / {album.source}
                  <ExternalLink size={13} />
                </span>
              </span>
            </a>
          ))}
        </div>
      </section>
    ))}
  </div>
);

export default SignalAlbums;
