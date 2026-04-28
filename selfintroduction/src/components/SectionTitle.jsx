const SectionTitle = ({ eyebrow, title, children }) => {
  return (
    <div className="section-title">
      <p>{eyebrow}</p>
      <h2 data-title={title}>{title}</h2>
      {children && <div className="section-title__text">{children}</div>}
    </div>
  );
};

export default SectionTitle;
