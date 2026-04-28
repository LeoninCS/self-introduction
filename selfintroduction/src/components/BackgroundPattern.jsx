import { useEffect, useRef } from 'react';

const BackgroundPattern = () => {
  const patternRef = useRef(null);

  useEffect(() => {
    let pointerFrameId;
    let latestPointer = {
      xRatio: 0.5,
      yRatio: 0.5,
    };

    const syncPointerPosition = () => {
      const { xRatio, yRatio } = latestPointer;
      const x = (xRatio - 0.5).toFixed(3);
      const y = (yRatio - 0.5).toFixed(3);

      patternRef.current?.style.setProperty('--cursor-x', x);
      patternRef.current?.style.setProperty('--cursor-y', y);
      patternRef.current?.style.setProperty('--cursor-x-pos', `${(xRatio * 100).toFixed(2)}%`);
      patternRef.current?.style.setProperty('--cursor-y-pos', `${(yRatio * 100).toFixed(2)}%`);
      pointerFrameId = undefined;
    };

    const handlePointerMove = (event) => {
      latestPointer = {
        xRatio: event.clientX / window.innerWidth,
        yRatio: event.clientY / window.innerHeight,
      };

      if (pointerFrameId) {
        return;
      }

      pointerFrameId = window.requestAnimationFrame(syncPointerPosition);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      if (pointerFrameId) {
        window.cancelAnimationFrame(pointerFrameId);
      }

      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return (
    <div className="background-pattern" ref={patternRef} aria-hidden="true">
      <div className="background-pattern__container" />
      <div className="background-pattern__grid" />
      <div className="background-pattern__particles" />
      <div className="background-pattern__cursor" />
      <div className="background-pattern__grain" />
    </div>
  );
};

export default BackgroundPattern;
