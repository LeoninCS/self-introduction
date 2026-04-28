import { useCallback, useEffect, useRef, useState } from 'react';
import BackgroundPattern from './components/BackgroundPattern';
import Loader from './components/Loader';
import About from './sections/About';
import Hero from './sections/Hero';
import More from './sections/More';
import Projects from './sections/Projects';
import Skills from './sections/Skills';

const MIN_LOADING_TIME = 3200;
const EXIT_ANIMATION_TIME = 900;
const SKIP_EXIT_ANIMATION_TIME = 420;
const CONTENT_REVEAL_DELAY = 80;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

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

    if (reduceMotionQuery.matches) {
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

  const handleSkipLoading = () => {
    revealContent(SKIP_EXIT_ANIMATION_TIME);
  };

  return (
    <>
      <div className={`app-shell${isContentVisible ? ' app-shell--visible' : ''}`}>
        <BackgroundPattern />
        <div className="site-content">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <More />
        </div>
      </div>
      {isLoading && <Loader isLeaving={isLeaving} onSkip={handleSkipLoading} />}
    </>
  );
};

export default App;
