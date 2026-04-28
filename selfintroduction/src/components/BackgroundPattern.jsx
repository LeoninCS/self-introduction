import { useEffect, useRef } from 'react';

const BackgroundPattern = () => {
  const patternRef = useRef(null);

  useEffect(() => {
    let frameId;

    const updateBackgroundOffset = () => {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      const progress = Math.min(window.scrollY / maxScroll, 1);
      const offset = Math.max(window.scrollY * -0.18, -420);
      const drift = Math.sin(progress * Math.PI) * -34;
      const tilt = 6 + progress * 8;
      const roll = progress * -4;

      patternRef.current?.style.setProperty('--background-offset', `${offset}px`);
      patternRef.current?.style.setProperty('--background-drift', `${drift}px`);
      patternRef.current?.style.setProperty('--background-tilt', `${tilt}deg`);
      patternRef.current?.style.setProperty('--background-roll', `${roll}deg`);
      frameId = undefined;
    };

    const handleScroll = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(updateBackgroundOffset);
    };

    const handlePointerMove = (event) => {
      const xRatio = event.clientX / window.innerWidth;
      const yRatio = event.clientY / window.innerHeight;
      const x = (xRatio - 0.5).toFixed(3);
      const y = (yRatio - 0.5).toFixed(3);

      patternRef.current?.style.setProperty('--cursor-x', x);
      patternRef.current?.style.setProperty('--cursor-y', y);
      patternRef.current?.style.setProperty('--cursor-x-pos', `${(xRatio * 100).toFixed(2)}%`);
      patternRef.current?.style.setProperty('--cursor-y-pos', `${(yRatio * 100).toFixed(2)}%`);
    };

    updateBackgroundOffset();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return (
    <div className="background-pattern" ref={patternRef} aria-hidden="true">
      <div className="background-pattern__container" />
      <div className="background-pattern__grid" />
      <div className="background-pattern__beam background-pattern__beam--one" />
      <div className="background-pattern__beam background-pattern__beam--two" />
      <div className="background-pattern__orbit background-pattern__orbit--one" />
      <div className="background-pattern__orbit background-pattern__orbit--two" />
      <div className="background-pattern__particles" />
      <div className="background-pattern__scan" />
      <div className="background-pattern__cursor" />
      <div className="background-pattern__grain" />
    </div>
  );
};

export default BackgroundPattern;
