import { useEffect, useRef, useState } from 'react';

const transparentPixel =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

const getScrollRoot = (element, selector) => {
  if (!element || !selector) {
    return null;
  }

  return element.closest(selector);
};

const LazyImage = ({
  alt,
  className,
  decoding = 'async',
  fetchPriority,
  loading = 'lazy',
  referrerPolicy,
  rootMargin = '360px 0px',
  rootSelector,
  sizes,
  src,
  srcSet,
}) => {
  const imageRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(loading === 'eager');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (loading === 'eager') {
      setShouldLoad(true);
    }
  }, [loading]);

  useEffect(() => {
    setIsLoaded(false);
  }, [src, srcSet]);

  useEffect(() => {
    const image = imageRef.current;

    if (shouldLoad && image?.complete && image.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [shouldLoad, src, srcSet]);

  useEffect(() => {
    if (shouldLoad) {
      return undefined;
    }

    const image = imageRef.current;

    if (!image || typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        root: getScrollRoot(image, rootSelector),
        rootMargin,
        threshold: 0.01,
      },
    );

    observer.observe(image);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, rootSelector, shouldLoad]);

  return (
    <img
      alt={alt}
      className={`${className ?? ''}${isLoaded ? ' is-loaded' : ''}`.trim() || undefined}
      decoding={decoding}
      fetchPriority={fetchPriority}
      loading={loading}
      onLoad={() => {
        if (shouldLoad && imageRef.current?.naturalWidth > 0) {
          setIsLoaded(true);
        }
      }}
      ref={imageRef}
      referrerPolicy={referrerPolicy}
      sizes={sizes}
      src={shouldLoad ? src : transparentPixel}
      srcSet={shouldLoad ? srcSet : undefined}
    />
  );
};

export default LazyImage;
