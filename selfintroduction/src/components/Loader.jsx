const Loader = ({ isLeaving, onSkip }) => {
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
      <div className="loader-hand" aria-hidden="true">
        <div className="loader-finger" />
        <div className="loader-finger" />
        <div className="loader-finger" />
        <div className="loader-finger" />
        <div className="loader-palm" />
        <div className="loader-thumb" />
      </div>
    </main>
  );
};

export default Loader;
