import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import BackgroundPattern from './components/BackgroundPattern';
import Loader from './components/Loader';
import ViewportMount from './components/ViewportMount';
import Hero from './sections/Hero';

const MIN_LOADING_TIME = 3200;
const EXIT_ANIMATION_TIME = 900;
const SKIP_EXIT_ANIMATION_TIME = 420;
const CONTENT_REVEAL_DELAY = 80;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const tiltCardSelector = [
  '.hero__visual-canvas',
  '.story-artifact',
  '.archive-photo',
  '.about-fragment',
  '.capability-row',
  '.project-strip',
  '.signal-column',
  '.album-cover',
  '.exhibition-frame',
].join(', ');
const pressCardSelector = [
  '.hero__visual-canvas',
  '.story-artifact',
  '.about-fragment',
  '.capability-row',
  '.project-strip',
  '.signal-column',
].join(', ');
const About = lazy(() => import('./sections/About'));
const Skills = lazy(() => import('./sections/Skills'));
const Projects = lazy(() => import('./sections/Projects'));
const More = lazy(() => import('./sections/More'));

const deferredSections = [
  {
    Component: About,
    id: 'about',
    label: 'About / Profile',
    minHeight: '130vh',
  },
  {
    Component: Skills,
    id: 'tech',
    label: 'Tech / Capability',
    minHeight: '130vh',
  },
  {
    Component: Projects,
    id: 'projects',
    label: 'Projects / Direction',
    minHeight: '110vh',
  },
  {
    Component: More,
    id: 'more',
    label: 'Signal / Taste',
    minHeight: '150vh',
  },
];

const SectionFallback = ({ label }) => (
  <div className="lazy-module-placeholder lazy-module-placeholder--active" aria-hidden="true">
    <span>{label}</span>
    <i />
  </div>
);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const hasStartedExitRef = useRef(false);
  const exitTimerRef = useRef();
  const revealTimerRef = useRef();

  const revealContent = useCallback((exitTime = EXIT_ANIMATION_TIME) => {
    if (hasStartedExitRef.current) {
      return;
    }

    hasStartedExitRef.current = true;
    setIsLeaving(true);
    window.clearTimeout(exitTimerRef.current);
    window.clearTimeout(revealTimerRef.current);

    exitTimerRef.current = window.setTimeout(() => {
      setIsLoading(false);
      revealTimerRef.current = window.setTimeout(() => {
        setIsContentVisible(true);
      }, CONTENT_REVEAL_DELAY);
    }, exitTime);
  }, []);

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;

    window.history.scrollRestoration = 'manual';
    window.scrollTo({ left: 0, top: 0, behavior: 'auto' });

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    let minimumTimeReached = false;
    let pageReady = document.readyState === 'complete';
    const finishLoading = () => {
      if (!minimumTimeReached || !pageReady) {
        return;
      }

      revealContent();
    };

    const minimumTimer = window.setTimeout(() => {
      minimumTimeReached = true;
      finishLoading();
    }, MIN_LOADING_TIME);

    const handleLoad = () => {
      pageReady = true;
      finishLoading();
    };

    if (pageReady) {
      finishLoading();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      window.clearTimeout(minimumTimer);
      window.removeEventListener('load', handleLoad);
    };
  }, [revealContent]);

  useEffect(() => {
    return () => {
      window.clearTimeout(exitTimerRef.current);
      window.clearTimeout(revealTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const revealSelector =
      '.reveal-block, .photo-reveal, .about-fragment, .capability-row, .project-strip, .signal-column, .signal-row, .exhibition-frame, .album-runway, .motion-reveal';

    if (reduceMotionQuery.matches) {
      const markTargets = () => {
        document.querySelectorAll(revealSelector).forEach((target) => target.classList.add('is-inview'));
      };

      markTargets();

      const mutationObserver = new MutationObserver(markTargets);
      mutationObserver.observe(document.body, { childList: true, subtree: true });

      return () => {
        mutationObserver.disconnect();
      };
    }

    const observedTargets = new WeakSet();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-inview');
          } else {
            entry.target.classList.remove('is-inview');
          }
        });
      },
      {
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.16,
      },
    );

    const observeTargets = () => {
      document.querySelectorAll(revealSelector).forEach((target) => {
        if (observedTargets.has(target)) {
          return;
        }

        observedTargets.add(target);
        observer.observe(target);
      });
    };

    observeTargets();

    const mutationObserver = new MutationObserver(observeTargets);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, [isLoading]);

  useEffect(() => {
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const compactViewportQuery = window.matchMedia('(max-width: 860px)');
    const coarsePointerQuery = window.matchMedia('(hover: none), (pointer: coarse)');

    if (reduceMotionQuery.matches || compactViewportQuery.matches || coarsePointerQuery.matches) {
      return undefined;
    }

    const root = document.documentElement;
    let frameId;
    let settleTimer;
    let lastY = window.scrollY;
    let lastTime = performance.now();

    const writeScrollMotion = (motion = 0) => {
      const scrollTop = window.scrollY;
      const maxScroll = Math.max(root.scrollHeight - window.innerHeight, 1);
      const progress = clamp(scrollTop / maxScroll, 0, 1);
      const absMotion = Math.abs(motion);

      root.style.setProperty('--scroll-progress', progress.toFixed(4));
      root.style.setProperty('--scroll-card-y', `${(motion * 5).toFixed(2)}px`);
      root.style.setProperty('--scroll-card-z', `${(absMotion * 5).toFixed(2)}px`);
      root.style.setProperty('--scroll-section-y', `${(motion * 2).toFixed(2)}px`);
      root.style.setProperty('--scroll-title-y', `${(motion * -2).toFixed(2)}px`);
      root.style.setProperty('--scroll-bg-y', `${(-progress * 18 + motion * 6).toFixed(2)}px`);
      root.style.setProperty('--scroll-grid-y', `${(-progress * 28 + motion * 8).toFixed(2)}px`);
      root.style.setProperty('--scroll-particle-y', `${(-progress * 42 + motion * 10).toFixed(2)}px`);
      root.style.setProperty('--scroll-rotate-x', `${(motion * -0.55).toFixed(3)}deg`);
      root.style.setProperty('--scroll-rotate-y', `${(motion * 0.18).toFixed(3)}deg`);
      root.style.setProperty('--scroll-depth-opacity', (0.12 + absMotion * 0.08).toFixed(3));
    };

    const syncScrollMotion = () => {
      const currentY = window.scrollY;
      const currentTime = performance.now();
      const elapsed = Math.max(currentTime - lastTime, 16);
      const delta = currentY - lastY;
      const velocity = clamp(delta / elapsed, -1, 1);
      const motion = clamp(delta / 260 + velocity * 0.18, -0.55, 0.55);

      writeScrollMotion(motion);
      lastY = currentY;
      lastTime = currentTime;
      frameId = undefined;

      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        writeScrollMotion(0);
      }, 120);
    };

    const requestScrollMotion = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(syncScrollMotion);
    };

    writeScrollMotion(0);
    window.addEventListener('scroll', requestScrollMotion, { passive: true });
    window.addEventListener('resize', requestScrollMotion);

    return () => {
      window.clearTimeout(settleTimer);

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener('scroll', requestScrollMotion);
      window.removeEventListener('resize', requestScrollMotion);
    };
  }, []);

  useEffect(() => {
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarsePointerQuery = window.matchMedia('(hover: none), (pointer: coarse)');

    if (reduceMotionQuery.matches || coarsePointerQuery.matches) {
      return undefined;
    }

    let activeCard;
    let frameId;
    let latestEvent;

    const resetCard = (card) => {
      if (!card) {
        return;
      }

      card.classList.remove('is-tilting', 'is-pressed');
      card.style.removeProperty('--tilt-rotate-x');
      card.style.removeProperty('--tilt-rotate-y');
      card.style.removeProperty('--tilt-glow-x');
      card.style.removeProperty('--tilt-glow-y');
      card.style.removeProperty('--tilt-parallax-x');
      card.style.removeProperty('--tilt-parallax-y');
    };

    const writeTilt = () => {
      if (!activeCard || !latestEvent) {
        frameId = undefined;
        return;
      }

      const rect = activeCard.getBoundingClientRect();
      const x = clamp((latestEvent.clientX - rect.left) / rect.width, 0, 1);
      const y = clamp((latestEvent.clientY - rect.top) / rect.height, 0, 1);
      const relativeX = x - 0.5;
      const relativeY = y - 0.5;

      activeCard.classList.add('is-tilting');
      activeCard.style.setProperty('--tilt-rotate-x', `${(-relativeY * 9).toFixed(3)}deg`);
      activeCard.style.setProperty('--tilt-rotate-y', `${(relativeX * 10).toFixed(3)}deg`);
      activeCard.style.setProperty('--tilt-glow-x', `${(x * 100).toFixed(2)}%`);
      activeCard.style.setProperty('--tilt-glow-y', `${(y * 100).toFixed(2)}%`);
      activeCard.style.setProperty('--tilt-parallax-x', `${(relativeX * -14).toFixed(2)}px`);
      activeCard.style.setProperty('--tilt-parallax-y', `${(relativeY * -12).toFixed(2)}px`);
      frameId = undefined;
    };

    const queueTilt = (event) => {
      const card = event.target.closest(tiltCardSelector);

      if (!card) {
        resetCard(activeCard);
        activeCard = undefined;
        latestEvent = undefined;
        return;
      }

      if (activeCard !== card) {
        resetCard(activeCard);
        activeCard = card;
      }

      latestEvent = event;

      if (!frameId) {
        frameId = window.requestAnimationFrame(writeTilt);
      }
    };

    const handlePointerDown = (event) => {
      const card = event.target.closest(pressCardSelector);

      if (card) {
        card.classList.add('is-pressed');
      }
    };

    const handlePointerUp = () => {
      activeCard?.classList.remove('is-pressed');
    };

    const handlePointerLeave = () => {
      resetCard(activeCard);
      activeCard = undefined;
      latestEvent = undefined;
    };

    document.addEventListener('pointermove', queueTilt, { passive: true });
    document.addEventListener('pointerdown', handlePointerDown, { passive: true });
    document.addEventListener('pointerup', handlePointerUp, { passive: true });
    document.addEventListener('pointercancel', handlePointerLeave, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      resetCard(activeCard);
      document.removeEventListener('pointermove', queueTilt);
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointercancel', handlePointerLeave);
      document.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, []);

  const handleSkipLoading = () => {
    revealContent(SKIP_EXIT_ANIMATION_TIME);
  };

  return (
    <>
      <div className={`app-shell${isContentVisible ? ' app-shell--visible' : ''}`}>
        <BackgroundPattern />
        <div className="site-content">
          <Hero />
          {deferredSections.map(({ Component, id, label, minHeight }) => (
            <ViewportMount
              className={`lazy-section-anchor lazy-section-anchor--${id}`}
              id={id}
              key={id}
              minHeight={minHeight}
              placeholderLabel={label}
              rootMargin="560px 0px"
            >
              <Suspense fallback={<SectionFallback label={label} />}>
                <Component sectionId={null} />
              </Suspense>
            </ViewportMount>
          ))}
        </div>
      </div>
      {isLoading && <Loader isLeaving={isLeaving} onSkip={handleSkipLoading} />}
    </>
  );
};

export default App;
