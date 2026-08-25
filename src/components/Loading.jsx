export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="loading-container">
      <div className="loading-spinner" />
      <p className="loading-message">{message}</p>
    </div>
  );
}
