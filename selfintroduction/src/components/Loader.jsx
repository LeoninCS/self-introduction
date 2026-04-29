const Loader = ({ isLeaving, onSkip }) => {
  const letters = 'LeoinCS'.split('');
  const energyRails = [
    { side: 'top', offset: 12, delay: 0, length: '38%' },
    { side: 'top', offset: 28, delay: 180, length: '44%' },
    { side: 'top', offset: 46, delay: 360, length: '36%' },
    { side: 'top', offset: 67, delay: 120, length: '42%' },
    { side: 'top', offset: 84, delay: 520, length: '34%' },
    { side: 'bottom', offset: 16, delay: 420, length: '36%' },
    { side: 'bottom', offset: 34, delay: 140, length: '42%' },
    { side: 'bottom', offset: 52, delay: 620, length: '34%' },
    { side: 'bottom', offset: 72, delay: 280, length: '44%' },
    { side: 'bottom', offset: 88, delay: 760, length: '32%' },
    { side: 'left', offset: 18, delay: 90, length: '40%' },
    { side: 'left', offset: 38, delay: 510, length: '34%' },
    { side: 'left', offset: 62, delay: 250, length: '43%' },
    { side: 'left', offset: 82, delay: 690, length: '31%' },
    { side: 'right', offset: 16, delay: 330, length: '36%' },
    { side: 'right', offset: 36, delay: 650, length: '42%' },
    { side: 'right', offset: 58, delay: 40, length: '35%' },
    { side: 'right', offset: 78, delay: 470, length: '44%' },
  ];

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSkip();
    }
  };

  return (
    <main
      className={`loader-screen${isLeaving ? ' is-leaving' : ''}`}
      aria-label="Loading page. Click to enter"
      onClick={onSkip}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="loader3-shell">
        <div className="loader3-energy" aria-hidden="true">
          {energyRails.map((rail, index) => (
            <span
              className={`loader3-energy__rail loader3-energy__rail--${rail.side}`}
              key={`${rail.side}-${rail.offset}-${index}`}
              style={{
                '--rail-delay': `${rail.delay}ms`,
                '--rail-length': rail.length,
                '--rail-offset': `${rail.offset}%`,
              }}
            >
              <i />
            </span>
          ))}
          <span className="loader3-energy__ring" />
          <span className="loader3-energy__ring" />
        </div>
        <div className="loader3-kicker">Initializing Interface</div>
        <div className="loader3-wrapper" aria-label="LeoinCS loading">
          {letters.map((letter, index) => (
            <span className="loader3-letter" key={`${letter}-${index}`} style={{ '--letter-index': index }}>
              {letter}
            </span>
          ))}
          <div className="loader3-scan" aria-hidden="true" />
        </div>
        <div className="loader3-status">
          <span />
          Click to enter
        </div>
      </div>
    </main>
  );
};

export default Loader;
