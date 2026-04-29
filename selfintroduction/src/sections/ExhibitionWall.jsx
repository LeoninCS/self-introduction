import DriftText from '../components/DriftText';
import LazyImage from '../components/LazyImage';
import { exhibitionGroups } from '../data/exhibitionGroups';

const mirroredGroupNumbers = new Set([2, 4, 6]);

const ExhibitionWall = ({ onOpenPhoto }) => (
  <div className="exhibition-wall" aria-label="Photography exhibition">
    {exhibitionGroups.map((group, groupIndex) => {
      const groupNumber = groupIndex + 1;
      const isMirrored = mirroredGroupNumbers.has(groupNumber);

      return (
        <section
          className={`exhibition-group ${
            isMirrored ? 'exhibition-group--label-right' : 'exhibition-group--label-left'
          } reveal-block`}
          key={group.title}
        >
          <div className="exhibition-group__head">
            <span>{String(groupNumber).padStart(2, '0')}</span>
            <h3>
              <DriftText mode="word" text={group.title} />
            </h3>
            <p>{group.meta}</p>
          </div>

          <div className="exhibition-track">
            {group.photos.filter(Boolean).map((photo, index) => {
              const loadsImmediately = photo.type === 'Flight';

              return (
                <figure className="exhibition-frame" key={photo.src} style={{ '--frame-index': index }}>
                  <button
                    aria-label={`Open ${photo.title}`}
                    className="exhibition-frame__button"
                    onClick={() => onOpenPhoto({ ...photo, group: group.title })}
                    type="button"
                  >
                    <LazyImage
                      alt={photo.title}
                      loading={loadsImmediately ? 'eager' : 'lazy'}
                      rootMargin="240px 620px"
                      rootSelector={loadsImmediately ? undefined : '.exhibition-track'}
                      sizes="(max-width: 620px) 72vw, (max-width: 980px) 46vw, 340px"
                      src={photo.previewSrc ?? photo.src}
                    />
                  </button>
                </figure>
              );
            })}
          </div>
        </section>
      );
    })}
  </div>
);

export default ExhibitionWall;
