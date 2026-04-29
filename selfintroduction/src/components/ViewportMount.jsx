import { useEffect, useRef, useState } from 'react';

const ViewportMount = ({
  as: Component = 'div',
  children,
  className = '',
  id,
  minHeight = '60vh',
  placeholderClassName = '',
  placeholderLabel = 'Loading module',
  rootMargin = '720px 0px',
}) => {
  const [shouldMount, setShouldMount] = useState(false);
  const anchorRef = useRef(null);

  useEffect(() => {
    if (shouldMount) {
      return undefined;
    }

    const anchor = anchorRef.current;

    if (!anchor || typeof IntersectionObserver === 'undefined') {
      setShouldMount(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold: 0.01,
      },
    );

    observer.observe(anchor);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, shouldMount]);

  return (
    <Component
      className={className}
      id={id}
      ref={anchorRef}
      style={shouldMount ? undefined : { minHeight }}
    >
      {shouldMount ? (
        children
      ) : (
        <div
          aria-hidden="true"
          className={`lazy-module-placeholder${placeholderClassName ? ` ${placeholderClassName}` : ''}`}
        >
          <span>{placeholderLabel}</span>
          <i />
        </div>
      )}
    </Component>
  );
};

export default ViewportMount;
