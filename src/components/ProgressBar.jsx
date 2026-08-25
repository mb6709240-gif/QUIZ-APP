export default function ProgressBar({ value, max, label, showPercent = true }) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="progress-container">
      {label && (
        <div className="progress-label">
          <span>{label}</span>
          {showPercent && <span className="progress-percent">{percent}%</span>}
        </div>
      )}
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
