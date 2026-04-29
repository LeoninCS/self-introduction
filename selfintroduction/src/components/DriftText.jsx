const driftVectors = [
  ['-0.95em', '0.34em', '-4deg'],
  ['0.82em', '-0.28em', '3deg'],
  ['-0.26em', '-0.52em', '2deg'],
  ['0.18em', '0.58em', '-2deg'],
  ['0.64em', '0.2em', '4deg'],
  ['-0.58em', '-0.12em', '-3deg'],
];

const cjkPattern = /[\u3400-\u9fff\uf900-\ufaff]/u;

const segmentText = (text, mode) => {
  if (mode === 'word') {
    return text.split(/(\s+)/).filter(Boolean);
  }

  if (mode === 'char' || cjkPattern.test(text)) {
    return Array.from(text);
  }

  return text.split(/(\s+)/).filter(Boolean);
};

const DriftText = ({ as: Tag = 'span', className = '', mode = 'auto', text }) => (
  <Tag className={`drift-text ${className}`.trim()} aria-label={text}>
    {segmentText(text, mode).map((token, index) => {
      const isSpace = /^\s+$/.test(token);
      const [x, y, rotate] = driftVectors[index % driftVectors.length];

      return (
        <span
          aria-hidden="true"
          className={`drift-token${isSpace ? ' drift-token--space' : ''}`}
          key={`${token}-${index}`}
          style={{
            '--drift-delay': `${index * 34}ms`,
            '--drift-rotate': rotate,
            '--drift-x': x,
            '--drift-y': y,
          }}
        >
          {isSpace ? '\u00a0' : token}
        </span>
      );
    })}
  </Tag>
);

export default DriftText;
