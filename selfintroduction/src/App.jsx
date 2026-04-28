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
